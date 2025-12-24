import { Router, Request, Response } from 'express';
import { ProductService, ProductCategoryService } from '../services/ProductService.js';
import { authMiddleware } from '../middleware/index.js';
import { uploadHandlers } from '../services/UploadService.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// ===== 产品 API =====

/**
 * GET /api/products
 * 获取所有产品（公开）
 */
router.get('/products', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const categoryId = req.query.categoryId as string | undefined;
    const result = await ProductService.getProductsList(page, pageSize, categoryId);
    res.json({
      code: 200,
      message: 'Success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

/**
 * GET /api/products/featured
 * 获取首页展示的产品（公开）
 */
router.get('/products/featured', async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getFeaturedProducts();
    res.json({
      code: 200,
      message: 'Success',
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

/**
 * GET /api/products/:id
 * 获取单个产品（公开）
 */
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: 'Product not found'
      });
    }
    res.json({
      code: 200,
      message: 'Success',
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/products
 * 获取所有产品列表（需要认证）
 */
router.get('/admin/products', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const categoryId = req.query.categoryId as string | undefined;
    const result = await ProductService.getProductsList(page, pageSize, categoryId);
    res.json({
      code: 200,
      message: 'Success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/products/:id
 * 获取单个产品（需要认证）
 */
router.get('/admin/products/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: 'Product not found'
      });
    }
    res.json({
      code: 200,
      message: 'Success',
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/products
 * 创建产品（需要认证）
 */
router.post('/admin/products', authMiddleware, uploadHandlers.products.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('=== 创建产品 ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file?.filename);
    
    const { name, model, description, content, categoryId, price, featured, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    console.log('字段检查:');
    console.log('  name:', name, '✓');
    console.log('  categoryId:', categoryId, '✓');
    console.log('  description:', description);
    console.log('  content:', content);
    console.log('  model:', model);
    console.log('  featured:', featured);
    console.log('  displayOrder:', displayOrder);
    console.log('  imageUrl:', imageUrl);

    if (!name || !categoryId) {
      console.error('❌ 验证失败: name或categoryId缺失');
      return res.status(400).json({
        code: 400,
        message: 'Name and categoryId are required',
        details: { name: !!name, categoryId: !!categoryId }
      });
    }

    console.log('✅ 验证通过，开始创建产品...');

    const product = await ProductService.createProduct({
      name,
      model: model || undefined,
      description: description || undefined,
      content: content || undefined,
      categoryId,
      price: price ? parseFloat(price) : undefined,
      image: imageUrl,
      featured: featured === 'true' || featured === true || false,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0
    });

    console.log('✅ 产品创建成功:', product.id);

    res.status(201).json({
      code: 201,
      message: 'Product created successfully',
      data: product
    });
  } catch (error: any) {
    console.error('❌ 创建产品失败:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to create product',
      error: error.message,
      stack: error.stack
    });
  }
});

/**
 * PUT /api/admin/products/:id
 * 更新产品（需要认证）
 */
router.put('/admin/products/:id', authMiddleware, uploadHandlers.products.single('file'), async (req: Request, res: Response) => {
  try {
    const { name, model, description, content, categoryId, oldImage, featured, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    console.log('=== 更新产品 ===');
    console.log('产品ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('新图片:', imageUrl);
    console.log('旧图片:', oldImage);
    console.log('featured:', featured);
    console.log('displayOrder:', displayOrder);

    // 如果有新图片上传且有旧图片路径，删除旧图片
    if (imageUrl && oldImage) {
      const oldImagePath = oldImage.startsWith('/uploads/') ? oldImage.substring('/uploads/'.length) : oldImage;
      const uploadDirPath = path.join(__dirname, '../../uploads');
      const fullPath = path.join(uploadDirPath, oldImagePath);
      
      console.log('删除旧图片:', fullPath);
      
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log('✅ 旧图片删除成功');
        } catch (err) {
          console.error('❌ 删除旧图片失败:', err);
        }
      } else {
        console.log('⚠️  旧图片文件不存在');
      }
    }

    // 确定最终的图片路径：优先用新上传的，否则保持原有的
    let finalImageUrl = imageUrl;
    if (!imageUrl) {
      const currentProduct = await ProductService.getProductById(req.params.id);
      finalImageUrl = currentProduct?.image || undefined;
    }

    console.log('最终图片:', finalImageUrl);

    const product = await ProductService.updateProduct(req.params.id, {
      name,
      model,
      description,
      content,
      categoryId,
      image: finalImageUrl,
      featured: featured === 'true' || featured === true || false,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0
    } as any);

    console.log('✅ 产品更新成功:', product.id);

    res.json({
      code: 200,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error: any) {
    console.error('❌ 更新产品失败:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/products/:id
 * 删除产品（需要认证）
 */
router.delete('/admin/products/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    // 先获取产品信息以获取图片路径
    const product = await ProductService.getProductById(req.params.id);
    
    // 删除产品
    const deletedProduct = await ProductService.deleteProduct(req.params.id);
    
    // 删除关联的图片文件
    if (product && product.image) {
      const imagePath = product.image;
      if (imagePath.startsWith('/uploads/')) {
        const fileName = imagePath.substring('/uploads/'.length);
        const uploadDirPath = path.join(__dirname, '../../uploads');
        const fullPath = path.join(uploadDirPath, fileName);
        
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (err) {
            console.error('Failed to delete image file:', err);
          }
        }
      }
    }
    
    res.json({
      code: 200,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// ===== 产品分类 API =====

/**
 * GET /api/product-categories
 * 获取所有分类（公开）
 */
router.get('/product-categories', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 100;
    const categories = await ProductCategoryService.getAllCategories();
    const skip = (page - 1) * pageSize;
    const paginatedData = categories.slice(skip, skip + pageSize);
    
    res.json({
      code: 200,
      message: 'Success',
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total: categories.length,
        totalPages: Math.ceil(categories.length / pageSize)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/product-categories
 * 获取所有分类（需要认证）
 */
router.get('/admin/product-categories', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 100;
    const categories = await ProductCategoryService.getAllCategories();
    const skip = (page - 1) * pageSize;
    const paginatedData = categories.slice(skip, skip + pageSize);
    
    res.json({
      code: 200,
      message: 'Success',
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total: categories.length,
        totalPages: Math.ceil(categories.length / pageSize)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/product-categories/:id
 * 获取单个分类（需要认证）
 */
router.get('/admin/product-categories/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const categories = await ProductCategoryService.getAllCategories();
    const category = categories.find(c => c.id === req.params.id);
    
    if (!category) {
      return res.status(404).json({
        code: 404,
        message: 'Category not found'
      });
    }
    
    res.json({
      code: 200,
      message: 'Success',
      data: category
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/product-categories
 * 创建分类（需要认证）
 */
router.post('/admin/product-categories', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        code: 400,
        message: 'Name is required'
      });
    }

    const category = await ProductCategoryService.createCategory(name);
    res.status(201).json({
      code: 201,
      message: 'Category created successfully',
      data: category
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/product-categories/:id
 * 更新分类（需要认证）
 */
router.put('/admin/product-categories/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        code: 400,
        message: 'Name is required'
      });
    }

    const category = await ProductCategoryService.updateCategory(req.params.id, name);
    res.json({
      code: 200,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to update category',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/product-categories/:id
 * 删除分类（需要认证）
 */
router.delete('/admin/product-categories/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    // 先获取该分类下的所有产品
    const category = await ProductCategoryService.getCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        code: 404,
        message: 'Category not found'
      });
    }

    // 删除所有关联产品的图片文件
    if (category.products && category.products.length > 0) {
      for (const product of category.products) {
        if (product.image && product.image.startsWith('/uploads/')) {
          const fileName = product.image.substring('/uploads/'.length);
          const uploadDirPath = path.join(__dirname, '../../uploads');
          const fullPath = path.join(uploadDirPath, fileName);
          
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
              console.log(`✓ 已删除产品图片: ${fullPath}`);
            } catch (err) {
              console.error('❌ 删除产品图片失败:', err);
            }
          }
        }
      }
    }

    // 删除分类（级联删除产品）
    const deletedCategory = await ProductCategoryService.deleteCategory(req.params.id);
    
    res.json({
      code: 200,
      message: 'Category deleted successfully',
      data: deletedCategory
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

export default router;
