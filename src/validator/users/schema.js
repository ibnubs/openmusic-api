const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema };