import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import { authMiddleware } from '../middleware/index.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: 'Username and password are required'
      });
    }

    const isValid = await AuthService.validateCredentials(username, password);
    if (!isValid) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid credentials'
      });
    }

    const token = AuthService.generateToken(username);
    res.json({
      code: 200,
      message: 'Login successful',
      data: { token, username }
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Login failed',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/change-password
 * 修改密码（需要认证）
 */
router.post('/change-password', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = (req as any).user;
    const username = user?.username;

    if (!username) {
      return res.status(401).json({
        code: 401,
        message: 'User information not found in token'
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        message: 'Old password and new password are required'
      });
    }

    // 验证旧密码
    const isOldPasswordValid = await AuthService.validateCredentials(username, oldPassword);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: 'Old password is incorrect'
      });
    }

    // 新密码长度验证
    if (newPassword.length < 6) {
      return res.status(400).json({
        code: 400,
        message: 'New password must be at least 6 characters'
      });
    }

    // 更新密码到数据库（存储哈希值）
    const hashedPassword = AuthService.hashPassword(newPassword);
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { password: hashedPassword }
    });

    // 同时更新内存中的用户信息（以保持一致性）
    AuthService.updatePassword(username, newPassword);

    res.json({
      code: 200,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({
      code: 500,
      message: 'Change password failed',
      error: error.message
    });
  }
});

export default router;
