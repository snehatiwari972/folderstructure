const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),

    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password: Joi.string().min(3).required(),

        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

       
      })
      const validateData = (data) => {
        return schema.validate(data);
    };

    
    module.exports = { validateData };