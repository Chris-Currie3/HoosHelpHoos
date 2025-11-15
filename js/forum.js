// Forum Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, arrayUnion, query, orderBy, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let currentUserData = null;
let allPosts = [];
let currentCategory = 'all';
let searchTerm = '';

// Check authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await loadUserData(user.uid);
        await loadPosts();
    } else {
        window.location.href = 'signin.html';
    }
});

// Load user data
async function loadUserData(userId) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        currentUserData = { id: userId, ...userDoc.data() };
        document.getElementById('userName').textContent = currentUserData.name;
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'home.html';
});

// Category tabs
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        currentCategory = tab.dataset.category;
        
        const categoryNames = {
            'all': 'All Posts',
            'social': 'Social',
            'clubs': 'Clubs',
            'academics': 'Academics',
            'career': 'Career Preparation'
        };
        
        document.getElementById('categoryTitle').textContent = categoryNames[currentCategory];
        displayPosts();
    });
});

// Search
document.getElementById('searchBtn').addEventListener('click', () => {
    searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    displayPosts();
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchTerm = e.target.value.toLowerCase().trim();
        displayPosts();
    }
});

// Create post modal
document.getElementById('createPostBtn').addEventListener('click', () => {
    document.getElementById('createPostModal').style.display = 'block';
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('createPostModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('createPostModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Create post form submission
document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const category = document.getElementById('postCategory').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    try {
        await addDoc(collection(db, 'forumPosts'), {
            category: category,
            title: title,
            content: content,
            authorId: currentUser.uid,
            authorName: currentUserData.name,
            authorEmail: currentUserData.email,
            agrees: [],
            disagrees: [],
            replies: [],
            createdAt: new Date().toISOString()
        });
        
        // Close modal and reset form
        document.getElementById('createPostModal').style.display = 'none';
        document.getElementById('createPostForm').reset();
        
        // Reload posts
        await loadPosts();
        
        alert('✅ Post created successfully!');
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
    }
});

// Load all posts
async function loadPosts() {
    try {
        const postsQuery = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        
        allPosts = [];
        postsSnapshot.forEach((doc) => {
            allPosts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        displayPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('postsContainer').innerHTML = '<div class="no-posts">Error loading posts. Please refresh the page.</div>';
    }
}

// Display posts based on filters
function displayPosts() {
    let filteredPosts = allPosts;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm)
        );
    }
    
    const postsContainer = document.getElementById('postsContainer');
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">No posts found. Be the first to post!</div>';
        return;
    }
    
    postsContainer.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
    
    // Add event listeners to agree/disagree buttons
    filteredPosts.forEach(post => {
        setupAgreeDisagree(post.id, post.agrees || [], post.disagrees || []);
    });
}

// Create post card HTML
function createPostCard(post) {
    const agreeCount = (post.agrees || []).length;
    const disagreeCount = (post.disagrees || []).length;
    const replyCount = (post.replies || []).length;
    
    const hasAgreed = (post.agrees || []).includes(currentUser.uid);
    const hasDisagreed = (post.disagrees || []).includes(currentUser.uid);
    
    const categoryLabels = {
        'social': '🎉 Social',
        'clubs': '⚽ Clubs',
        'academics': '📚 Academics',
        'career': '💼 Career Preparation'
    };
    
    const initials = post.authorName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const timeAgo = getTimeAgo(new Date(post.createdAt));
    
    return `
        <div class="post-card" onclick="viewPost('${post.id}')">
            <div class="post-header">
                <div class="post-author">
                    <div class="author-avatar">${initials}</div>
                    <div>
                        <strong>${post.authorName}</strong>
                        <div style="font-size: 0.85em; color: #999;">${timeAgo}</div>
                    </div>
                </div>
                <span class="post-category-badge">${categoryLabels[post.category]}</span>
            </div>
            
            <h3 class="post-title">${post.title}</h3>
            <p class="post-content">${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}</p>
            
            <div class="post-footer" onclick="event.stopPropagation()">
                <div class="post-stats">
                    <div class="stat-item">
                        💬 ${replyCount} ${replyCount === 1 ? 'Reply' : 'Replies'}
                    </div>
                </div>
                
                <div class="agree-disagree-section">
                    <button class="agree-btn ${hasAgreed ? 'active' : ''}" data-post-id="${post.id}" data-action="agree">
                        👍 <span class="count">${agreeCount}</span> Agree
                    </button>
                    <button class="disagree-btn ${hasDisagreed ? 'active' : ''}" data-post-id="${post.id}" data-action="disagree">
                        👎 <span class="count">${disagreeCount}</span> Disagree
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Setup agree/disagree functionality
function setupAgreeDisagree(postId, agrees, disagrees) {
    const agreeBtn = document.querySelector(`.agree-btn[data-post-id="${postId}"]`);
    const disagreeBtn = document.querySelector(`.disagree-btn[data-post-id="${postId}"]`);
    
    if (agreeBtn) {
        agreeBtn.addEventListener('click', async () => {
            await toggleAgreeDisagree(postId, 'agree');
        });
    }
    
    if (disagreeBtn) {
        disagreeBtn.addEventListener('click', async () => {
            await toggleAgreeDisagree(postId, 'disagree');
        });
    }
}

// Toggle agree/disagree
async function toggleAgreeDisagree(postId, action) {
    try {
        const postRef = doc(db, 'forumPosts', postId);
        const postDoc = await getDoc(postRef);
        
        if (!postDoc.exists()) return;
        
        const postData = postDoc.data();
        let agrees = postData.agrees || [];
        let disagrees = postData.disagrees || [];
        
        const userId = currentUser.uid;
        
        if (action === 'agree') {
            if (agrees.includes(userId)) {
                // Remove agree
                agrees = agrees.filter(id => id !== userId);
            } else {
                // Add agree and remove disagree if exists
                agrees.push(userId);
                disagrees = disagrees.filter(id => id !== userId);
            }
        } else {
            if (disagrees.includes(userId)) {
                // Remove disagree
                disagrees = disagrees.filter(id => id !== userId);
            } else {
                // Add disagree and remove agree if exists
                disagrees.push(userId);
                agrees = agrees.filter(id => id !== userId);
            }
        }
        
        await updateDoc(postRef, {
            agrees: agrees,
            disagrees: disagrees
        });
        
        // Reload posts to update UI
        await loadPosts();
        
    } catch (error) {
        console.error('Error toggling agree/disagree:', error);
        alert('Failed to update. Please try again.');
    }
}

// View individual post (we'll create this page next)
window.viewPost = function(postId) {
    window.location.href = `post.html?id=${postId}`;
};

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
}
