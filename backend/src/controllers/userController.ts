import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/dbConfig';

class UserController {
  // Create a new user
  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const user = await User.create({ username, email, hashedPassword });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  // Get all users
  static async getUsers(res: Response) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(user);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  }

  // Update user by ID
  static async updateUser(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const [updatedRowsCount] = await User.update(req.body, {
        where: { id: userId },
      });
      if (updatedRowsCount === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json({ message: 'User updated successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating user' });
    }
  }

  // Delete user by ID
  static async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const deletedRowCount = await User.destroy({
        where: { id: userId },
      });
      if (deletedRowCount === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  }

  // Login with password verification
  static async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = sign(
        {
          userId: user.id,
          username: user.username,
        },
        JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error logging in' });
    }
  }
}

export default UserController;
