const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { t } = require('../utils/translations');

/**
 * Report Upload Routes
 */

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '..', 'uploads', 'reports');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.invalidFileType = true;
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadReportFile = (req, res, next) => {
  upload.single('report')(req, res, (err) => {
    if (!err) return next();

    const language = req.body?.language || 'en';
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? t('upload.file_too_large', language)
      : t('upload.invalid_format', language);

    return res.status(400).json({
      success: false,
      message
    });
  });
};

// Upload medical report (protected)
router.post('/upload', authenticate, uploadReportFile, reportController.uploadReport);

// Get user's uploaded reports (protected)
router.get('/my-reports', authenticate, reportController.getUserReports);

// Delete user's report (protected)
router.delete('/:reportId', authenticate, reportController.deleteReport);

module.exports = router;
