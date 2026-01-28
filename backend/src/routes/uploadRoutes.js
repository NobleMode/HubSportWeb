import express from 'express';
import uploadController, { upload } from '../controllers/uploadController.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload an image
 * @access  Public (or Private if middleware added)
 */
router.post('/', upload.single('image'), uploadController.uploadImage);

export default router;
