import StudentResult from '../models/StudentResult.js';
import AcademicAchievement from '../models/AcademicAchievement.js';
import {
    calculateCumulativeGPA,
    calculateSemesterGPA
} from '../services/gpaCalculator.js';

/**
 * Get Academic Progress for logged-in student
 * GET /api/academic-progress
 */
export const getAcademicProgress = async (req, res) => {
    try {
        const user = req.user;

        // Get registration number from user
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
            .sort({ academicYear: 1, semester: 1, createdAt: -1 });
        
        // Filter out results where resultSheet was deleted (populate returns null)
        const activeResults = results.filter(r => r.resultSheet !== null);

        // Fetch academic achievements
        const achievements = await AcademicAchievement.findByStudent(user._id);

        // Calculate overall GPA data
        const gpaData = calculateCumulativeGPA(activeResults);

        // Group results by academic year and semester
        const semestersByYear = {};
        const processedSemesters = new Set();

        activeResults.forEach(result => {
            const year = result.academicYear;
            const semesterKey = `${year}-${result.semester}`;

            if (!semestersByYear[year]) {
                semestersByYear[year] = [];
            }

            // Check if we've already processed this semester
            if (!processedSemesters.has(semesterKey)) {
                processedSemesters.add(semesterKey);

                // Get all courses for this semester
                const semesterCourses = results.filter(r =>
                    r.academicYear === year && r.semester === result.semester
                ).map(r => ({
                    code: r.courseCode,
                    name: r.subjectName,
                    grade: r.grade,
                    credits: r.credits
                }));

                // Calculate semester GPA
                const semesterGPA = calculateSemesterGPA(semesterCourses);

                // Determine semester status
                const hasGrades = semesterCourses.some(course => course.grade && course.grade.trim() !== '');
                const allCompleted = semesterCourses.every(course => course.grade && course.grade.trim() !== '');

                let status = 'upcoming';
                if (allCompleted) {
                    status = 'completed';
                } else if (hasGrades) {
                    status = 'in-progress';
                }

                semestersByYear[year].push({
                    name: result.semester,
                    gpa: semesterGPA > 0 ? semesterGPA : null,
                    credits: semesterCourses.reduce((sum, course) => sum + (course.credits || 0), 0),
                    completed: status === 'completed',
                    inProgress: status === 'in-progress',
                    courses: semesterCourses
                });
            }
        });

        // Sort semesters within each year
        Object.keys(semestersByYear).forEach(year => {
            semestersByYear[year].sort((a, b) => {
                const semesterOrder = { '1st Semester': 1, '2nd Semester': 2, '3rd Semester': 3, '4th Semester': 4 };
                return semesterOrder[a.name] - semesterOrder[b.name];
            });
        });

        // Calculate overall progress
        const totalCredits = 120; // Assuming 4-year program
        const completedCredits = gpaData.earnedCredits;
        const currentGPA = gpaData.currentGPA;
        const targetGPA = 3.8;

        // Count total courses and completed courses
        const allCourses = results.length;
        const completedCourses = results.filter(r => r.grade && r.grade.trim() !== '').length;

        // Transform achievements for frontend
        const transformedAchievements = achievements.map(achievement => ({
            title: achievement.title,
            semester: `${achievement.academicYear} - ${achievement.semester}`,
            type: achievement.achievementType,
            awardedDate: achievement.awardedDate
        }));

        // Determine current year and semester
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString();
        const currentMonth = currentDate.getMonth() + 1;

        // Simple logic to determine current semester (can be enhanced)
        let currentSemester = '1st Semester';
        if (currentMonth >= 7) {
            currentSemester = '2nd Semester';
        }

        const response = {
            success: true,
            data: {
                overallProgress: {
                    totalCredits,
                    completedCredits,
                    currentGPA,
                    targetGPA,
                    coursesCompleted: completedCourses,
                    totalCourses: allCourses
                },
                semesters: semestersByYear,
                achievements: transformedAchievements,
                currentStatus: {
                    year: currentYear,
                    semester: currentSemester
                },
                lastUpdated: new Date()
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching academic progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch academic progress',
            error: error.message
        });
    }
};

/**
 * Add academic achievement for a student (admin/exam division only)
 * POST /api/academic-progress/achievement
 */
export const addAcademicAchievement = async (req, res) => {
    try {
        const { studentId, title, description, semester, academicYear, achievementType, awardedBy } = req.body;

        // Validate required fields
        if (!studentId || !title || !semester || !academicYear) {
            return res.status(400).json({
                success: false,
                message: 'Student ID, title, semester, and academic year are required'
            });
        }

        // Create new achievement
        const achievement = new AcademicAchievement({
            student: studentId,
            title,
            description,
            semester,
            academicYear,
            achievementType: achievementType || 'other',
            awardedBy
        });

        await achievement.save();

        res.status(201).json({
            success: true,
            message: 'Academic achievement added successfully',
            data: achievement
        });

    } catch (error) {
        console.error('Error adding academic achievement:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add academic achievement',
            error: error.message
        });
    }
};

/**
 * Get academic achievements for logged-in student
 * GET /api/academic-progress/achievements
 */
export const getAcademicAchievements = async (req, res) => {
    try {
        const user = req.user;

        const achievements = await AcademicAchievement.findByStudent(user._id);

        res.status(200).json({
            success: true,
            data: achievements
        });

    } catch (error) {
        console.error('Error fetching academic achievements:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch academic achievements',
            error: error.message
        });
    }
};