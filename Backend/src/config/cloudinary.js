const     cloudinary        = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const         multer        = require('multer');

if(
  !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || 
  !process.env.CLOUDINARY_API_SECRET
){
  throw new Error("Credenciais Claudinary não configuradas corretamente");
  
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, //remover
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'alertaUrbano/reports',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],

    transformation: [{ width: 1024, height: 1024, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({
  storage,

  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {

    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens JPG, PNG e WEBP são permitidas'), false);
    }
  },
});

module.exports = { cloudinary, upload };