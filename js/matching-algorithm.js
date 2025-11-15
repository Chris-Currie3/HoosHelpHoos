// Matching Algorithm Module

/**
 * Calculate match score between mentee and mentor
 * @param {Object} mentee - Mentee user data
 * @param {Object} mentor - Mentor user data
 * @returns {number} Match score from 0-100
 */
export function calculateMatchScore(mentee, mentor) {
    let score = 0;
    const weights = {
        major: 30,
        interests: 45,
        personality: 25
    };

    // Major matching (exact match or related)
    if (mentee.major.toLowerCase() === mentor.major.toLowerCase()) {
        score += weights.major;
    } else if (mentee.major.toLowerCase().includes(mentor.major.toLowerCase()) || 
               mentor.major.toLowerCase().includes(mentee.major.toLowerCase())) {
        score += weights.major * 0.5;
    }

    // Interest matching
    const menteeInterests = mentee.interests.map(i => i.toLowerCase());
    const mentorInterests = mentor.interests.map(i => i.toLowerCase());
    
    let matchingInterests = 0;
    menteeInterests.forEach(interest => {
        if (mentorInterests.some(mi => mi.includes(interest) || interest.includes(mi))) {
            matchingInterests++;
        }
    });

    const interestScore = (matchingInterests / Math.max(menteeInterests.length, 1)) * weights.interests;
    score += interestScore;

    // Personality/workstyle matching (if surveys exist)
    if (mentee.survey && mentor.survey) {
        const personalityScore = calculatePersonalityMatch(mentee.survey, mentor.survey);
        score += personalityScore * weights.personality;
    }

    return Math.min(Math.round(score), 100);
}

/**
 * Calculate personality compatibility from survey responses
 * @param {Object} menteeSurvey - Mentee's survey responses (1-5 scale)
 * @param {Object} mentorSurvey - Mentor's survey responses (1-5 scale)
 * @returns {number} Compatibility score from 0-1
 */
function calculatePersonalityMatch(menteeSurvey, mentorSurvey) {
    // Survey questions and how we score them
    const questions = [
        'greekLife',         // Similar scores = good match (lifestyle compatibility)
        'clubInvolvement',   // Similar scores = good match (activity level)
        'nightlife',         // Similar scores = good match (social habits)
        'academicFocus',     // Similar scores = good match (priorities)
        'studyHabits'        // Similar scores = good match (work style)
    ];

    let totalDifference = 0;
    let questionsAnswered = 0;

    questions.forEach(question => {
        if (menteeSurvey[question] && mentorSurvey[question]) {
            // Calculate difference (0-4 range, where 0 is perfect match)
            const difference = Math.abs(menteeSurvey[question] - mentorSurvey[question]);
            totalDifference += difference;
            questionsAnswered++;
        }
    });

    if (questionsAnswered === 0) return 0.5; // Neutral score if no survey data

    // Convert to 0-1 scale (smaller difference = better match)
    // Max possible difference per question is 4, so max total is 4 * questionsAnswered
    const maxPossibleDifference = 4 * questionsAnswered;
    const normalizedDifference = totalDifference / maxPossibleDifference;
    
    // Invert so that smaller difference = higher score
    return 1 - normalizedDifference;
}

/**
 * Find top mentor matches for a mentee
 * @param {Object} menteeData - Mentee user data
 * @param {Array} allMentors - Array of all mentor user data
 * @param {number} topN - Number of top matches to return
 * @returns {Array} Array of top N matched mentors with scores
 */
export function findTopMatches(menteeData, allMentors, topN = 3) {
    // Calculate scores for all mentors
    const mentorsWithScores = allMentors.map(mentor => ({
        ...mentor,
        matchScore: calculateMatchScore(menteeData, mentor)
    }));

    // Sort by match score (highest first) and return top N
    return mentorsWithScores
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, topN);
}
