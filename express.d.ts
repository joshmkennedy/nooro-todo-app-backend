import * as express from 'express';
import { UserPayload } from './src/middleware/auth.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Replace `any` with your actual User type
    }
  }
}
