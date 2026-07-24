import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ApiError } from './utils/ApiError.js';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'https://aymen-brahem-academy.ahmedamine-benaifa.workers.dev/',
  process.env.CLIENT_URL
].filter(Boolean);

// ============================================================
// 1. Global Security Middlewares (الحماية المتقدمة للـ iFrames والملفات)
// ============================================================
app.use(helmet({
  
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "frame-ancestors": ["'self'", ...allowedOrigins],
    },
  },
  frameguard: false, 
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
}));

// ============================================================
// 2. Request Parsers
// ============================================================
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.path === '/api/live/webhook') return next(); // raw body handled in live.routes.js
  express.json({ limit: '10kb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// ============================================================
// 3. Rate Limiter (Applied globally to all /api endpoints)
// ============================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10000,
  message: { 
    error: 'Too many requests from this IP address. Please try again after 15 minutes.' 
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});
app.use('/api', limiter);

// ============================================================
// 4. Health Check
// ============================================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
}); 

// ============================================================
// 5. App Routes & Static Files
// ============================================================

app.use('/api', routes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('X-Frame-Options', 'ALLOWALL'); 
  }
}));

// ============================================================
// 6. 404 Catch-All (For paths that don't match any route above)
// ============================================================
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// ============================================================
// 7. Centralized Error Handler (MUST BE AT THE VERY BOTTOM)
// ============================================================
app.use(errorHandler);

export default app;