import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 上传根目录 - 指向项目根目录的 /uploads
const uploadDir = path.join(__dirname, '../../uploads');

/**
 * 确保所有上传目录存在
 */
export const ensureUploadDirs = () => {
  const dirs = [
    uploadDir,
    path.join(uploadDir, 'products'),
    path.join(uploadDir, 'cases'),
    path.join(uploadDir, 'news'),
    path.join(uploadDir, 'index') // 用于hero-slides
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created upload directory: ${dir}`);
    }
  });
};

/**
 * 为不同的文件类型创建multer实例
 */
const createUpload = (uploadType: 'products' | 'cases' | 'news' | 'hero') => {
  const folderMap: Record<string, string> = {
    products: 'products',
    cases: 'cases',
    news: 'news',
    hero: 'index' // hero-slides存储在index文件夹
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join(uploadDir, folderMap[uploadType]);
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${uploadType}-${uniqueSuffix}${ext}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
      }
    }
  });
};

/**
 * 导出所有上传处理器
 */
export const uploadHandlers = {
  products: createUpload('products'),
  cases: createUpload('cases'),
  news: createUpload('news'),
  hero: createUpload('hero')
};

export default { ensureUploadDirs, uploadHandlers };
