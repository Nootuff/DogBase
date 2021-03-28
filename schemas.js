const Joi = require("joi");

module.exports.uploadSchema = Joi.object({
    upload: Joi.object({
        title: Joi.string().required(),
       // image: Joi.string().required(),
        caption: Joi.string().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});