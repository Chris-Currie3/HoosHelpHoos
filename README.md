# HoosHelpHoos - Mentor Matching Platform

A web application that matches UVA students with mentors based on their interests and majors using a weighted matching algorithm.

## Features

- **User Authentication**: Sign up and sign in with Firebase Authentication
- **Role-Based Access**: Separate dashboards for mentees and mentors
- **Smart Matching**: Weighted algorithm that matches mentees with the top 3 mentors based on:
  - Major compatibility (40% weight)
  - Shared interests (60% weight)
- **Auto Sign-Out**: Automatically clears session on page load for fresh logins
- **Responsive Design**: Works on desktop and mobile devices

## Files Included

1. **index.html** - Main sign-in/sign-up page
2. **mentee-dashboard.html** - Dashboard showing top 3 mentor matches
3. **mentor-dashboard.html** - Confirmation page for mentors

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name (e.g., "HoosHelpHoos")

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click "Get Started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

### 3. Create Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location closest to your users
5. Click "Enable"

### 4. Set Up Firestore Security Rules (Important!)

1. In Firestore, go to the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

### 5. Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "HoosHelpHoos Web")
6. Copy the Firebase configuration object

### 6. Update Your HTML Files

Replace the Firebase config in **ALL THREE FILES** (index.html, mentee-dashboard.html, mentor-dashboard.html):

Find this section in each file:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Replace it with your actual Firebase config:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

### 7. Run the Application

#### Option A: Using Live Server in VS Code (Recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. The page will automatically reload when you make changes

#### Option B: Using Python's Built-in Server
```bash
# In the project directory
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

#### Option C: Using Node.js http-server
```bash
# Install globally
npm install -g http-server

# Run in project directory
http-server
```

## How It Works

### User Flow

1. **New Users**: Create an account by selecting their role (mentee/mentor), entering their information, and interests
2. **Returning Users**: Sign in with their email and password
3. **Auto Sign-Out**: Each page load automatically signs out the user to ensure a fresh session

### For Mentees:
- After signing in, they see their top 3 mentor matches
- Each match shows:
  - Match score (0-100%)
  - Mentor's name, major, and interests
  - A "Connect" button that opens their email client

### For Mentors:
- After signing in, they see a confirmation page
- Told they will be contacted when mentees want to connect

### Matching Algorithm

The algorithm calculates a match score (0-100%) based on:

**Major Matching (40% weight):**
- Exact match: Full 40 points
- Partial match: 20 points
- No match: 0 points

**Interest Matching (60% weight):**
- Calculated based on the percentage of shared interests
- More shared interests = higher score

**Example:**
- Mentee: Computer Science major, interests: [AI, Web Development, Research]
- Mentor: Computer Science major, interests: [AI, Mobile Apps, Research]
- Match Score: 40 (major) + 40 (2/3 interests match) = 80%

## Database Structure

### Users Collection
```javascript
{
  userId: {
    name: "John Doe",
    email: "jd3ab@virginia.edu",
    major: "Computer Science",
    role: "mentee" | "mentor",
    interests: ["AI", "Web Development", "Research"],
    createdAt: "2024-11-15T10:30:00Z"
  }
}
```

## Testing

### Create Test Accounts:

**Mentor 1:**
- Email: mentor1@virginia.edu
- Major: Computer Science
- Interests: AI, Machine Learning, Research

**Mentor 2:**
- Email: mentor2@virginia.edu
- Major: Computer Science  
- Interests: Web Development, Mobile Apps

**Mentee:**
- Email: mentee@virginia.edu
- Major: Computer Science
- Interests: AI, Web Development

The mentee should see both mentors ranked by match score!

## Troubleshooting

### "Firebase not defined" error
- Make sure you're serving the files through a web server (not opening directly as `file://`)
- Check that your internet connection is working (Firebase loads from CDN)

### Authentication errors
- Verify Email/Password authentication is enabled in Firebase Console
- Check that your Firebase config is correctly pasted in all three HTML files

### No mentors showing up
- Make sure you've created at least one mentor account
- Check the browser console for errors
- Verify Firestore rules are set up correctly

### Session not clearing
- The page uses `signOut(auth)` on load - this is intentional
- If you want to stay signed in, remove the `signOut(auth).catch(() => {});` line from index.html

## Customization

### Change the weights in the matching algorithm:
In `mentee-dashboard.html`, find the `calculateMatchScore` function:
```javascript
let weights = {
    major: 40,  // Change these values
    interests: 60
};
```

### Change the number of matches shown:
In `mentee-dashboard.html`, find this line:
```javascript
const topMatches = mentors.slice(0, 3);  // Change 3 to any number
```

## Security Notes

- The current Firestore rules are set to "test mode" for development
- For production, implement proper security rules
- Consider adding email verification
- Add rate limiting for authentication attempts

## Future Enhancements

- Admin dashboard to view all matches
- Messaging system within the platform
- Match history tracking
- User profiles with more details
- Calendar integration for scheduling meetings
- Feedback and rating system

## Credits

Built for UVA Hackathon 2024
Team: [Your Team Name]

## License

MIT License - Feel free to use and modify for your hackathon project!