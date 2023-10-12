import { config } from 'dotenv';
import express, { Express } from 'express';
import routes from '../routes/index';

config();

export function createApp(): Express {
  const app = express();
  // Enable Parsing Middleware for Requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', routes);

  return app;
}