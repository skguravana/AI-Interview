import multer from 'multer';
import fs from 'fs';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // Make sure this exists
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
export const upload = multer({ storage });

