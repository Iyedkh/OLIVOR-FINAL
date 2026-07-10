import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    // Configure Cloudinary inside the request handler to ensure environment variables are fully loaded
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map((file) => {
      // Convert buffer to data URI
      const base64Format = file.mimetype + ';base64,' + file.buffer.toString('base64');
      const dataUri = `data:${base64Format}`;
      return cloudinary.uploader.upload(dataUri, {
        folder: 'olivor_products',
      });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((result) => result.secure_url);

    res.json({ urls });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload user avatar image to Cloudinary
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const base64Format = req.file.mimetype + ';base64,' + req.file.buffer.toString('base64');
    const dataUri = `data:${base64Format}`;
    
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'olivor_avatars',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' }
      ]
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary avatar upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
