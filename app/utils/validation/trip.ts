import Joi from 'joi';

const createTripSchema = Joi.object({
  email: Joi.string().email().required(),
  reset_code: Joi.string().required(),
});

export { createTripSchema };
