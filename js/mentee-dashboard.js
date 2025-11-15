// Mentee Dashboard Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import { findTopMatches } from './matching-algorithm.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
            
            <button class="contact-btn" onclick="contactMentor('${mentor.email}', '${mentor.name}')">
                Connect with ${mentor.name.split(' ')[0]}
            </button>
        `;
        
        mentorsList.appendChild(card);
    });
}

// Contact mentor function (exposed globally)
window.contactMentor = function(email, name) {
    const subject = encodeURIComponent('HoosHelpHoos - Mentorship Request');
    const body = encodeURIComponent(`Hi ${name},\n\nI found your profile on HoosHelpHoos and would love to connect with you as a mentor!\n\nBest regards`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};
