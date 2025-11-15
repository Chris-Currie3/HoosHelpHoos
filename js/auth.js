// Authentication Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sign out user on page load to clear session
signOut(auth).catch(() => {});

// DOM Elements
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const showSignUpLink = document.getElementById('showSignUp');
const showSignInLink = document.getElementById('showSignIn');
const errorMessage = document.getElementById('errorMessage');

// Toggle between sign in and sign up forms
showSignUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    signInForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
    errorMessage.style.display = 'none';
});

showSignInLink.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.classList.add('hidden');
    signInForm.classList.remove('hidden');
    errorMessage.style.display = 'none';
});

// Role selection visual feedback
const roleOptions = document.querySelectorAll('.role-option');
roleOptions.forEach(option => {
    option.addEventListener('click', () => {
        roleOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
    });
});

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Sign Up
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const major = document.getElementById('major').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    const interests = document.getElementById('interests').value.split(',').map(i => i.trim());

    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            major: major,
            role: role,
            interests: interests,
            createdAt: new Date().toISOString()
        });

        // Redirect based on role
        if (role === 'mentee') {
            window.location.href = 'mentee-dashboard.html';
        } else {
            window.location.href = 'mentor-dashboard.html';
        }
    } catch (error) {
        console.error('Sign up error:', error);
        showError(error.message);
    }
});

// Sign In
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    try {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Redirect based on role
            if (userData.role === 'mentee') {
                window.location.href = 'mentee-dashboard.html';
            } else {
                window.location.href = 'mentor-dashboard.html';
            }
        } else {
            showError('User data not found. Please contact support.');
        }
    } catch (error) {
        console.error('Sign in error:', error);
        showError('Invalid email or password');
    }
});
