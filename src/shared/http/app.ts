import logger from '@config/logger';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } })); // HTTP request logging

export default app;
