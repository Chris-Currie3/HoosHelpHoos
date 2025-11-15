# Team Work Division Guide

## 🎨 Person 1: UI/UX Developer (Frontend)

### Your Files:
- ✅ `index.html` (make the sign-in page beautiful)
- ✅ `mentee-dashboard.html` (design the matches display)
- ✅ `mentor-dashboard.html` (design the confirmation page)
- ✅ `css/shared-styles.css` (all styling)

### Your Job:
Make it look amazing! Work on:
- Colors, fonts, spacing
- Animations and transitions
- Mobile responsiveness
- Loading states and error messages
- UVA branding

### You DON'T need to touch:
- Any `.js` files in the `/js` folder
- Firebase setup

### How to test:
- Use Live Server in VS Code
- Focus on making it pretty first
- Functionality will work once Person 2 finishes Firebase

---

## 🔐 Person 2: Authentication Developer (Backend)

### Your Files:
- ✅ `js/firebase-config.js` (MOST IMPORTANT - set this up first!)
- ✅ `js/auth.js` (sign in/sign up logic)
- ✅ Firebase Console (set up the project)

### Your Job:
Get users in and out! Work on:
- Create Firebase project
- Enable Email/Password authentication
- Set up Firestore database
- Add Firebase config to `firebase-config.js`
- Test sign up and sign in
- Handle errors gracefully

### You DON'T need to touch:
- HTML files (except to test)
- CSS files
- Matching algorithm

### Critical First Step:
**EVERYONE WAITS FOR YOU TO FINISH `firebase-config.js`!**
Once you add the real Firebase credentials, the whole app works.

---

## 🧮 Person 3: Algorithm Developer (Backend Logic)

### Your Files:
- ✅ `js/matching-algorithm.js` (THE BRAIN OF THE APP)
- ✅ `js/mentee-dashboard.js` (loads and displays matches)
- ✅ `js/mentor-dashboard.js` (mentor profile logic)

### Your Job:
Make the matching smart! Work on:
- Improve the scoring algorithm
- Add more matching criteria (location, year, etc.)
- Optimize Firestore queries
- Add search/filter options
- Make it fast and efficient

### You DON'T need to touch:
- HTML/CSS (unless adding new features)
- `firebase-config.js` or `auth.js`

### Cool Thing:
You can test `matching-algorithm.js` WITHOUT Firebase!
It's just pure JavaScript functions.

---

## 🔧 Person 4: Integration Lead (Full Stack)

### Your Files:
- ✅ ALL FILES (you're the glue!)

### Your Job:
Make everything work together! Work on:
- Help other team members when stuck
- Test everything as it comes together
- Add new features (messaging, profiles, etc.)
- Fix bugs
- Handle deployment
- Git management

### You need to know:
- A bit of everything
- How to debug
- Git/version control
- Project management

### Your Role:
You're the team lead for technical integration!

---

## 🚀 Suggested Timeline

### Hour 1: Setup
- Person 2: Create Firebase project and update `firebase-config.js`
- Person 1: Start designing the UI
- Person 3: Read the matching algorithm code
- Person 4: Set up Git repo (optional)

### Hour 2: Core Development
- Person 2: Get sign up/sign in working
- Person 1: Style all three pages
- Person 3: Improve matching algorithm
- Person 4: Help Person 2 with Firebase issues

### Hour 3: Integration
- Person 2: Test authentication thoroughly
- Person 1: Polish the UI based on feedback
- Person 3: Optimize database queries
- Person 4: Test everything together, fix bugs

### Hour 4: Final Touches
- Everyone: Test, test, test!
- Person 1: Final UI polish
- Person 2: Add error handling
- Person 3: Fine-tune algorithm weights
- Person 4: Prepare demo and deployment

---

## 💡 Pro Tips

### For Person 1 (UI):
- You can work completely independently at first
- Ask Person 4 to add dummy data so you can style without Firebase
- Focus on making one page perfect, then copy the style to others

### For Person 2 (Auth):
- The `firebase-config.js` file is CRITICAL - get it right!
- Test with your own email addresses first
- Keep the Firebase console open for debugging

### For Person 3 (Algorithm):
- The matching algorithm is in one clean file - easy to modify!
- Test with console.log() to see scores
- Ask Person 2 to create test mentor/mentee accounts

### For Person 4 (Integration):
- Don't write much code at first - help others
- Once basic auth works, start adding features
- Keep everyone in sync on what's working

---

## 📞 Communication is Key!

### Daily Standups (even if it's just 5 mins):
- "What did I do?"
- "What will I do?"
- "Am I blocked?"

### Use a Shared Document:
- Track who's working on what
- Mark tasks as done
- Note any blockers

### Quick Wins:
- Person 2 finishes Firebase config → Everyone can test!
- Person 1 finishes basic UI → Looks professional!
- Person 3 improves algorithm → Better matches!
- Person 4 connects everything → Demo ready!

---

## 🎯 Minimum Viable Product (MVP)

To have a working demo, you MUST have:
1. ✅ Firebase configured (Person 2)
2. ✅ Sign up works (Person 2)
3. ✅ Sign in works (Person 2)
4. ✅ Mentees see matches (Person 3)
5. ✅ Mentors see confirmation (Person 3)
6. ✅ It looks decent (Person 1)

Everything else is a bonus!

---

## 🏆 Stretch Goals (If You Have Time)

- Password reset functionality
- Email verification
- Edit profile feature
- Messaging system
- Admin dashboard
- Better mobile design
- More matching criteria
- Match history
- Ratings/reviews

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't all work on the same file** - Use the assignments above!
2. **Don't wait for everything to be perfect** - Get MVP working first
3. **Don't forget to test frequently** - Test after every change
4. **Don't skip error handling** - What happens when things break?
5. **Don't forget mobile users** - Test on your phone!

---

## 🎉 You've Got This!

Remember: Claude can help each of you individually with your specific part!

Just say:
- "Help me style the sign-in form" (Person 1)
- "Help me debug this Firebase error" (Person 2)  
- "Help me improve the matching algorithm" (Person 3)
- "Help me add a messaging feature" (Person 4)

Good luck! 🚀