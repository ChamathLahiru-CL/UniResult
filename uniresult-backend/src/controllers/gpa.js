import StudentResult from '../models/StudentResult.js';
import {
    calculateCumulativeGPA,
    calculateLevelGPA,
    calculateSemesterGPA,
    calculateProjectedGPA
} from '../services/gpaCalculator.js';

/**
 * Get GPA Analytics for logged-in student
 * GET /api/gpa/analytics
 */
export const getGPAAnalytics = async (req, res) => {
    try {
        const user = req.user;
        
        // Get registration number from user (same logic as getMyResults)
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        // Fetch all results for the student by registration number
        const results = await StudentResult.find({ 
            registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') }
        })
            .populate({
                path: 'resultSheet',
                match: { isDeleted: { $ne: true } }, // Exclude deleted results
                select: 'subjectName faculty department uploadedAt'
            })
            .sort({ level: 1, semester: 1, createdAt: -1 });
        
        // Filter out results where resultSheet was deleted (populate returns null)
        const activeResults = results.filter(r => r.resultSheet !== null);

        // DEBUG: Log sample results to check data structure
        console.log('=== GPA DEBUG ===');
        console.log('Registration No:', registrationNo);
        console.log('Active results found:', activeResults.length, `(filtered out ${results.length - activeResults.length} deleted results)`);
        if (activeResults.length > 0) {
            console.log('Sample result data:');
            activeResults.slice(0, 3).forEach((r, i) => {
                console.log(`  Result ${i + 1}: grade="${r.grade}", credits=${r.credits}, level="${r.level}", semester="${r.semester}", subject="${r.subjectName}"`);
            });
        }
        console.log('=================');

        if (!activeResults || activeResults.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    overall: {
                        currentGPA: 0,
                        totalCredits: 0,
                        earnedCredits: 0,
                        qualityPoints: 0,
                        totalSubjects: 0,
                        trend: null,
                        trendValue: null
                    },
                    levels: {},
                    projections: null,
                    hasResults: false
                }
            });
        }

        // Calculate cumulative GPA with level breakdown
        const gpaData = calculateCumulativeGPA(activeResults);

        // Transform level data into object format for frontend
        const levelsObject = {};
        
        // Initialize all levels (100, 200, 300, 400)
        ['100', '200', '300', '400'].forEach(levelNum => {
            levelsObject[levelNum] = {
                level: `${levelNum} Level`,
                gpa: 0,
                creditHours: 0,
                trend: null,
                trendValue: null,
                semesters: []
            };
        });
        
        // Fill in actual data for levels with results
        gpaData.levels.forEach(levelData => {
            const levelKey = levelData.levelNumber || levelData.level.replace(' Level', '').replace(/\s+/g, '');
            
            // Calculate trend for this level
            let levelTrend = null;
            let levelTrendValue = null;
            
            if (levelData.semesters.length >= 2) {
                const semestersWithGPA = levelData.semesters.filter(s => s.gpa > 0);
                if (semestersWithGPA.length >= 2) {
                    const lastSem = semestersWithGPA[semestersWithGPA.length - 1];
                    const prevSem = semestersWithGPA[semestersWithGPA.length - 2];
                    levelTrendValue = Math.round((lastSem.gpa - prevSem.gpa) * 100) / 100;
                    levelTrend = levelTrendValue > 0 ? 'up' : levelTrendValue < 0 ? 'down' : 'stable';
                }
            }
            
            levelsObject[levelKey] = {
                level: levelData.level,
                gpa: levelData.gpa,
                creditHours: levelData.totalCredits,
                trend: levelTrend,
                trendValue: levelTrendValue,
                semesters: levelData.semesters.map(sem => ({
                    semester: sem.semester,
                    gpa: sem.gpa,
                    credits: sem.totalCredits,
                    subjects: sem.subjects,
                    status: sem.gpa > 0 ? 'completed' : 'in-progress'
                }))
            };
        });

        // Calculate projections (assuming 4-year program with 120 credits)
        const totalProgramCredits = 120;
        const targetGPA = 3.80;
        const projections = calculateProjectedGPA(
            gpaData.currentGPA,
            gpaData.totalCredits,
            targetGPA,
            totalProgramCredits - gpaData.totalCredits
        );

        res.status(200).json({
            success: true,
            data: {
                overall: {
                    currentGPA: gpaData.currentGPA,
                    totalCredits: gpaData.totalCredits,
                    completedCredits: gpaData.earnedCredits,
                    qualityPoints: gpaData.qualityPoints,
                    totalSubjects: gpaData.totalSubjects,
                    trend: gpaData.trend,
                    trendValue: gpaData.trendValue,
                    targetGPA: targetGPA,
                    projectedGPA: projections.projectedGPA,
                    maxPossibleGPA: projections.maxPossibleGPA
                },
                levels: levelsObject,
                projections: {
                    ...projections,
                    remainingCredits: totalProgramCredits - gpaData.totalCredits
                },
                hasResults: true,
                lastUpdated: new Date()
            }
        });

    } catch (error) {
        console.error('Error fetching GPA analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching GPA analytics',
            error: error.message
        });
    }
};

