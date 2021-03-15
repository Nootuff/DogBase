const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new mongoose.Schema({
  title: String,
  caption: String,
  image: String,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model('Upload', uploadSchema);

