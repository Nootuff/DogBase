const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary")

const uploadSchema = new mongoose.Schema({
  title: String,
  caption: String,
  image: 
    {
      url: String,
      filename: String
    }
  ,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  likes: [
    
  ]
});

uploadSchema.post("findOneAndDelete", async function (item) {
  if (item) {//If something was actually found and deleted to begin with and the whole operation ran.
    await Comment.deleteMany({
      _id: {
        $in: item.comments    //The $in operator selects the documents where the value of a field equals any value in the specified array.
      }
    })
    await cloudinary.uploader.destroy(item.image.filename); //This is a method from cloudinary, deletes the image from cloudinary. 
    console.log("deleted " + item.image.filename)
  }
});

module.exports = mongoose.model('Upload', uploadSchema);