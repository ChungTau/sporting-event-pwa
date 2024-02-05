// middleware/uploadMiddleware.ts

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if(file.fieldname === "gpx"){
      cb(null, './uploads/gpxs/');
    }else if(file.fieldname === "backgroundImage"){
      cb(null, './uploads/backgroundImages/');
    }
  },
  filename: (_req, file, cb) => {
    if(file.fieldname === "gpx"){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const fileName = `${uniqueSuffix}${ext}`; // No need to use req.body.name here
        cb(null, fileName);
      }else if (file.fieldname === "backgroundImage"){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const fileName = `${uniqueSuffix}${ext}`; // No need to use req.body.name here
        cb(null, fileName);
      }
  }
});

function checkFileType(file:Express.Multer.File, cb:multer.FileFilterCallback) {
  if(file.fieldname === "gpx"){
    if (file.mimetype === 'application/gpx+xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload a GPX file.'));
    }
  }else if (file.fieldname === "backgroundImage"){
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload an image.'));
    }
  }
}

const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb);
  }
});

// Create separate multer instances for GPX files and background images
/*const uploadGpxFile = multer({
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
  fileFilter: (_req, file, cb) => {
    console.log(file);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload an image.'));
    }
  },
}).single('backgroundImage');*/


export default upload;