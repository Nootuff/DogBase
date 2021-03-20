const express = require('express');
const router = express.Router({ mergeParams: true });
const Joi = require("joi");
const Upload = require("../models/upload"); //Link for the upload schema in models
const Comment = require("../models/comment"); //Link for the upload schema in models
const { commentSchema } = require("../schemas.js");
const ExpressError = require("../utilities/ExpressError"); //Imports the function from ExpressError.js.
const catchAsync = require("../utilities/catchAsync");

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body)
    if(error){
      
      } else{
        next();
      }
	}

    router.post("/", validateComment, catchAsync(async (req, res) => {
        //res.send("it works")
        const upload = await Upload.findById(req.params.id);
        const comment = new Comment(req.body.comment);
        upload.comments.push(comment);
        await comment.save();
        await upload.save();
        req.flash("success", "Comment posted.");
        res.redirect(`/uploads/${upload._id}`)
      }));
      
      router.delete("/:commentId", catchAsync(async (req, res) => {
        const id = req.params.id
        const commentId = req.params.commentId
       await Upload.findByIdAndUpdate(id, {$pull: { comments: commentId } } )   
        await Comment.findByIdAndDelete(commentId);
        req.flash("success", "Comment deleted.");
        res.redirect(`/uploads/${id}`)
      }));

      module.exports = router;