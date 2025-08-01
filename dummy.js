const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

module.exports = upload;



const express = require('express');
const multer = require('multer');

const app = express();

// Configure storage for uploaded files
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload1 = multer({ storage: storage1 });

// Define a route to handle file uploads
app.post('/upload', upload1.single('myFile'), (req, res) => {
  if (req.file) {
    res.send('File uploaded successfully: ' + req.file.filename);
  } else {
    res.status(400).send('No file uploaded.');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


// profile 

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      user,
      profileImage: `http://localhost:${process.env.PORT}/uploads/${user.profile}`,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

