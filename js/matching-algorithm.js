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
        major: 40,
        interests: 60
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

    return Math.min(Math.round(score), 100);
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
