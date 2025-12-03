export const allowedFileTypes = [
  { type: "application/pdf", extension: ".pdf", name: "PDF" },
  { type: "image/jpeg", extension: ".jpg", name: "JPEG" },
  { type: "image/jpg", extension: ".jpg", name: "JPG" },
  { type: "image/png", extension: ".png", name: "PNG" }
];

export const validateFileType = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Check file type
  const isValidType = allowedFileTypes.some(
    allowedType => allowedType.type === file.type
  );

  if (!isValidType) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload PDF, JPG, or PNG files only.'
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size allowed is 10MB.'
    };
  }

  return { isValid: true, error: null };
};

export const getFileType = (file) => {
  if (!file) return 'unknown';
  
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  
  return 'unknown';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateFileName = (originalName, faculty) => {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
  const extension = originalName.split('.').pop();
  return `${faculty}_TimeTable_${timestamp}.${extension}`;
};