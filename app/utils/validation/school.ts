import Joi from 'joi';

export const addWardToParentSchema = Joi.object({
  name: Joi.string().required(),
});
