const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//1. User Registration (POST /register)
exports.addUser = async (req, res) => {

  const { name, email, password } = req.body;
  const profile = req.file?.filename;

  if( !name || !email || !password ) {
  return res.status(400).json({
    message: "All fields are required"
  });
 }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded."});
  } 

 const isPasswordStrong = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
 if( !isPasswordStrong(password) ){ return res.status(400).json({ message: "Password does not match"})}
 try {

   const existingUser = await User.findOne({email}); 
    
  if (existingUser) {
    return res.status(400).json({
      message: "Email already registered"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
 
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    profile
  })
 
  await newUser.save();

  res.status(201).json({
    message: "User registered"
  });
 } catch (error) {

    if(error.name === 'ValidationError') {
      const errors = {};

      for(let field in error.errors){
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({errors})
    }

  res.status(400).json({
    message: "Server error",
    // error: error.message
  });
 }
}

// 2. User Login (POST /login)
exports.loginUser = async (req, res) => {

  try {
  
    const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  const user = await User.findOne({email});

  if(!user){
    return res.status(404).json({
      message: "User not found"
    });
  }

  const isMatch  = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(400).json({
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email},
    process.env.JWT_SECRET,
    { expiresIn: "1h"}
  );

  res.json({token});
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message});
  }
}

exports.getProfile = async (req, res) => {

  try {
    const user = await User.findById(req.user.id).select("-password");

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      profileImage: `http://localhost:3002/uploads/${user.profile}`
    });

  } catch (error) {
    res.status(400).json({
      message: "Server error", error: error.message
    });
  }
} 