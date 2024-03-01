import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { AppDataSource, JWT_SECRET } from '../config/dbConfig';
import User from '../models/User';
import { Repository } from 'typeorm';

export class UserService {

  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }
  
  async createUser(userData: Partial<User>): Promise<User | undefined> {
    const { email, password } = userData;
    if (!email || !password) return undefined;

    const existingUser = await this.repository.findOneBy({email});
    if (existingUser) return undefined;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.repository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.repository.save(newUser);
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<string | undefined> {
    const user = await this.repository.findOneBy({email});
    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return undefined;

    const token = sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  }

  async getUsers(): Promise<User[]> {
    return await this.repository.find();
  }

  async getUserById(id: number): Promise<User | null> {
    try {
        return await this.repository.findOneBy({ id });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error; // Propagate the error to the caller
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<boolean> {
    const result = await this.repository.update(id, userData);
    return result.affected !== undefined && result.affected > 0;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}
