// Utility function to handle file downloads
export const downloadFile = (fileUrl, fileName) => {
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get file extension from filename
export const getFileExtension = (fileName) => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

// Check if file is downloadable
export const isDownloadableFile = (fileType) => {
  const downloadableTypes = ['pdf', 'image', 'jpg', 'jpeg', 'png'];
  return downloadableTypes.includes(fileType.toLowerCase());
};

// Get appropriate download button text
export const getDownloadButtonText = (fileType) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return 'Download PDF';
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'Download Image';
    default:
      return 'Download File';
  }
};

// Get file icon class based on type
export const getFileIconClass = (fileType) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return 'text-red-500';
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};