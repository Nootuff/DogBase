const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const uploadSchema = new mongoose.Schema({
    title: String    
  }); 
  

  const Upload = mongoose.model('Upload', uploadSchema);

  module.exports = Upload;