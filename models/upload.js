const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    title: {
      type: String    
    },
    caption: {
      type: String 
    },
    image: {
      type: String 
    }
  }); 
  
  module.exports = mongoose.model('Upload', uploadSchema);

 