import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

const formatZodError = (err) => err.errors.map((e) => e.message).join(', ');

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) return next(new ApiError(400, formatZodError(err)));
    next(err);
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params);
    next();
  } catch (err) {
    if (err instanceof ZodError) return next(new ApiError(400, formatZodError(err)));
    next(err);
  }
};