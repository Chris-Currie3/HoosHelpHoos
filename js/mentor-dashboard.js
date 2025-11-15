// Mentor Dashboard Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

// Load user data
async function loadUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Display user info
            document.getElementById('mentorName').textContent = userData.name;
            document.getElementById('mentorEmail').textContent = userData.email;
            document.getElementById('mentorMajor').textContent = userData.major;
            
            // Display interests
            displayInterests(userData.interests);
        } else {
            console.error('User data not found');
            window.location.href = 'signin.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Display interests
function displayInterests(interests) {
    const container = document.getElementById('interestsContainer');
    
    const interestsHTML = `
        <div style="margin: 20px 0;">
            <p style="color: #232D4B; font-weight: bold; margin-bottom: 10px;">Your Expertise Areas:</p>
            <div class="interests-display">
                ${interests.map(interest => 
                    `<span class="interest-tag">${interest}</span>`
                ).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = interestsHTML;
}
