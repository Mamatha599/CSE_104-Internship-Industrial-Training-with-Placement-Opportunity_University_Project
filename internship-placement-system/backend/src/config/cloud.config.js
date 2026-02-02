// Cloud storage configuration (Cloudinary for file uploads)
// This will be used for resume uploads, certificates, etc.

const cloudinary = require('cloudinary').v2;
const config = require('./env.config');

// Configure Cloudinary (uncomment when ready to use)
/*
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});
*/

module.exports = {
  cloudinary,
  // File upload settings
  allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  uploadFolders: {
    resumes: 'internship-system/resumes',
    certificates: 'internship-system/certificates',
    profiles: 'internship-system/profiles'
  }
};