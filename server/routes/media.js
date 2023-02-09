const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, bucket } = require('../utils/s3');
const { Chat } = require('../models/Chat');
const { cacheUpdate } = require('../socket/websocket');


const truncate = (str, length) => str.length > length ? `${str.substring(0, length)}...` : str;

const cacheControl = 'max-age=' + 60 * 60 * 24 * 90; // 90 days
/*const maxFileSize = 1 * 1024 * 1024 * 1024; // 1 GB cuz s3 is awesome
const uploadFile = multer({
  storage: multerS3({
    s3,
    bucket,
    cacheControl,
    key: (req, file, cb) => {
      const path = `uploads/${req.user.id}/${Date.now()}`; // TODO: Make this more secure by using a random string instead of the user id
      const fileName = truncate(file.originalname, 100).replace(/ |\/|\\/g, '_');
      cb(null, `${path}${fileName}`);
    }
  }),
  limits: { fileSize: maxFileSize }
});

router.post('/upload', uploadFile.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new Error('No file was uploaded');
  
  res.status(200).json({ path: file.path });
}));*/


const pfpFilter = (req, file, cb) => {
  const valid = file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg';
  cb(valid ? null : new Error('File type not supported'), valid ? true : false);
}

const maxPfpSize = 12 * 1024 * 1024; // 12 MB
const uploadPfp = multer({
  storage: multerS3({
    s3,
    bucket,
    cacheControl,
    key: (req, file, cb) => {
      const path = req.params.chatId ? `uploads/chats/${req.params.chatId}/` : `uploads/profile/${req.user.id}/`;
      const fileName = `${Date.now()}.${file.mimetype.split('/')[1] || 'png'}`;
      cb(null, `${path}${fileName}`);
    }
  }),
  limits: { fileSize: maxPfpSize },
  fileFilter: pfpFilter
});

router.post('/pfp', uploadPfp.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new Error('No file was uploaded');

  req.user.iconURL = file.location;
  await req.user.save();

  res.status(200).json({ path: req.user.iconURL });
}));

router.post('/:chatId/icon', uploadPfp.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new Error('No file was uploaded');

  const chat = await Chat.findById(req.params.chatId);
  if (!chat) throw new Error('Chat not found');

  chat.iconURL = file.location;
  await chat.save();

  cacheUpdate({ chats: [chat.toJSON()] }, chat.members);
  res.status(200).json({ path: chat.iconURL });
}));


module.exports = router;
