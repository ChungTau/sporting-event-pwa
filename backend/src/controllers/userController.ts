import { Request, Response } from 'express';
import { User } from '../models/userModel';

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
    console.log(newUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; // Assuming the ID is passed as a URL parameter
    const user = await User.findByPk(id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

