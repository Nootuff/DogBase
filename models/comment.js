const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    body: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    datePosted: String
  }); 
  
  module.exports = mongoose.model('Comment', commentSchema);

