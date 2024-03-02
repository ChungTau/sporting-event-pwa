import { Request, Response } from 'express';
import { UserService } from '../service/UserService';
import User from '../models/User';

class UserController {
  private static userService = new UserService();
  static async createUser(req: Request<{}, {}, User>, res: Response) {
    try {
      const newUser = await UserController.userService.createUser(req.body);
      if (!newUser) {
        return res.status(400).json({ message: 'Email is already registered or missing parameters' });
      }
      const { password, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating user: ' + error });
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await UserController.userService.validateUser(email, password);
      if (!data) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error logging in: ' + error });
    }
  }

  static async getUsers(_req: Request, res: Response) {
    try {
      const users = await UserController.userService.getUsers();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error getting users: ' + error });
    }
  }

  static async getUserById(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await UserController.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error getting user: ' + error });
    }
  }

  static async updateUser(req: Request<{ id: string }, {}, Partial<User>>, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const success = await UserController.userService.updateUser(userId, req.body);
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating user: ' + error });
    }
  }

  static async deleteUser(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const success = await UserController.userService.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting user: ' + error });
    }
  }
}

export default UserController;
