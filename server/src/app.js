import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import routes from './routes/index.js';
import {errorHandler} from './middleware/error.middleware.js';
import { ApiError } from './utils/ApiError.js';


const app = express();

// 1. Global Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true,
}));

// 2. Request Parsers
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

// 3. Rate Limiter (Applied globally to all /api endpoints)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: { 
    error: 'Too many requests from this IP address. Please try again after 15 minutes.' 
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});
app.use('/api', limiter);

// 4. Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
}); 

// 5. App Routes & Static Files
app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

// 6. 404 Catch-All (For paths that don't match any route above)
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 7. Centralized Error Handler (MUST BE AT THE VERY BOTTOM)
app.use(errorHandler);

export default app;