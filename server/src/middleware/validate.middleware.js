import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

const formatZodError = (err) => {
  const errorsArray = err.errors || err.issues || [];
  return errorsArray.map((e) => e.message).join(', ');
};

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) return next(new ApiError(400, formatZodError(err)));
    return next(err);
  }
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params);
  } catch (err) {
    if (err instanceof ZodError) return next(new ApiError(400, formatZodError(err)));
    return next(err);
  }
  next();
};