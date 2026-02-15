const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    // Default folder
    let folder = "common";

    // Route se agar folder set kiya ho
    if (req.uploadFolder) {
      folder = req.uploadFolder;
    }

    const uploadPath = path.join(__dirname, "uploads", folder);

    // Folder exist na ho to create karo
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // ✅ 10MB (10GB galat tha)
  },
});

module.exports = upload;


// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // route se folder decide karo
//     const folder = req.uploadFolder || "common";

//     const uploadPath = `uploads/${folder}`;

//     // folder exist na ho to create karo
//     fs.mkdirSync(uploadPath, { recursive: true });

//     cb(null, uploadPath);
//   },

//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024*1024, // 10gb size of image
//   },
// });

// module.exports = upload;



// // module.exports = multer({storage});

// // const multer = require("multer");
// // const path = require("path");

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "uploads/");
// //     cb(null, "uploads/categories");

// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + path.extname(file.originalname));
// //   },
// // });

// // const fileFilter = (req, file, cb) => {
// //   if (file.mimetype.startsWith("image")) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only images allowed"), false);
// //   }
// // };

// // const upload = multer({ storage, fileFilter });

// // module.exports = upload;
