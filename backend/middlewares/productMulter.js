import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const productDir = path.join(process.cwd(), "uploads/products");
if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
export default upload;
