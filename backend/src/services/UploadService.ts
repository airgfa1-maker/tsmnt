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
    path.join(uploadDir, 'documents'),
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
const createUpload = (uploadType: 'products' | 'cases' | 'news' | 'documents' | 'hero') => {
  const folderMap: Record<string, string> = {
    products: 'products',
    cases: 'cases',
    news: 'news',
    documents: 'documents',
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
      // 文档支持常见文档格式
      if (uploadType === 'documents') {
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'text/csv',
          'application/zip',
          'application/x-rar-compressed',
          'application/x-7z-compressed',
          'application/x-tar',
          'application/gzip',
          'application/x-gzip'
        ];
        
        const allowedExts = [
          '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', 
          '.txt', '.csv', '.zip', '.rar', '.7z', '.tar', '.gz', '.tgz'
        ];
        
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeOk = allowedMimes.includes(file.mimetype);
        const extOk = allowedExts.includes(ext);
        
        // 只要 MIME 类型或扩展名中有一个符合就接受
        if (mimeOk || extOk) {
          cb(null, true);
        } else {
          cb(new Error('Only document files are allowed (PDF, Word, Excel, PowerPoint, Text, CSV, ZIP, RAR, 7Z, TAR, GZ)'));
        }
      } else {
        // 其他类型（图片）
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
        }
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
  documents: createUpload('documents'),
  hero: createUpload('hero')
};

export default { ensureUploadDirs, uploadHandlers };
