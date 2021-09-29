const Joi = require("joi");
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().min(3).required(),
    location: Joi.string().required(),
    price: Joi.number().precision(2).positive().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
  })
})
  .required()
  .unknown(); // because title threw errors

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
});
