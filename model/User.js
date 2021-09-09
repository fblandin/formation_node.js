const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {type : String, unique : true, required : true},
    password: String,
    name: String,
  });

  const userModel = new mongoose.model('user', userSchema)
  module.exports = userModel