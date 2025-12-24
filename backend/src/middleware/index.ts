import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization token
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log(`🔐 [认证中间件] 收到请求: ${req.method} ${req.path}`);
  console.log(`🔐 [认证中间件] Authorization header: ${authHeader ? '已设置' : '未设置'}`);
  console.log(`🔐 [认证中间件] 所有headers:`, JSON.stringify(req.headers, null, 2));
  
  const token = authHeader?.split(' ')[1];
  
  console.log(`🔐 [认证中间件] 提取的token: ${token ? token.substring(0, 30) + '...' : '无'}`);

  if (!token) {
    console.log(`❌ [认证中间件] 没有token，返回401`);
    return res.status(401).json({ code: 401, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    console.log(`✅ [认证中间件] token验证成功，用户:`, decoded);
    next();
  } catch (error) {
    console.log(`❌ [认证中间件] token验证失败:`, error instanceof Error ? error.message : '未知错误');
    res.status(401).json({ code: 401, message: 'Invalid or expired token' });
  }
};

/**
 * 错误处理中间件
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      message: 'Validation error',
      error: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized'
    });
  }

  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * 请求日志中间件
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};
