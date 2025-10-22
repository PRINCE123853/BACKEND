import multer from "multer";


// this method , we are using as middleware 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')//folder choose
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)//given by user
  }
})

export const upload = multer({ 
  storage,
 })