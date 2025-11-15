// Mentee Dashboard Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import { findTopMatches } from './matching-algorithm.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentMenteeData = null;
let selectedMentor = null;
let selectedTimeSlot = null;

// Check authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await loadUserData(user.uid);
    } else {
        window.location.href = 'index.html';
    }
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Load user data and find matches
async function loadUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            currentMenteeData = { id: userId, ...userData }; // Store for later use
            
            // Display user info
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userMajor').textContent = userData.major;
            
            // Find and display matches
            await findMatches(userData);
        } else {
            console.error('User data not found');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Find mentor matches
async function findMatches(menteeData) {
    try {
        // Get all mentors from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const mentors = [];

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.role === 'mentor') {
                mentors.push({
                    id: doc.id,
                    ...userData
                });
            }
        });

        // Use matching algorithm to find top 3 matches
        const topMatches = findTopMatches(menteeData, mentors, 3);

        // Display matches
        displayMatches(topMatches);
    } catch (error) {
        console.error('Error finding matches:', error);
        document.getElementById('mentorsList').innerHTML = 
            '<div class="loading">Error loading matches. Please refresh the page.</div>';
    }
}

// Display mentor matches
function displayMatches(matches) {
    const mentorsList = document.getElementById('mentorsList');
    
    if (matches.length === 0) {
        mentorsList.innerHTML = '<div class="loading">No mentors available yet. Check back soon!</div>';
        return;
    }

    mentorsList.innerHTML = '';
    
    const rankLabels = ['🥇 Best Match', '🥈 Second Best', '🥉 Third Best'];
    
    matches.forEach((mentor, index) => {
        const card = document.createElement('div');
        card.className = 'mentor-card';
        
        card.innerHTML = `
            <span class="match-rank">${rankLabels[index]}</span>
            <h3 class="mentor-name">${mentor.name}</h3>
            <p class="mentor-major">${mentor.major}</p>
            
            <div class="match-score">
                <div class="match-score-label">Match Score</div>
                <div class="match-score-bar">
                    <div class="match-score-fill" style="width: ${mentor.matchScore}%"></div>
                </div>
                <div class="match-score-value">${mentor.matchScore}% Compatible</div>
            </div>
            
            <div class="interests-section">
                <div class="interests-label">Interests & Expertise:</div>
                <div class="interests-tags">
                    ${mentor.interests.map(interest => 
                        `<span class="interest-tag">${interest}</span>`
                    ).join('')}
                </div>
            </div>
            
            <button class="schedule-btn" data-mentor-id="${mentor.id}" data-mentor-name="${mentor.name}">
                📅 Schedule a Meeting
            </button>
            
            <button class="contact-btn" onclick="contactMentor('${mentor.email}', '${mentor.name}')">
                ✉️ Email ${mentor.name.split(' ')[0]}
            </button>
        `;
        
        mentorsList.appendChild(card);
    });

    // Add click handlers for schedule buttons
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mentorId = e.target.dataset.mentorId;
            const mentorName = e.target.dataset.mentorName;
            const mentor = matches.find(m => m.id === mentorId);
            openSchedulingModal(mentor);
        });
    });
}

// Contact mentor function (exposed globally)
window.contactMentor = function(email, name) {
    const subject = encodeURIComponent('HoosHelpHoos - Mentorship Request');
    const body = encodeURIComponent(`Hi ${name},\n\nI found your profile on HoosHelpHoos and would love to connect with you as a mentor!\n\nBest regards`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};

// Scheduling Modal Functions
function openSchedulingModal(mentor) {
    selectedMentor = mentor;
    selectedTimeSlot = null;
    
    const modal = document.getElementById('schedulingModal');
    const mentorNameSpan = document.getElementById('modalMentorName');
    const availabilityContainer = document.getElementById('availabilityContainer');
    const confirmBtn = document.getElementById('confirmBooking');
    
    mentorNameSpan.textContent = mentor.name;
    confirmBtn.disabled = true;
    
    // Display availability
    if (mentor.availability && Object.keys(mentor.availability).length > 0) {
        let html = '<div class="availability-grid">';
        
        // Sort dates
        const sortedDates = Object.keys(mentor.availability).sort();
        
        sortedDates.forEach(date => {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
            });
            
            html += `
                <div class="date-group">
                    <div class="date-label">${formattedDate}</div>
                    <div class="time-slots-grid">
            `;
            
            mentor.availability[date].forEach(time => {
                html += `
                    <button class="time-slot-btn" data-date="${date}" data-time="${time}">
                        ${time}
                    </button>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        availabilityContainer.innerHTML = html;
        
        // Add click handlers to time slots
        document.querySelectorAll('.time-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Deselect all
                document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
                
                // Select this one
                e.target.classList.add('selected');
                selectedTimeSlot = {
                    date: e.target.dataset.date,
                    time: e.target.dataset.time
                };
                
                confirmBtn.disabled = false;
            });
        });
    } else {
        availabilityContainer.innerHTML = '<p style="color: #666;">This mentor hasn\'t set their availability yet. Please contact them directly via email.</p>';
    }
    
    modal.style.display = 'block';
}

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('schedulingModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('schedulingModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Confirm booking
document.getElementById('confirmBooking').addEventListener('click', async () => {
    if (!selectedTimeSlot || !selectedMentor) return;
    
    try {
        const confirmBtn = document.getElementById('confirmBooking');
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Booking...';
        
        // Create meeting object
        const meeting = {
            mentorId: selectedMentor.id,
            mentorName: selectedMentor.name,
            mentorEmail: selectedMentor.email,
            menteeId: currentMenteeData.id,
            menteeName: currentMenteeData.name,
            menteeEmail: currentMenteeData.email,
            date: selectedTimeSlot.date,
            time: selectedTimeSlot.time,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };
        
        // Add to mentee's meetings
        await updateDoc(doc(db, 'users', currentMenteeData.id), {
            meetings: arrayUnion(meeting)
        });
        
        // Add to mentor's meetings
        await updateDoc(doc(db, 'users', selectedMentor.id), {
            meetings: arrayUnion(meeting)
        });
        
        // Close modal
        document.getElementById('schedulingModal').style.display = 'none';
        
        // Show success message
        alert(`✅ Meeting scheduled with ${selectedMentor.name} on ${new Date(selectedTimeSlot.date).toLocaleDateString()} at ${selectedTimeSlot.time}!`);
        
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Booking';
    } catch (error) {
        console.error('Error booking meeting:', error);
        alert('Failed to schedule meeting. Please try again.');
        document.getElementById('confirmBooking').disabled = false;
        document.getElementById('confirmBooking').textContent = 'Confirm Booking';
    }
});
