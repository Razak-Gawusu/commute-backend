import Joi from 'joi';

const boardSchema = Joi.object({
  title: Joi.string().min(1).required(),
});

const columnSchema = Joi.object({
  title: Joi.string().min(1).required(),
});

const taskSchema = Joi.object({
  column_id: Joi.string(),
  title: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
});

const subTaskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  is_completed: Joi.boolean(),
});

const signupSchema = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(12)
    .regex(/^(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]+$/)
    .messages({
      'string.min': 'Password must be at least 12 characters long',
      'string.pattern.base':
        'Password must contain at least one capital letter and one symbol.',
    })
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const sendResetCodeSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyResetTokenSchema = Joi.object({
  email: Joi.string().email().required(),
  reset_token: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(12)
    .regex(/^(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]+$/)
    .messages({
      'string.min': 'Password must be at least 12 characters long',
      'string.pattern.base':
        'Password must contain at least one capital letter and one symbol.',
    })
    .required(),
});

export {
  boardSchema,
  signupSchema,
  loginSchema,
  columnSchema,
  taskSchema,
  subTaskSchema,
  sendResetCodeSchema,
  verifyResetTokenSchema,
  resetPasswordSchema,
};
