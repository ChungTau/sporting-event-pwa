import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/dbConfig';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user data to the request object for further use
    req.user = decoded;
    next();
    return; // Add this return statement
  } catch (ex) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

