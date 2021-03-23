const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const uploadSchema = new mongoose.Schema({
  title: String,
  caption: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

uploadSchema.post("findOneAndDelete", async function (item) {
  if (item) {//If something was actually found and deleted to begin with and the whole operation ran.
    await Comment.deleteMany({
      _id: {
        $in: item.comments    //The $in operator selects the documents where the value of a field equals any value in the specified array.
      }

    })
    console.log("deleted")
  }
});

module.exports = mongoose.model('Upload', uploadSchema);

