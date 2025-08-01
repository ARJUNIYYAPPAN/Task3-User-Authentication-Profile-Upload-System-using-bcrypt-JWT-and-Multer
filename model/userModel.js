const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, 'Password must have atleast 8 characters 1 uppercase and 1 lowercase and 1 number and 1 special case']
  },
  profile: {
    type: String
  }

})

module.exports = mongoose.model('User' , userModel);