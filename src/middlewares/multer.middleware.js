
import multer from "multer";


// this method , we are using as middleware 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")//folder choose
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)//given by user
  }
})

export const upload = multer({ 
  storage,
 })



// //if we are using this code then error at localpath -> cloudinary upload only -> otherwise delay 408 error(you can egnore or delete this code #prince)
// import multer from "multer";
// import fs from "fs";
// import path from "path";

// // Ensure folder exists
// const tempDir = './public/temp';
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tempDir); // folder choose
//   },
//   filename: function (req, file, cb) {
//     // Remove spaces, add unique suffix to avoid overwrite
//     const ext = path.extname(file.originalname); // get extension
//     const name = path.basename(file.originalname, ext).replace(/\s+/g, '_'); // remove spaces
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, name + '-' + uniqueSuffix + ext);
//   }
// });

// // File filter (allow only images)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// // File size limit (5 MB)
// const limits = {
//   fileSize: 5 * 1024 * 1024
// };

// // Export multer instance (safe & secure)
// export const upload = multer({ storage, fileFilter, limits });


