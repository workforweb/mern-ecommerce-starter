const multer = require('multer');
const path = require('path');
const { generateString } = require('../utils');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, generateString(15) + '-' + file.originalname.toLowerCase());
  },
});

const fileFilter = function (req, file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

module.exports = upload;
