// middleware/uploadMiddleware.ts

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ensureDirectoryExists = (directory: string) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const gpxStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath = '';
    if (file.fieldname === "path") {
      destinationPath = `./uploads/plans/${req.params.ownerId}`;
    }

    // Ensure the directory exists
    ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === "path"){
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
         const ext = path.extname(file.originalname);
         const fileName = `${uniqueSuffix}${ext}.gpx`; // No need to use req.body.name here
         cb(null, fileName);
       }
   }
});

const bgImageStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let destinationPath = '';
    if (file.fieldname === "backgroundImage") {
      destinationPath = './uploads/backgroundImages/';
    }

    // Ensure the directory exists
    ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: (_req, file, cb) => {
   if (file.fieldname === "backgroundImage"){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const fileName = `${uniqueSuffix}${ext}`; // No need to use req.body.name here
        cb(null, fileName);
      }
  }
});

function checkFileType(file:Express.Multer.File, cb:multer.FileFilterCallback) {
  if(file.fieldname === "path"){
    if (file.mimetype === 'application/gpx+xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload a GPX file.'));
    }
  }else if (file.fieldname === "backgroundImage"){
    console.log(file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload an image.'));
    }
  }
}

export const uploadBgImage = multer({
  storage: bgImageStorage,
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb);
  }
});

export const uploadPlanGPX = multer(
  {
    storage: gpxStorage,
    fileFilter: (_req, file, cb) => {
      checkFileType(file, cb);
    }
  }
);
