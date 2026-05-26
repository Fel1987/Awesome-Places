const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.KEY,
  api_secret: process.env.SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "campgound-images",
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = { cloudinary, storage };
