import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import authRoutes from './routes/auth.routes';
import hospitalRoutes from './routes/hospital.routes';
import departmentRoutes from './routes/department.routes';
import doctorRoutes from './routes/doctor.routes';
import publicRoutes from './routes/public.routes';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/apiResponse';
import { env } from './config/env';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use('/api', limiter);

// Logging
app.use(morgan('combined'));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MedQueue API',
      version: '1.0.0',
      description: 'API documentation for MedQueue Hospital Management System',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Endpoint - Redirect to API Documentation
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api-docs');
});

// API Routes
const v1Router = express.Router();

v1Router.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, { status: 'healthy', timestamp: new Date().toISOString() }, 'System is running smoothly');
});

v1Router.use('/auth', authRoutes);
v1Router.use('/hospitals', hospitalRoutes);
v1Router.use('/departments', departmentRoutes);
v1Router.use('/doctors', doctorRoutes);
v1Router.use('/public', publicRoutes);

app.use('/api/v1', v1Router);

// Global Error Handler
app.use(errorHandler);

export default app;
