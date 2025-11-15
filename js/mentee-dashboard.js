// Mentee Dashboard Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
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
        window.location.href = 'home.html';
    }
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'home.html';
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
            currentMenteeData = { id: userId, ...userData };
            
            // Display user info
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userMajor').textContent = userData.major;
            
            // Display meetings
            displayMeetings(userData.meetings || []);
            
            // Find and display matches
            await findMatches(userData);
        } else {
            console.error('User data not found');
            window.location.href = 'signin.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Display meetings
function displayMeetings(meetings) {
    const meetingsList = document.getElementById('meetingsList');
    
    if (!meetings || meetings.length === 0) {
        meetingsList.innerHTML = '<p class="no-meetings">No upcoming meetings scheduled yet. Book a meeting with a mentor below!</p>';
        return;
    }
    
    // Filter for future meetings and sort by date
    const now = new Date();
    const upcomingMeetings = meetings
        .filter(m => new Date(m.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (upcomingMeetings.length === 0) {
        meetingsList.innerHTML = '<p class="no-meetings">No upcoming meetings scheduled yet. Book a meeting with a mentor below!</p>';
        return;
    }
    
    meetingsList.innerHTML = upcomingMeetings.map(meeting => {
        const date = new Date(meeting.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="meeting-card">
                <p><strong>👤 Mentor:</strong> ${meeting.mentorName}</p>
                <p><strong>📧 Email:</strong> ${meeting.mentorEmail}</p>
                <p><strong>📅 Date:</strong> ${formattedDate}</p>
                <p><strong>🕐 Time:</strong> ${meeting.time}</p>
            </div>
        `;
    }).join('');
}

// Find mentor matches
async function findMatches(menteeData) {
    try {
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

        const topMatches = findTopMatches(menteeData, mentors, 3);
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
            
            <button class="contact-btn" data-mentor-email="${mentor.email}" data-mentor-name="${mentor.name}">
                ✉️ Email ${mentor.name.split(' ')[0]}
            </button>
        `;
        
        mentorsList.appendChild(card);
    });

    // Add click handlers for schedule buttons
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mentorId = e.target.dataset.mentorId;
            const mentor = matches.find(m => m.id === mentorId);
            openSchedulingModal(mentor);
        });
    });

    // Add click handlers for contact buttons - shows nice popup instead of alert
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const email = e.target.dataset.mentorEmail;
            const name = e.target.dataset.mentorName;
            showEmailNotification(email, name);
        });
    });
}

// Show success notification on page
function showSuccessNotification(mentorName, date, time) {
    const notification = document.getElementById('successNotification');
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('notifMentorName').textContent = mentorName;
    document.getElementById('notifDate').textContent = formattedDate;
    document.getElementById('notifTime').textContent = time;
    
    notification.classList.add('show');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 8000);
}

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
    
    if (mentor.availability && Object.keys(mentor.availability).length > 0) {
        let html = '<div class="availability-grid">';
        
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
        
        document.querySelectorAll('.time-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
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

window.addEventListener('click', (event) => {
    const modal = document.getElementById('schedulingModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Confirm booking
document.getElementById('confirmBooking').addEventListener('click', async () => {
    if (!selectedTimeSlot || !selectedMentor) {
        alert('Please select a time slot first!');
        return;
    }
    
    const confirmBtn = document.getElementById('confirmBooking');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Booking...';
    
    try {
        console.log('Starting booking process...');
        
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
        
        // Get mentee's current data
        const menteeRef = doc(db, 'users', currentMenteeData.id);
        const menteeDoc = await getDoc(menteeRef);
        
        if (!menteeDoc.exists()) {
            throw new Error('Mentee document not found');
        }
        
        const menteeData = menteeDoc.data();
        const menteeMeetings = menteeData.meetings || [];
        
        await updateDoc(menteeRef, {
            meetings: [...menteeMeetings, meeting]
        });
        
        console.log('Added meeting to mentee');
        
        // Get mentor's current data
        const mentorRef = doc(db, 'users', selectedMentor.id);
        const mentorDoc = await getDoc(mentorRef);
        
        if (!mentorDoc.exists()) {
            throw new Error('Mentor document not found');
        }
        
        const mentorData = mentorDoc.data();
        const mentorMeetings = mentorData.meetings || [];
        
        await updateDoc(mentorRef, {
            meetings: [...mentorMeetings, meeting]
        });
        
        console.log('Added meeting to mentor');
        
        // Close modal
        document.getElementById('schedulingModal').style.display = 'none';
        
        // Show success notification
        showSuccessNotification(selectedMentor.name, selectedTimeSlot.date, selectedTimeSlot.time);
        
        // Refresh meetings list
        currentMenteeData.meetings = [...menteeMeetings, meeting];
        displayMeetings(currentMenteeData.meetings);
        
        // Reset button
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Booking';
        
    } catch (error) {
        console.error('Detailed error booking meeting:', error);
        alert(`❌ Failed to schedule meeting.\n\nError: ${error.message}\n\nPlease check:\n1. You're signed in\n2. The mentor exists in the system\n3. Your internet connection\n4. Firestore security rules allow updates\n\nCheck the console for more details.`);
        
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Booking';
    }
});
