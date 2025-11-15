# HoosHelpHoos Project Structure

## 📁 File Organization

```
HoosHelpHoos/
├── index.html                      # Main sign-in/sign-up page
├── mentee-dashboard.html           # Mentee dashboard showing matches
├── mentor-dashboard.html           # Mentor confirmation page
├── css/
│   └── shared-styles.css          # Common styles across all pages
├── js/
│   ├── firebase-config.js         # Firebase configuration
│   ├── auth.js                    # Authentication logic
│   ├── matching-algorithm.js      # Mentor matching algorithm
│   ├── mentee-dashboard.js        # Mentee dashboard logic
│   └── mentor-dashboard.js        # Mentor dashboard logic
└── README.md                       # Setup instructions
```

## 🎯 How to Divide the Work

### Person 1: Frontend/UI Developer
**Files to work on:**
- `index.html` - HTML structure and styling for auth page
- `mentee-dashboard.html` - HTML structure and styling
- `mentor-dashboard.html` - HTML structure and styling
- `css/shared-styles.css` - Styling across all pages

**Tasks:**
- Improve UI/UX design
- Make responsive for mobile
- Add animations and transitions
- Customize color scheme
- Add loading states

**Skills needed:**
- HTML/CSS
- Basic JavaScript (for understanding what to style)

---

### Person 2: Authentication & Database Developer
**Files to work on:**
- `js/firebase-config.js` - Firebase setup
- `js/auth.js` - Sign in/sign up logic
- Firebase Console - Database structure and security rules

**Tasks:**
- Set up Firebase project
- Configure authentication
- Set up Firestore database
- Write security rules
- Handle authentication errors
- Add email verification (optional)
- Add password reset functionality

**Skills needed:**
- Firebase
- JavaScript (Promises, async/await)
- Database design

---

### Person 3: Matching Algorithm & Backend Logic
**Files to work on:**
- `js/matching-algorithm.js` - Core matching logic
- `js/mentee-dashboard.js` - Mentee-specific functionality
- `js/mentor-dashboard.js` - Mentor-specific functionality

**Tasks:**
- Improve matching algorithm weights
- Add more matching criteria (year, location, etc.)
- Optimize database queries
- Add filtering/sorting options
- Implement search functionality
- Add pagination for many matches

**Skills needed:**
- JavaScript algorithms
- Firebase Firestore queries
- Data structures

---

### Person 4: Integration & Features
**Files to work on:**
- All files (connecting everything together)
- New feature files as needed

**Tasks:**
- Ensure all components work together
- Add messaging system
- Add profile editing
- Add admin dashboard
- Handle edge cases
- Testing and bug fixing
- Deployment setup

**Skills needed:**
- Full-stack JavaScript
- Debugging
- Testing
- Version control (Git)

---

## 🔧 Key JavaScript Modules Explained

### `firebase-config.js`
- **Purpose**: Central location for Firebase credentials
- **What it does**: Exports the Firebase configuration object
- **Who touches it**: Person 2 (Auth developer) sets it up, everyone uses it
- **Important**: Only needs to be configured once!

### `auth.js`
- **Purpose**: Handles all authentication (sign in, sign up, logout)
- **What it does**: 
  - Creates new user accounts
  - Signs in existing users
  - Stores user data in Firestore
  - Redirects to appropriate dashboard
- **Dependencies**: `firebase-config.js`
- **Used by**: `index.html`

### `matching-algorithm.js`
- **Purpose**: Core matching logic
- **What it does**:
  - `calculateMatchScore()`: Compares mentee and mentor profiles
  - `findTopMatches()`: Returns top N matches sorted by score
- **Key variables**:
  - `weights.major`: How much major compatibility matters (default: 40%)
  - `weights.interests`: How much interest overlap matters (default: 60%)
- **Pure functions**: No Firebase dependencies, easy to test!
- **Used by**: `mentee-dashboard.js`

### `mentee-dashboard.js`
- **Purpose**: Mentee dashboard functionality
- **What it does**:
  - Loads current user data
  - Fetches all mentors from database
  - Uses matching algorithm to find top matches
  - Displays results with scores
