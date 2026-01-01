/**
 * GPA Calculator Service
 * Handles GPA calculation based on grades and credits
 */

// Grade point mapping
const gradePoints = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0,
    'W': null,  // Withdrawn - doesn't count
    'I': null,  // Incomplete - doesn't count
    'P': null,  // Pass (no grade points)
    'NP': null  // No Pass (no grade points)
};

/**
 * Convert letter grade to grade point
 */
export const getGradePoint = (grade) => {
    if (!grade) return null;
    
    // Normalize grade (uppercase, trim spaces)
    const normalizedGrade = grade.toString().toUpperCase().trim();
    
    return gradePoints[normalizedGrade] !== undefined ? gradePoints[normalizedGrade] : null;
};

/**
 * Calculate GPA for a set of results
 * @param {Array} results - Array of result objects with grade and credits
 * @returns {Object} - { gpa, totalCredits, earnedCredits, qualityPoints }
 */
export const calculateGPA = (results) => {
    let totalQualityPoints = 0;
    let totalCredits = 0;
    let earnedCredits = 0;

    // DEBUG: Log calculation details
    console.log(`\n🔢 Calculating GPA for ${results.length} results...`);

    results.forEach((result, index) => {
        const gradePoint = getGradePoint(result.grade);
        const credits = parseFloat(result.credits) || 0;

        // DEBUG: Log each result
        if (index < 5) { // Only log first 5 to avoid spam
            console.log(`  [${index + 1}] Grade: "${result.grade}" → Points: ${gradePoint}, Credits: ${credits}, QP: ${gradePoint !== null && credits > 0 ? (gradePoint * credits) : 0}`);
        }

        // Skip results with no grade points (W, I, P, NP) or invalid grades
        if (gradePoint !== null && credits > 0) {
            totalQualityPoints += gradePoint * credits;
            totalCredits += credits;
            
            // Earned credits (passing grades)
            if (gradePoint > 0) {
                earnedCredits += credits;
            }
        }
    });

    const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits) : 0;

    console.log(`  Total QP: ${totalQualityPoints}, Total Credits: ${totalCredits}, GPA: ${gpa}`);

    return {
        gpa: Math.round(gpa * 100) / 100, // Round to 2 decimal places
        totalCredits,
        earnedCredits,
        qualityPoints: Math.round(totalQualityPoints * 100) / 100
    };
};

/**
 * Calculate GPA by semester
 * @param {Array} results - Array of result objects
 * @returns {Array} - Array of semester GPA data
 */
export const calculateSemesterGPA = (results) => {
    // Group results by semester
    const semesterGroups = {};

    results.forEach(result => {
        const semester = result.semester || 'Unknown';
        if (!semesterGroups[semester]) {
            semesterGroups[semester] = [];
        }
        semesterGroups[semester].push(result);
    });

    // Calculate GPA for each semester
    return Object.entries(semesterGroups).map(([semester, semesterResults]) => {
        const gpaData = calculateGPA(semesterResults);
        return {
            semester,
            ...gpaData,
            subjects: semesterResults.length,
            results: semesterResults
        };
    }).sort((a, b) => {
        // Sort semesters (1st, 2nd, 3rd, etc.)
        const semesterOrder = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
        return semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester);
    });
};

/**
 * Calculate GPA by level
 * @param {Array} results - Array of result objects
 * @returns {Array} - Array of level GPA data
 */
export const calculateLevelGPA = (results) => {
    // Group results by level
    const levelGroups = {};

    results.forEach(result => {
        const level = result.level || 'Unknown';
        if (!levelGroups[level]) {
            levelGroups[level] = [];
        }
        levelGroups[level].push(result);
    });

    // Calculate GPA for each level
    return Object.entries(levelGroups).map(([level, levelResults]) => {
        const gpaData = calculateGPA(levelResults);
        const semesterData = calculateSemesterGPA(levelResults);
        
        // Format level name (100 -> 100 Level)
        const levelDisplay = level !== 'Unknown' ? `${level} Level` : level;
        
        return {
            level: levelDisplay,
            levelNumber: level,
            ...gpaData,
            semesters: semesterData,
            subjects: levelResults.length
        };
    }).sort((a, b) => {
        // Sort levels (100, 200, 300, 400)
        return parseInt(a.levelNumber) - parseInt(b.levelNumber);
    });
};

/**
 * Calculate cumulative GPA (CGPA)
 * @param {Array} results - Array of all result objects
 * @returns {Object} - Cumulative GPA data
 */
export const calculateCumulativeGPA = (results) => {
    const levelData = calculateLevelGPA(results);
    const overallGPA = calculateGPA(results);
    
    // Calculate trends
    const levelsWithGPA = levelData.filter(level => level.gpa > 0);
    let trend = null;
    let trendValue = null;
    
    if (levelsWithGPA.length >= 2) {
        const lastLevel = levelsWithGPA[levelsWithGPA.length - 1];
        const previousLevel = levelsWithGPA[levelsWithGPA.length - 2];
        
        trendValue = Math.round((lastLevel.gpa - previousLevel.gpa) * 100) / 100;
        trend = trendValue > 0 ? 'up' : trendValue < 0 ? 'down' : 'stable';
    }
    
    return {
        currentGPA: overallGPA.gpa,
        totalCredits: overallGPA.totalCredits,
        earnedCredits: overallGPA.earnedCredits,
        qualityPoints: overallGPA.qualityPoints,
        levels: levelData,
        trend,
        trendValue,
        totalSubjects: results.length
    };
};

/**
 * Calculate projected GPA based on target and remaining credits
 * @param {Number} currentGPA - Current cumulative GPA
 * @param {Number} completedCredits - Credits completed so far
 * @param {Number} targetGPA - Target GPA to achieve
 * @param {Number} remainingCredits - Credits remaining in program
 * @returns {Object} - Projection data
 */
export const calculateProjectedGPA = (currentGPA, completedCredits, targetGPA, remainingCredits) => {
    // Calculate quality points needed
    const currentQualityPoints = currentGPA * completedCredits;
    const totalCreditsNeeded = completedCredits + remainingCredits;
    const targetQualityPoints = targetGPA * totalCreditsNeeded;
    const remainingQualityPoints = targetQualityPoints - currentQualityPoints;
    
    // Calculate required GPA for remaining credits
    const requiredGPA = remainingCredits > 0 
        ? remainingQualityPoints / remainingCredits 
        : 0;
    
    // Check if target is achievable
    const isAchievable = requiredGPA <= 4.0 && requiredGPA >= 0;
    
    // Calculate maximum possible GPA (if student gets 4.0 in all remaining courses)
    const maxPossibleGPA = (currentQualityPoints + (remainingCredits * 4.0)) / totalCreditsNeeded;
    
    return {
        requiredGPA: Math.round(requiredGPA * 100) / 100,
        isAchievable,
        maxPossibleGPA: Math.round(maxPossibleGPA * 100) / 100,
        projectedGPA: isAchievable ? targetGPA : Math.round(maxPossibleGPA * 100) / 100
    };
};

export default {
    getGradePoint,
    calculateGPA,
    calculateSemesterGPA,
    calculateLevelGPA,
    calculateCumulativeGPA,
    calculateProjectedGPA
};
