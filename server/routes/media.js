const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const fs = require('fs');


const userStorage = (req, file, cb) => {
  const path = `public/media/user/${req.user.id}/`;
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

  cb(null, path);
}

const maxFileSize = 100 * 1024 * 1024; // 100 MB
const fileStorage = multer.diskStorage({ destination: userStorage, limits: { fileSize: maxFileSize } });
const uploadFile = multer({ storage: fileStorage });

router.post('/upload', uploadFile.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new Error('No file was uploaded');
  
  res.status(200).json({ path: file.path });
}));


const pfpFilter = (req, file, cb) => {
  const valid = file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg';
  cb(valid ? null : new Error('File type not supported'), valid ? true : false);
}

const maxPfpSize = 12 * 1024 * 1024; // 12 MB
const pfpStorage = multer.diskStorage({ destination: userStorage, limits: { fileSize: maxPfpSize }, fileFilter: pfpFilter });
const uploadPfp = multer({ storage: pfpStorage });

router.post('/pfp', uploadPfp.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new Error('No file was uploaded');

  req.user.iconURL = `${process.env.APP_URL}${file.path.replace('public', '')}`.replace(/\\/g, '/');
  await req.user.save();

  res.status(200).json({ path: req.user.iconURL });
}));


module.exports = router;
