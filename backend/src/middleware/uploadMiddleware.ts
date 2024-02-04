// middleware/uploadMiddleware.ts

import multer from 'multer';
import path from 'path';

// Define storage for GPX files
const gpxFileStorage = multer.diskStorage({
  destination: 'uploads/gpxs/',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${ext}`; // No need to use req.body.name here
    cb(null, fileName);
  },
});

// Define storage for background images
const bgImageStorage = multer.diskStorage({
  destination: 'uploads/images/',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${ext}`; // No need to use req.body.name here
    cb(null, fileName);
  },
});

// Create separate multer instances for GPX files and background images
const uploadGpxFile = multer({
  storage: gpxFileStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/gpx+xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload a GPX file.'));
    }
  },
}).single('gpxFile');

const uploadBackgroundImage = multer({
  storage: bgImageStorage,
  /*fileFilter: (_req, file, cb) => {
    console.log(file);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload an image.'));
    }
  },*/
}).single('backgroundImage');

export { uploadGpxFile, uploadBackgroundImage };
