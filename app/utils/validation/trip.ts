import Joi from 'joi';

const createTripSchema = Joi.object({
  parent_id: Joi.string().required(),
  driver_id: Joi.string().required(),
  school_id: Joi.string().required(),
  status: Joi.string().required(),
});

export { createTripSchema };
