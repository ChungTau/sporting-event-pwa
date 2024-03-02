import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/dbConfig';

class UserController {
  // Create a new user
  // static async createUser(req: Request, res: Response) {
  //   try {
  //     const { username, email, password } = req.body;
  //     if (!req.body.password) {
  //       return res.status(400).json({ message: 'Password is required' });
  //     }
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     console.log(hashedPassword);
  //     const user = await User.create({ username, email, password: hashedPassword  });
  //     return res.status(201).json(user);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Error creating user' });
  //   }
  // }
  static async createUser(req: Request<{}, {}, User>, res: Response) {
    try {
      const { email, password } = req.body; //now can be " " is fine

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({...req.body, password: hashedPassword});
  
      return res.status(201).json(user);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating user: '+error });
    }
  }
  
  //Forgot Password 
  static async forgotPassword(req:Request,res: Response){
    const email = req.params.email;
    try{
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invaild email' });
      }
      return res.status(201).json(user);
    }catch(error){
      console.error(error);
      return res.status(500).json({ message: 'Error in forgotPassword '+error });
    }
  }

  //Reset Password
  static async resetPassword(req: Request, res: Response) {
    try {
      const {email,password} = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user||!password) {
        return res.status(401).json({ message: 'Invaild email or password' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const [updatedRowsCount] = await User.update({password: hashedPassword}, {
        where: { email: user.email },
      });
      if (updatedRowsCount === 0) {
        return res.status(404).json({ message: 'Email not found' });
      } else {
        return res.json({ message: 'Password reset successfully' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error reset Password' });
    }
  }

  // Get all users
  static async getUsers(_req: Request,res: Response) {
    try {
      const users = await User.findAll()
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }
  

  // Get user by email
  static async getUserByEmail(req: Request, res: Response) {
    const email = req.body.email;
    try {
      const user = await User.findOne({ where: { email } });
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

  // Update user by email 
  static async updateUser(req: Request, res: Response) {
    const userEmail = req.body.email;
    try {
      const { ...rest } = req.body;
      const [updatedRowsCount] = await User.update(rest, {
        where: { email: userEmail },
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
  // static async updateUser(req: Request, res: Response) {
  //   const userId = req.params.id;
  //   try {
  //     const [updatedRowsCount] = await User.update(req.body, {
  //       where: { id: userId },
  //     });
  //     if (updatedRowsCount === 0) {
  //       res.status(404).json({ message: 'User not found' });
  //     } else {
  //       res.json({ message: 'User updated successfully' });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Error updating user' });
  //   }
  // }

  // Delete user by Email
  static async deleteUser(req: Request, res: Response) {
    const userEmail = req.params.email;
    try {
      const deletedRowCount = await User.destroy({
        where: { email: userEmail },
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
      return res.json({ token,user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error logging in' });
    }
  }
}

export default UserController;
