import Joi from 'joi';

const requestTripSchema = Joi.object({
  parent_id: Joi.string(),
});

export { requestTripSchema };
