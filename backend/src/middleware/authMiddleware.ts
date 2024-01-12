import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/dbConfig';
import User from '../models/User';

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Assuming you have a 'User' model or type definition
    const user = await User.findByPk(decoded.userId); // Fetch user data based on the decoded payload

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user data to the request object for further use
    req.user = user;
    next();
    return; // Add this return statement
  } catch (ex) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

