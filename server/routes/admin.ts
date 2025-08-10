import express from 'express';
import { nanoid } from 'nanoid';
import { productSchema } from '@shared/mongoSchema';
import { mongoStorage } from '../storage/mongoStorage';
import { adminAuth, AuthRequest } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get all products (admin)
router.get('/products', adminAuth, async (req: AuthRequest, res) => {
  try {
    const products = await mongoStorage.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Create product with image upload
router.post('/products', adminAuth, upload.array('images', 5), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls = files ? files.map(file => file.path) : [];
    
    const productData = {
      ...req.body,
      images: imageUrls,
      featured: parseInt(req.body.featured) || 0,
    };
    
    const validatedData = productSchema.parse(productData);
    const product = await mongoStorage.createProduct(validatedData);
    
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create product' });
  }
});

// Update product
router.put('/products/:id', adminAuth, upload.array('images', 5), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];
    
    let updateData = { ...req.body };
    
    if (files && files.length > 0) {
      const imageUrls = files.map(file => file.path);
      updateData.images = imageUrls;
    }
    
    if (updateData.featured) {
      updateData.featured = parseInt(updateData.featured);
    }
    
    const product = await mongoStorage.updateProduct(id, updateData);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const success = await mongoStorage.deleteProduct(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Bulk upload products
router.post('/products/bulk', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products must be an array' });
    }
    
    const createdProducts = [];
    
    for (const productData of products) {
      try {
        const validatedData = productSchema.parse(productData);
        const product = await mongoStorage.createProduct(validatedData);
        createdProducts.push(product);
      } catch (error: any) {
        console.error('Error creating product:', error.message);
      }
    }
    
    res.status(201).json({
      message: `Created ${createdProducts.length} products`,
      products: createdProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to bulk create products' });
  }
});

export default router;