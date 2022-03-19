const Joi = require("joi");

function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, 
        allowUnknown: true, 
        stripUnknown: true 
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}

const registerSchema = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(8).required()
    });
    validateRequest(req, next, schema);
  }
  
  const loginSchema = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
  }
  function sellPlayerSchema(req, res, next) {
    const schema = Joi.object({
        askPrice: Joi.number().strict(),
    });
    validateRequest(req, next, schema);
  }

  function updatePlayerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string(),
        lastName:Joi.string(),
        country: Joi.string()
    });
    validateRequest(req, next, schema);
  }
  function updateTeamSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        country: Joi.string()
    });
    validateRequest(req, next, schema);
  }
  

  module.exports = {
    registerSchema,
    loginSchema,
    sellPlayerSchema,
    updatePlayerSchema,
    updateTeamSchema
  };
  