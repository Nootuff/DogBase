const Joi = require("joi");

module.exports.uploadSchema = Joi.object({
    upload: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        caption: Joi.string().required()
    }).required()
});