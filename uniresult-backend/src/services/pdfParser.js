import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PDF Result Parser Service
 * Parses university result sheet PDFs and extracts student results
 * 
 * Expected PDF format (Uva Wellassa University style):
 * - Contains Registration No, Grade, Remark columns
 * - Registration numbers like: UWU/ICT/22/001, UWU/ET/21/045, etc.
 */

class PDFResultParser {
    constructor() {
        // Common registration number patterns for Sri Lankan universities
        this.registrationPatterns = [
            // UWU format: UWU/ICT/22/001
            /([A-Z]{2,5}\/[A-Z]{2,5}\/\d{2}\/\d{2,4})/gi,
            // Alternative format: UWU/ICT/22/001
            /([A-Z]+\/[A-Z]+\/\d+\/\d+)/gi,
            // Generic format with slashes
            /\b([A-Z]{2,}(?:\/[A-Z0-9]+){2,})\b/gi
        ];

        // Grade patterns
        this.validGrades = [
            'A+', 'A', 'A-', 
            'B+', 'B', 'B-', 
            'C+', 'C', 'C-', 
            'D+', 'D', 'D-',
            'E', 'F',
            'AB', 'NE', 'NC', 'I', 'W', 'WP', 'WF'
        ];

        // Remark patterns
        this.remarkPatterns = [
            'CA Fail', 'CA fail', 'ca fail',
            '2nd exam fail', '2nd Exam Fail',
            '3rd exam fail', '3rd Exam Fail',
            'Repeat', 'repeat',
            'Absent', 'absent',
            'Medical', 'medical',
            'Incomplete', 'incomplete'
        ];
    }

