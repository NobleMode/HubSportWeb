import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Configure Multer Storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: fieldname-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter (Images Only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * Upload Controller
 */
class UploadController {
  /**
   * Upload Single Image
   * POST /api/upload
   */
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      // Construct public URL (assuming server is served at root or /uploads is static)
      // We will configure 'uploads' as a static folder in app.js
      const filePath = `/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: filePath,
          filename: req.file.filename,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();
