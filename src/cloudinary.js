const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

let test = (req, res, next) => {
  console.log(
    process.env,
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_KEY,
    process.env.CLOUDINARY_SECRET
  );
  next();
};

const storage = new CloudinaryStorage({
  cloudinary,
  folder: "YelpCamp",
  allowedFormats: ["jpeg", "png", "jpg"],
});

module.exports = {
  cloudinary,
  storage,
  test,
};