/**
 * Get GPA by Level
 * GET /api/gpa/by-level
 */
export const getGPAByLevel = async (req, res) => {
    try {
        const user = req.user;
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        const results = await StudentResult.find({ 
            registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') }
        })
            .populate({
                path: 'resultSheet',
                match: { isDeleted: { $ne: true } }, // Exclude deleted results
                select: 'subjectName faculty department'
            })
            .sort({ level: 1, semester: 1 });
        
        // Filter out results where resultSheet was deleted (populate returns null)
        const activeResults = results.filter(r => r.resultSheet !== null);

        if (!activeResults || activeResults.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const levelData = calculateLevelGPA(activeResults);

        res.status(200).json({
            success: true,
            data: levelData
        });

    } catch (error) {
        console.error('Error fetching GPA by level:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching GPA by level',
            error: error.message
        });
    }
};

/**
 * Get GPA by Semester
 * GET /api/gpa/by-semester
 */
export const getGPABySemester = async (req, res) => {
    try {
        const user = req.user;
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        const results = await StudentResult.find({ 
            registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') }
        })
            .populate({
                path: 'resultSheet',
                match: { isDeleted: { $ne: true } }, // Exclude deleted results
                select: 'subjectName faculty department'
            })
            .sort({ semester: 1 });
        
        // Filter out results where resultSheet was deleted (populate returns null)
        const activeResults = results.filter(r => r.resultSheet !== null);

        if (!activeResults || activeResults.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const semesterData = calculateSemesterGPA(activeResults);

        res.status(200).json({
            success: true,
            data: semesterData
        });

    } catch (error) {
        console.error('Error fetching GPA by semester:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching GPA by semester',
            error: error.message
        });
    }
};

/**
 * Get GPA Trend Data (for charts)
 * GET /api/gpa/trend
 */
export const getGPATrend = async (req, res) => {
    try {
        const user = req.user;
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        const results = await StudentResult.find({ 
            registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') }
        })
            .populate({
                path: 'resultSheet',
                match: { isDeleted: { $ne: true } }, // Exclude deleted results
                select: 'subjectName uploadedAt'
            })
            .sort({ semester: 1, createdAt: 1 });
        
        // Filter out results where resultSheet was deleted (populate returns null)
        const activeResults = results.filter(r => r.resultSheet !== null);

        if (!activeResults || activeResults.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    labels: [],
                    gpaValues: [],
                    cumulativeGPA: [],
                    targetGPA: 3.80
                }
            });
        }

        const semesterData = calculateSemesterGPA(activeResults);
        
        // Calculate cumulative GPA progression
        let cumulativeGPA = [];
        let runningQualityPoints = 0;
        let runningCredits = 0;
        
        semesterData.forEach(semester => {
            runningQualityPoints += semester.qualityPoints;
            runningCredits += semester.totalCredits;
            const cgpa = runningCredits > 0 ? runningQualityPoints / runningCredits : 0;
            cumulativeGPA.push(Math.round(cgpa * 100) / 100);
        });

        res.status(200).json({
            success: true,
            data: {
                labels: semesterData.map(s => s.semester),
                gpaValues: semesterData.map(s => s.gpa),
                cumulativeGPA: cumulativeGPA,
                targetGPA: 3.80,
                semesters: semesterData
            }
        });

    } catch (error) {
        console.error('Error fetching GPA trend:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching GPA trend',
            error: error.message
        });
    }
};

/**
 * Calculate what-if GPA scenarios
 * POST /api/gpa/calculate-scenario
 * Body: { targetGPA, remainingCredits }
 */
export const calculateGPAScenario = async (req, res) => {
    try {
        const user = req.user;
        const registrationNo = user.enrollmentNumber || user.username;
        const { targetGPA, remainingCredits } = req.body;

        if (!targetGPA || !remainingCredits) {
            return res.status(400).json({
                success: false,
                message: 'Target GPA and remaining credits are required'
            });
        }

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        const results = await StudentResult.find({ 
            registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') }
        });

        if (!results || results.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No results found for GPA calculation'
            });
        }

        const gpaData = calculateCumulativeGPA(results);
        const projections = calculateProjectedGPA(
            gpaData.currentGPA,
            gpaData.totalCredits,
            parseFloat(targetGPA),
            parseInt(remainingCredits)
        );

        res.status(200).json({
            success: true,
            data: {
                currentGPA: gpaData.currentGPA,
                completedCredits: gpaData.totalCredits,
                targetGPA: parseFloat(targetGPA),
                remainingCredits: parseInt(remainingCredits),
                ...projections
            }
        });

    } catch (error) {
        console.error('Error calculating GPA scenario:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating GPA scenario',
            error: error.message
        });
    }
};

export default {
    getGPAAnalytics,
    getGPAByLevel,
    getGPABySemester,
    getGPATrend,
    calculateGPAScenario
};
