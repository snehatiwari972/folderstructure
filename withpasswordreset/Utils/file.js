// configureFileUpload.js
const multer = require('multer');
const path = require('path');

 const storage = multer.diskStorage({
        destination: './upload/images',
        filename: (req, file, cb) => {
            return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
        }

});

const fileFilter = (req, file, cb) => {
  // Define file type restrictions if needed
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { upload };