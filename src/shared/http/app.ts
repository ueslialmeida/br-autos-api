import logger from '@config/logger';
import { errorHandler } from '@shared/http/middlewares/errorHandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } })); // HTTP request logging

// Default routes
app.get('/', (req, res) => {
  logger.info('Received request to root endpoint');
  res.status(200).json({ message: 'Welcome to the BR Autos API' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Error middleware must be the last middleware
app.use(errorHandler);

export default app;
