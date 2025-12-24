import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthPayload } from '../types';
import { PrismaClient } from '@prisma/client';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';
const prisma = new PrismaClient();

/**
 * 密码哈希函数
 */
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 内存中存储用户密码（实际应该使用数据库）
let users: { [key: string]: string } = {
  'admin': 'admin123'
};

/**
 * 认证服务
 */
export class AuthService {
  /**
   * 验证用户名和密码（从数据库）
   */
  static async validateCredentials(username: string, password: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!user) {
        return false;
      }
      
      // 对输入的密码进行哈希，然后比对
      const hashedPassword = hashPassword(password);
      return user.password === hashedPassword;
    } catch (error) {
      console.error('验证密码时出错:', error);
      // 降级到内存存储
      return users[username] === password;
    }
  }

  /**
   * 生成 JWT Token
   */
  static generateToken(username: string): string {
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
  }

  /**
   * 验证 Token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * 修改密码
   */
  static updatePassword(username: string, newPassword: string): boolean {
    if (!users[username]) {
      return false;
    }
    users[username] = newPassword;
    return true;
  }

  /**
   * 获取哈希密码
   */
  static hashPassword(password: string): string {
    return hashPassword(password);
  }
}
