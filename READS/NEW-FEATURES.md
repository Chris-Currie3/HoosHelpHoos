# 🆕 New Features: Calendar & Survey System

## Overview

We've added two major features to HoosHelpHoos:

1. **Personality/Workstyle Survey** - Improves matching by understanding communication styles and preferences
2. **Calendar Scheduling System** - Mentors set availability, mentees book meetings

---

## 📊 Feature 1: Survey System

### How It Works

**When users sign up:**
1. Complete basic profile (name, email, major, interests)
2. Automatically redirected to survey page
3. Answer 5 questions on a 1-5 scale
4. Survey responses saved to Firebase
5. Redirected to appropriate dashboard

### Survey Questions (1-5 Scale)

1. **Communication Style**
   - 1 = Formal & Structured
   - 5 = Casual & Flexible

2. **Meeting Frequency**
   - 1 = Once a month
   - 5 = Multiple times per week

3. **Learning/Teaching Style**
   - 1 = Hands-on & Practical
   - 5 = Theoretical & Conceptual

4. **Feedback Style**
   - 1 = Direct & Honest
   - 5 = Gentle & Encouraging

5. **Goal Orientation**
   - 1 = Specific skills/career focused
   - 5 = General growth/networking

### How It Affects Matching

The algorithm now uses a **weighted system**:
- **30%** - Major compatibility
- **45%** - Interest overlap
- **25%** - Personality/workstyle compatibility (NEW!)

**Personality matching:**
- Compares survey responses between mentee and mentor
- Smaller differences = better match
- Similar communication styles and goals = higher compatibility score

### Files Involved
- `survey.html` - Survey interface
- `js/matching-algorithm.js` - Updated with personality scoring
- `js/auth.js` - Redirects to survey after signup

---

## 📅 Feature 2: Calendar Scheduling System

### User Flow

#### For Mentors:
1. Complete profile + survey
2. Redirected to `mentor-calendar.html`
3. Select available days and times for next 30 days
4. Quick actions: "Select All Weekdays", "Select Weekends", "Clear All"
5. Save availability to Firebase
6. Can return anytime to update availability

#### For Mentees:
1. Complete profile + survey
2. See top 3 matched mentors
3. Click "📅 Schedule a Meeting" on any mentor
4. Modal shows mentor's available times
5. Select a time slot
6. Click "Confirm Booking"
7. Meeting saved for both users

### Features

**Mentor Calendar:**
- Shows next 30 days
- Pre-selected time slots: 10:00 AM, 2:00 PM, 4:00 PM
- Can click individual times to toggle
- Quick actions for bulk selection
- Saves to Firebase `availability` field

**Mentee Scheduling:**
- Modal popup with mentor's available times
- Grouped by date
- Click to select time
- One-click booking
- Confirmation message

### Data Structure

**Mentor availability (stored in Firestore):**
```javascript
{
  availability: {
    "2024-11-20": ["10:00 AM", "2:00 PM", "4:00 PM"],
    "2024-11-21": ["10:00 AM", "2:00 PM"],
    "2024-11-22": ["10:00 AM"]
  }
}
```

**Scheduled meetings:**
```javascript
{
  meetings: [
    {
      mentorId: "abc123",
      mentorName: "John Doe",
      mentorEmail: "jd@virginia.edu",
      menteeId: "xyz789",
      menteeName: "Jane Smith",
      menteeEmail: "js@virginia.edu",
      date: "2024-11-20",
      time: "10:00 AM",
      status: "scheduled",
      createdAt: "2024-11-15T10:30:00Z"
    }
  ]
}
```

### Files Involved
- `mentor-calendar.html` - Mentor availability interface
- `mentee-dashboard.html` - Updated with scheduling modal
- `js/mentee-dashboard.js` - Scheduling functionality

---

## 🔧 Technical Implementation

### Algorithm Changes

**Before:**
```javascript
weights = {
    major: 40,
    interests: 60
}
```

**After:**
```javascript
weights = {
    major: 30,
    interests: 45,
    personality: 25  // NEW!
}
```

**Personality Score Calculation:**
```javascript
function calculatePersonalityMatch(menteeSurvey, mentorSurvey) {
    // Compare each question (1-5 scale)
    // Calculate absolute difference
    // Normalize to 0-1 scale
    // Smaller difference = higher score
    return score;
}
```

### Firebase Structure

**User document now includes:**
```javascript
{
  // Existing fields
  name: "John Doe",
  email: "jd@virginia.edu",
  major: "Computer Science",
  role: "mentor",
  interests: ["AI", "Web Dev"],
  
  // NEW: Survey responses
  survey: {
    communication: 3,
    meetingFrequency: 4,
    learningStyle: 2,
    feedbackStyle: 4,
    goalOrientation: 3
  },
  surveyCompleted: true,
  surveyCompletedAt: "2024-11-15T10:30:00Z",
  
  // NEW: Availability (mentors only)
  availability: {
    "2024-11-20": ["10:00 AM", "2:00 PM"],
    "2024-11-21": ["10:00 AM"]
  },
  
  // NEW: Meetings (both mentors and mentees)
  meetings: [
    {
      mentorId: "...",
      menteeId: "...",
      date: "2024-11-20",
      time: "10:00 AM",
      status: "scheduled"
    }
  ]
}
```

---

## 🧪 Testing Guide

### Test Survey System:

1. **Create a new mentor account:**
   - Fill out basic info
   - Should redirect to survey.html
   - Answer all 5 questions
   - Should redirect to mentor-calendar.html