- **Dependencies**: `firebase-config.js`, `matching-algorithm.js`
- **Used by**: `mentee-dashboard.html`

### `mentor-dashboard.js`
- **Purpose**: Mentor dashboard functionality
- **What it does**:
  - Loads current user data
  - Displays mentor profile
  - Shows interests/expertise
- **Dependencies**: `firebase-config.js`
- **Used by**: `mentor-dashboard.html`

---

## 🚀 Development Workflow

### Setup (Everyone does this once):
1. Clone/download the project
2. Person 2 sets up Firebase and updates `firebase-config.js`
3. Install Live Server extension in VS Code

### Parallel Development:
- **Person 1** can work on HTML/CSS without Firebase working yet
- **Person 2** sets up Firebase and gets auth working
- **Person 3** can develop matching algorithm in isolation (just JavaScript!)
- **Person 4** waits for basic auth to work, then adds features

### Integration Points:
- When Person 2 finishes auth, Person 3 and 4 can test with real data
- When Person 3 finishes algorithm improvements, Person 1 can style the results
- Person 4 ensures everyone's code works together

---

## 🧪 Testing Without Full Setup

### Test Matching Algorithm (Person 3):
```javascript
// In browser console or separate test file:
import { calculateMatchScore } from './js/matching-algorithm.js';

const mentee = {
    major: "Computer Science",
    interests: ["AI", "Web Dev"]
};

const mentor = {
    major: "Computer Science", 
    interests: ["AI", "Mobile Apps"]
};

console.log(calculateMatchScore(mentee, mentor)); // Should output a score
```

### Test UI Without Firebase (Person 1):
- Comment out the `<script type="module">` tags
- Add dummy data directly in HTML
- Style everything to perfection
- Re-add scripts when Person 2 finishes

---

## 📦 What Each Person Needs to Know

### Person 1 (UI):
- HTML, CSS
- Basic DOM manipulation
- Don't need to understand Firebase

### Person 2 (Auth):
- Firebase Authentication API
- Firebase Firestore API
- JavaScript Promises/async-await
- Error handling

### Person 3 (Algorithm):
- JavaScript functions and arrays
- Algorithm design
- Firebase queries (for optimization)
- Don't need to know authentication!

### Person 4 (Integration):
- Everything above
- Git for version control
- Debugging skills
- Project management

---

## 🎯 Git Workflow Suggestion

```bash
# Person 1 creates branch
git checkout -b feature/ui-improvements

# Person 2 creates branch
git checkout -b feature/firebase-setup

# Person 3 creates branch
git checkout -b feature/algorithm-improvements

# Person 4 reviews and merges
git checkout main
git merge feature/firebase-setup
git merge feature/ui-improvements
# etc.
```

---

## ⚡ Quick Start for Each Person

### Person 1 (UI Developer):
```bash
1. Open index.html, mentee-dashboard.html, mentor-dashboard.html
2. Open css/shared-styles.css
3. Make it beautiful!
4. Test in browser using Live Server
```

### Person 2 (Auth Developer):
```bash
1. Go to console.firebase.google.com
2. Create new project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Copy config to js/firebase-config.js
6. Test sign up/sign in works
```

### Person 3 (Algorithm Developer):
```bash
1. Open js/matching-algorithm.js
2. Improve the matching logic
3. Test with sample data
4. Open js/mentee-dashboard.js
5. Optimize database queries
```

### Person 4 (Integration):
```bash
1. Wait for basic auth to work
2. Start adding new features
3. Test everything together
4. Fix bugs
5. Deploy!
```

---

## 🔥 Common Issues & Solutions

### Issue: Firebase not defined
**Solution**: Make sure you're running through a web server (Live Server), not opening files directly

### Issue: CORS errors
**Solution**: Use Live Server or any local web server, not `file://` protocol

### Issue: Changes not showing up
**Solution**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Module import errors
**Solution**: Make sure paths in HTML files match actual file locations

### Issue: Firebase config not working
**Solution**: Double-check you copied the config correctly and it's in `firebase-config.js`

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Async JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)

Good luck with your hackathon! 🚀