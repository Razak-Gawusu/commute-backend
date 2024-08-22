import Joi from 'joi';

// type Role = 'admin' | 'super_admin' | 'parent' | 'driver';

enum UserRole {
  Admin = 'admin',
  SuperAdmin = 'super_admin',
  Parent = 'parent',
  Driver = 'driver',
}

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
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid(...Object.values(UserRole)),
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

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string()
    .min(12)
    .regex(/^(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]+$/)
    .messages({
      'string.min': 'Password must be at least 12 characters long',
      'string.pattern.base':
        'Password must contain at least one capital letter and one symbol.',
    })
    .required(),
});

const verifyResetCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  reset_code: Joi.string().required(),
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
const registerSchoolSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  digital_address: Joi.string().required(),
  certificate_number: Joi.string().required(),
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
  verifyResetCodeSchema,
  registerSchoolSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