2. **Create a new mentee account:**
   - Fill out basic info
   - Should redirect to survey.html
   - Answer all 5 questions
   - Should redirect to mentee-dashboard.html

3. **Check survey responses in Firebase:**
   - Open Firebase Console
   - Go to Firestore Database
   - Find user document
   - Should see `survey` field with 5 responses

### Test Calendar System:

1. **As a mentor, set availability:**
   - Navigate to mentor-calendar.html (or redirected after survey)
   - Click on time slots to select
   - Try "Select All Weekdays" button
   - Click "Save Availability"
   - Check Firebase - should see `availability` field

2. **As a mentee, book a meeting:**
   - View mentor matches
   - Click "📅 Schedule a Meeting"
   - Modal should show mentor's available times
   - Select a time slot
   - Click "Confirm Booking"
   - Should see confirmation message
   - Check Firebase - both users should have `meetings` array

3. **Edge cases to test:**
   - Mentor with no availability set
   - Try to book the same slot twice
   - Cancel and reopen modal
   - Close modal without booking

---

## 📱 User Interface Updates

### New Pages:
1. **survey.html** - Survey interface with radio buttons
2. **mentor-calendar.html** - Calendar grid with time slots

### Updated Pages:
1. **mentee-dashboard.html** - Added "Schedule a Meeting" button and modal
2. **mentor-dashboard.html** - Added link to calendar page

### New UI Components:
- Survey radio button scales (1-5)
- Calendar grid layout
- Scheduling modal
- Time slot selection interface
- Quick action buttons

---

## 🎯 Team Division for These Features

### Person 1 (UI Developer):
- Style the survey page (make it pretty!)
- Improve calendar grid layout
- Style the scheduling modal
- Add animations to time slot selection
- Make it mobile-responsive

### Person 2 (Backend/Auth):
- Already done! Survey saves to Firebase
- Could add survey validation
- Could add "edit survey" functionality

### Person 3 (Algorithm):
- Already done! Personality matching integrated
- Could adjust weights based on testing
- Could add more sophisticated personality matching

### Person 4 (Integration):
- Test the full flow end-to-end
- Add meeting notifications
- Add "view my meetings" page
- Add ability to cancel meetings
- Integrate email notifications

---

## 🚀 Future Enhancements

### Short-term (hackathon):
- [ ] Show scheduled meetings on dashboards
- [ ] Add "My Meetings" page
- [ ] Email notifications when meeting is booked
- [ ] Ability to cancel meetings
- [ ] Prevent double-booking same time slot

### Long-term (post-hackathon):
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Video call integration (Zoom, Google Meet)
- [ ] Recurring meetings
- [ ] Meeting reminders
- [ ] Feedback after meetings
- [ ] More survey questions
- [ ] Machine learning for better matching

---

## 🐛 Known Issues & Limitations

1. **No conflict prevention** - Same time slot can be booked multiple times
2. **No meeting management** - Can't view, edit, or cancel meetings yet
3. **No notifications** - Users don't get email when meeting is booked
4. **Calendar limited to 30 days** - Can't set availability beyond next month
5. **Static time slots** - Fixed at 10 AM, 2 PM, 4 PM (but can be customized)

---

## 💡 Quick Wins to Implement

These are easy additions that make big impact:

1. **"My Meetings" page** (30 mins)
   - Query meetings array
   - Display upcoming meetings
   - Show past meetings

2. **Email notifications** (45 mins)
   - Use Firebase Functions
   - Send email when meeting booked
   - Include calendar invite

3. **Prevent double booking** (15 mins)
   - Before booking, check if slot taken
   - Remove from available slots if booked

4. **Survey results page** (30 mins)
   - Show user their survey responses
   - Compare with matches
   - Allow editing

---

## 📊 Matching Score Examples

**Example 1: Perfect Match**
- Same major: +30 points
- 3/3 interests match: +45 points
- Similar survey responses: +25 points
- **Total: 100% match**

**Example 2: Good Match**
- Related major: +15 points
- 2/3 interests match: +30 points
- Somewhat similar responses: +15 points
- **Total: 60% match**

**Example 3: Poor Match**
- Different major: +0 points
- 0/3 interests match: +0 points
- Very different responses: +5 points
- **Total: 5% match**

---

## ✅ Testing Checklist

Before demoing, test:

- [ ] Sign up as mentor → Survey → Calendar
- [ ] Sign up as mentee → Survey → Dashboard
- [ ] Mentor can set availability
- [ ] Mentee can see available times
- [ ] Booking creates meeting in Firebase
- [ ] Survey affects match scores
- [ ] Similar personalities rank higher
- [ ] Different personalities rank lower
- [ ] Modal opens and closes properly
- [ ] Time slots are clickable
- [ ] Confirmation message shows
- [ ] Can book different mentors

---

## 🎓 Demo Script

For your hackathon presentation:

1. **Show the problem:**
   "UVA students struggle to find compatible mentors"

2. **Show basic matching:**
   "We match by major and interests"

3. **Introduce survey:**
   "But we also consider personality compatibility"
   [Show survey interface]

4. **Show improved matching:**
   "Notice how mentors with similar communication styles rank higher"

5. **Show scheduling:**
   "Once matched, mentees can instantly book meetings"
   [Click schedule button]
   [Show available times]
   [Book a meeting]

6. **Emphasize convenience:**
   "No more back-and-forth emails to find a time!"

Good luck! 🚀
