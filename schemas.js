const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({ //This is a function using sanitizeHtml required up above to get rid of any html script a user might input into a text input to hack the site. 
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [], //This is where we put the html tags the site is allowing users to enter into inputs, it is empty, nothing is allowed. 
                    allowedAttributes: {}, //This is the same, nothing is allowed, no fancy stuff. 
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.uploadSchema = Joi.object({
    upload: Joi.object({
        title: Joi.string().required().escapeHTML(),
        caption: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().escapeHTML()
    }).required()
});