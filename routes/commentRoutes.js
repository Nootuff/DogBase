const express = require('express');
const router = express.Router({ mergeParams: true });
const Joi = require("joi");
const Upload = require("../models/upload"); //Link for the upload schema in models
const Comment = require("../models/comment"); //Link for the upload schema in models
const ExpressError = require("../utilities/ExpressError"); //Imports the function from ExpressError.js.
const catchAsync = require("../utilities/catchAsync");
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');

const datePosted = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
  const yyyy = today.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

router.post("/", isLoggedIn, validateComment, catchAsync(async (req, res) => { //Posts a new comment.
  const upload = await Upload.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id; //The details of the current user.
  comment.datePosted = datePosted();
  upload.comments.push(comment);
  await comment.save();
  await upload.save();
  req.flash("success", "Comment posted.");
  res.redirect(`/uploads/${upload._id}`);
}));

router.delete("/:commentId", isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => { //Deletes comment.
  const id = req.params.id
  const commentId = req.params.commentId
  await Upload.findByIdAndUpdate(id, { $pull: { comments: commentId } })
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Comment deleted.");
  res.redirect(`/uploads/${id}`);
}));

module.exports = router;