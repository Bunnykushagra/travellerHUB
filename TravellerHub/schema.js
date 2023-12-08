const BaseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)
module.exports.serverSchema = Joi.object({
    name: Joi.string()

        .min(3)

        .required().escapeHTML(),
    budget: Joi.number()
        .integer()
        .min(1000)
        .required(),
   
    location: Joi.string()

        .min(3)

        .required().escapeHTML(),
    description: Joi.string()

        .required().escapeHTML(),
    deleteImages:Joi.array()

});
module.exports.reviewSchema = Joi.object({
    rating: Joi.number()

        .min(1).max(5)

        .required(),

    body: Joi.string()



        .required().escapeHTML(),


});