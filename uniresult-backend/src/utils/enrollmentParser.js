// Utility functions for parsing enrollment numbers

// Mapping from department code to faculty and department
const departmentMapping = {
    'ICT': { faculty: 'Faculty of Technological Studies', department: 'ICT' },
    'ET': { faculty: 'Faculty of Technological Studies', department: 'ET' },
    'BST': { faculty: 'Faculty of Technological Studies', department: 'BST' },
    'SET': { faculty: 'Faculty of Applied Science', department: 'SET' },
    'CST': { faculty: 'Faculty of Applied Science', department: 'CST' },
    'IIT': { faculty: 'Faculty of Applied Science', department: 'IIT' },
    'ENM': { faculty: 'Faculty of Management', department: 'ENM' },
    'EAG': { faculty: 'Faculty of Management', department: 'EAG' },
    'English Lit': { faculty: 'Faculty of Management', department: 'English Lit' },
    'TEA': { faculty: 'Faculty of Agriculture', department: 'TEA' },
    'DOC': { faculty: 'Faculty of Medicine', department: 'DOC' }
};

/**
 * Parses an enrollment number and returns the expected faculty and department
 * @param {string} enrollmentNumber - The enrollment number in format UWU/DEPT/YY/NNN
 * @returns {object} - { faculty: string, department: string, year: string, identity: string } or null if invalid
 */
export const parseEnrollmentNumber = (enrollmentNumber) => {
    if (!enrollmentNumber || typeof enrollmentNumber !== 'string') {
        return null;
    }

    // Expected format: UWU/DEPT/YY/NNN
    const parts = enrollmentNumber.split('/');
    if (parts.length !== 4) {
        return null;
    }

    const [university, deptCode, year, identity] = parts;

    // Validate university
    if (university !== 'UWU') {
        return null;
    }

    // Validate year (should be 2 digits)
    if (!/^\d{2}$/.test(year)) {
        return null;
    }

    // Validate identity (should be 3 digits)
    if (!/^\d{3}$/.test(identity)) {
        return null;
    }

    // Check if department code exists in mapping
    const deptInfo = departmentMapping[deptCode];
    if (!deptInfo) {
        return null;
    }

    return {
        faculty: deptInfo.faculty,
        department: deptInfo.department,
        year: year,
        identity: identity,
        university: university
    };
};

/**
 * Validates if the provided faculty and department match the enrollment number
 * @param {string} enrollmentNumber - The enrollment number
 * @param {string} faculty - The faculty entered by user
 * @param {string} department - The department entered by user
 * @returns {boolean} - true if matches, false otherwise
 */
export const validateFacultyDepartmentFromEnrollment = (enrollmentNumber, faculty, department) => {
    const parsed = parseEnrollmentNumber(enrollmentNumber);
    if (!parsed) {
        return false;
    }

    return parsed.faculty === faculty && parsed.department === department;
};