    /**
     * Parse a PDF file and extract student results
     * @param {string} filePath - Path to the PDF file
     * @returns {Promise<Object>} Parsed results with metadata
     */
    async parseFile(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            return await this.parseBuffer(dataBuffer);
        } catch (error) {
            console.error('Error reading PDF file:', error);
            throw new Error(`Failed to read PDF file: ${error.message}`);
        }
    }

    /**
     * Parse a PDF buffer and extract student results
     * @param {Buffer} dataBuffer - PDF file buffer
     * @returns {Promise<Object>} Parsed results with metadata
     */
    async parseBuffer(dataBuffer) {
        try {
            const pdfData = await pdfParse(dataBuffer);
            let text = pdfData.text;
            
            console.log('📄 PDF Text extracted, length:', text.length);
            
            // Extract metadata from PDF
            const metadata = this.extractMetadata(text);
            
            // If text extraction failed (very short text), try OCR
            if (text.length < 100) {
                console.log('⚠️ Text extraction failed, attempting OCR with Tesseract.js...');
                try {
                    text = await this.processScannedPDF(dataBuffer);
                    console.log('🔍 OCR completed, text length:', text.length);

                    // If OCR also failed, mark as requiring manual entry
                    if (text.length < 50) {
                        console.log('⚠️ OCR also failed, marking as requires manual entry');
                        return {
                            success: false,
                            error: 'PDF appears to be scanned/image-based and OCR failed. Manual entry required.',
                            requiresManualEntry: true,
                            metadata: {
                                ...metadata,
                                pageCount: pdfData.numpages,
                                totalCharacters: text.length
                            },
                            studentResults: [],
                            resultCount: 0,
                            rawText: text.substring(0, 2000)
                        };
                    }
                } catch (ocrError) {
                    console.error('❌ Scanned PDF processing error:', ocrError.message);
                    return {
                        success: false,
                        error: 'PDF parsing failed. The PDF may be scanned/image-based. Manual entry required.',
                        requiresManualEntry: true,
                        metadata: {
                            ...metadata,
                            pageCount: pdfData.numpages,
                            totalCharacters: text.length
                        },
                        studentResults: [],
                        resultCount: 0,
                        rawText: text.substring(0, 2000)
                    };
                }
            }
            
            // Extract metadata from PDF (if not already extracted)
            // const metadata = this.extractMetadata(text);
            
            // Extract student results
            const studentResults = this.extractStudentResults(text);
            
            return {
                success: true,
                metadata: {
                    ...metadata,
                    pageCount: pdfData.numpages,
                    totalCharacters: text.length
                },
                studentResults,
                resultCount: studentResults.length,
                rawText: text.substring(0, 2000), // First 2000 chars for debugging
                usedOCR: text !== pdfData.text
            };
        } catch (error) {
            console.error('Error parsing PDF:', error);
            throw new Error(`Failed to parse PDF: ${error.message}`);
        }
    }

    /**
     * Extract metadata from PDF text
     * @param {string} text - Raw PDF text
     * @returns {Object} Extracted metadata
     */
    extractMetadata(text) {
        const metadata = {
            university: '',
            faculty: '',
            department: '',
            degreeProgram: '',
            semester: '',
            academicYear: '',
            courseCode: '',
            subjectName: '',
            credits: 0
        };

        // Extract university name
        const universityMatch = text.match(/([A-Za-z\s]+University[A-Za-z\s]*)/i);
        if (universityMatch) {
            metadata.university = universityMatch[1].trim();
        }

        // Extract faculty
        const facultyMatch = text.match(/Faculty\s*(?:of\s+)?([A-Za-z\s]+?)(?:\n|Degree|Bachelor|Department)/i);
        if (facultyMatch) {
            metadata.faculty = facultyMatch[1].trim();
        }

        // Extract degree program
        const degreeMatch = text.match(/(?:Degree\s*Programme?|Bachelor\s*of)\s*[:\s]*(.+?)(?:\n|Title)/i);
        if (degreeMatch) {
            metadata.degreeProgram = degreeMatch[1].trim();
        }

        // Extract semester and academic year
        const semesterMatch = text.match(/Semester\s*[:\s]*([IVX]+|\d+)\s*(?:Academic\s*Year)?\s*(\d{4}[/-]\d{4})?/i);
        if (semesterMatch) {
            metadata.semester = semesterMatch[1];
            if (semesterMatch[2]) {
                metadata.academicYear = semesterMatch[2];
            }
        }

        // Alternative academic year pattern
        const yearMatch = text.match(/Academic\s*Year\s*[:\s]*(\d{4}[/-]\d{4,})/i);
        if (yearMatch) {
            metadata.academicYear = yearMatch[1];
        }

        // Extract course code
        const codeMatch = text.match(/Course\s*Code\s*[:\s]*([A-Z]{2,5}\s*\d{2,4}(?:[-\s]?\d)?)/i);
        if (codeMatch) {
            metadata.courseCode = codeMatch[1].trim();
        }

        // Extract subject/title
        const titleMatch = text.match(/Title\s*(?:of\s*(?:the\s*)?Question\s*Paper)?\s*[:\s]*(.+?)(?:\n|Course\s*Code)/i);
        if (titleMatch) {
            metadata.subjectName = titleMatch[1].trim();
        }

        // Extract credits
        const creditsMatch = text.match(/(?:No\.?\s*of\s*)?Credit[s]?\s*[:\s]*(\d+)/i);
        if (creditsMatch) {
            metadata.credits = parseInt(creditsMatch[1]);
        }

        return metadata;
    }

    /**
     * Extract student results from PDF text
     * @param {string} text - Raw PDF text
     * @returns {Array} Array of student result objects
     */
    extractStudentResults(text) {
        const results = [];
        const seenRegistrations = new Set();

        // Split text into lines for processing
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        // Method 1: Try to extract from table-like structure
        const tableResults = this.extractFromTableStructure(text);
        if (tableResults.length > 0) {
            tableResults.forEach(result => {
                const key = result.registrationNo.toUpperCase();
                if (!seenRegistrations.has(key)) {
                    seenRegistrations.add(key);
                    results.push(result);
                }
            });
        }

        // Method 2: Line-by-line extraction for any missed entries
        for (const line of lines) {
            const lineResults = this.extractFromLine(line);
            lineResults.forEach(result => {
                const key = result.registrationNo.toUpperCase();
                if (!seenRegistrations.has(key)) {
                    seenRegistrations.add(key);
                    results.push(result);
                }
            });
        }

        // Sort results by registration number
        results.sort((a, b) => a.registrationNo.localeCompare(b.registrationNo));

        console.log(`📊 Extracted ${results.length} student results`);
        return results;
    }

    /**
     * Extract results from table-like structure in PDF
     * @param {string} text - Raw PDF text
     * @returns {Array} Extracted results
     */
    extractFromTableStructure(text) {
        const results = [];
        
        // Split text into lines for better table parsing
        const lines = text.split('\n').map(line => line.trim());
        
        // Find where the table starts (look for header row)
        let tableStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(/No\s+Registration\s+No/i) || 
                lines[i].match(/No\s+Reg/i)) {
                tableStartIndex = i + 1; // Start from next line after header
                break;
            }
        }
        
        if (tableStartIndex === -1) {
            // Fallback: look for first registration number
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(/[A-Z]{2,5}\/[A-Z]{2,5}\/\d{2}\/\d{2,4}/)) {
                    tableStartIndex = i;
                    break;
                }
            }
        }
        
        // Process each line as a potential table row
        for (let i = Math.max(0, tableStartIndex); i < lines.length; i++) {
            const line = lines[i];
            
            // Skip empty lines and non-table lines
            if (!line || line.length < 10) continue;
            
            // Pattern for table row: No | Registration No | Grade | Remark (optional)
            // Examples:
            // 1     UWU/ICT/22/001     A
            // 6     UWU/ICT/22/008     NE       CA fail
            // 98    UWU/ICT/22/1/048   NE       2 nd attempt
            
            // More flexible pattern that handles varying whitespace
            // Match grade patterns in order: Two-letter grades (AB, NE, NC, etc.) MUST come before single letters
            // This prevents "AB" from being parsed as "A" with remark "B"
            const rowPattern = /^(\d+)\s+([A-Z]{2,5}\/[A-Z]{2,5}\/\d{2}\/\d{1,4}(?:\/\d{1,4})?)\s+(AB|NE|NC|WP|WF|A[+-]?|B[+-]?|C[+-]?|D[+-]?|E|F|I|W)\s*(.*)$/i;
            const match = line.match(rowPattern);
            
            if (match) {
                const registrationNo = match[2].trim();
                const grade = match[3].trim();
                const remarkText = match[4].trim();
                
                // Clean up remark - remove any trailing text that looks like next row
                let remark = '';
                if (remarkText) {
                    // Stop at next registration number pattern or next row number
                    const nextRegMatch = remarkText.match(/^(.+?)(?=\d+\s+[A-Z]{2,5}\/|$)/);
                    remark = nextRegMatch ? nextRegMatch[1].trim() : remarkText;
                    
                    // Additional cleanup: remove leading/trailing whitespace and normalize
                    remark = remark.replace(/\s+/g, ' ').trim();
                }
                
                if (this.isValidRegistration(registrationNo)) {
                    results.push({
                        registrationNo: registrationNo.toUpperCase(),
                        grade: this.normalizeGrade(grade),
                        remark: this.normalizeRemark(remark)
                    });
                    
                    console.log(`Parsed: ${registrationNo} - ${grade} - ${remark || 'No remark'}`);
                }
            }
        }
        
        console.log(`📋 Table structure extraction found ${results.length} results`);
        return results;
    }

    /**
     * Extract results from a single line
     * @param {string} line - Single line of text
     * @returns {Array} Extracted results from line
     */
    extractFromLine(line) {
        const results = [];

        // Try each registration pattern
        for (const pattern of this.registrationPatterns) {
            const regPattern = new RegExp(pattern);
            const matches = line.match(regPattern);
            
            if (matches) {
                for (const regNo of matches) {
                    if (this.isValidRegistration(regNo)) {
                        // Extract grade after registration number
                        const afterReg = line.substring(line.indexOf(regNo) + regNo.length);
                        const gradeMatch = afterReg.match(/^\s*([A-Z][+-]?|AB|NE|NC|E|F)\b/i);
                        
                        let grade = '';
                        let remark = '';
                        
                        if (gradeMatch) {
                            grade = this.normalizeGrade(gradeMatch[1]);
                            
                            // Look for remark after grade
                            const afterGrade = afterReg.substring(gradeMatch[0].length);
                            remark = this.extractRemark(afterGrade);
                        }

                        results.push({
                            registrationNo: regNo.toUpperCase(),
                            grade,
                            remark
                        });
                    }
                }
            }
        }

        return results;
    }

    /**
     * Check if registration number is valid
     * @param {string} regNo - Registration number
     * @returns {boolean} Is valid
     */
    isValidRegistration(regNo) {
        if (!regNo || regNo.length < 8) return false;
        
        // Must contain at least 2 slashes and end with numbers
        const parts = regNo.split('/');
        if (parts.length < 3) return false;
        
        // Last part should be numeric
        const lastPart = parts[parts.length - 1];
        if (!/^\d+$/.test(lastPart)) return false;

        return true;
    }

    /**
     * Normalize grade to standard format
     * @param {string} grade - Raw grade
     * @returns {string} Normalized grade
     */
    normalizeGrade(grade) {
        if (!grade) return '';
        
        const normalized = grade.toUpperCase().trim();
        
        // Check if it's a valid grade
        if (this.validGrades.includes(normalized)) {
            return normalized;
        }
        
        return normalized;
    }

    /**
     * Extract remark from text
     * @param {string} text - Text after grade
     * @returns {string} Extracted remark
     */
    extractRemark(text) {
        if (!text) return '';
        
        const cleanText = text.trim();
        
        // Check for known remarks
        for (const remark of this.remarkPatterns) {
            if (cleanText.toLowerCase().includes(remark.toLowerCase())) {
                return remark;
            }
        }
        
        // Return first few words if it looks like a remark
        const words = cleanText.split(/\s+/).slice(0, 3).join(' ');
        if (words.length > 2 && words.length < 30) {
            return words;
        }
        
        return '';
    }

    /**
     * Normalize remark to standard format
     * @param {string} remark - Raw remark
     * @returns {string} Normalized remark
     */
    normalizeRemark(remark) {
        if (!remark) return '';
        
        const cleanRemark = remark.trim();
        
        // Map common variations to standard format
        const remarkMap = {
            'ca fail': 'CA Fail',
            'cafail': 'CA Fail',
            '2nd exam fail': '2nd Exam Fail',
            '2ndexamfail': '2nd Exam Fail',
            'repeat': 'Repeat',
            'absent': 'Absent'
        };
        
        const lower = cleanRemark.toLowerCase();
        if (remarkMap[lower]) {
            return remarkMap[lower];
        }
        
        return cleanRemark;
    }

    /**
     * Filter results by registration number
     * @param {Array} results - All parsed results
     * @param {string} registrationNo - Registration number to filter
     * @returns {Object|null} Matching result or null
     */
    filterByRegistration(results, registrationNo) {
        const normalized = registrationNo.toUpperCase().trim();
        return results.find(r => 
            r.registrationNo.toUpperCase() === normalized
        ) || null;
    }

    /**
     * Filter results by partial registration number
     * @param {Array} results - All parsed results
     * @param {string} partialReg - Partial registration number
     * @returns {Array} Matching results
     */
    searchByPartialRegistration(results, partialReg) {
        const normalized = partialReg.toUpperCase().trim();
        return results.filter(r => 
            r.registrationNo.toUpperCase().includes(normalized)
        );
    }

    /**
     * Extract text from PDF using OCR when regular text extraction fails
     * @param {Buffer} dataBuffer - PDF file buffer
     * @returns {Promise<string>} Extracted text
     */
    /**
     * Extract text from PDF using OCR when regular text extraction fails
     * @param {Buffer} dataBuffer - PDF file buffer
     * @returns {Promise<string>} Extracted text
     */
    async extractTextWithOCR(_dataBuffer) { // eslint-disable-line no-unused-vars
        // OCR not implemented in this version
        // The parseBuffer method handles both text and scanned PDFs
        console.log('⚠️ OCR fallback not used - using alternative PDF processing');
        return '';
    }

    /**
     * Process scanned PDFs using tesseract.js
     * @param {Buffer} _dataBuffer - PDF file buffer
     * @returns {Promise<string>} Extracted text
     */
    async processScannedPDF(_dataBuffer) { // eslint-disable-line no-unused-vars
        try {
            console.log('🔍 Attempting OCR on scanned PDF...');
            console.log('ℹ️  For better OCR support on scanned PDFs, please install ImageMagick:');
            console.log('   - Windows: Download from https://imagemagick.org/script/download.php');
            console.log('   - Then set environment: $env:PATH += ";C:\\Program Files\\ImageMagick-7.x.x-Q16"');
            console.log('   - Or use a cloud OCR service (Google Vision, AWS Textract)');
            
            // Since we can't reliably process scanned PDFs without system dependencies,
            // we'll return empty and let the system use manual entry as fallback
            return '';

        } catch (error) {
            console.error('⚠️ OCR not available:', error.message);
            return '';
        }
    }
}

// Export singleton instance
const pdfParser = new PDFResultParser();

export { PDFResultParser };
export default pdfParser;
