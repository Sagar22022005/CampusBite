import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (Shop Owner)
export const addProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(400).json({ message: 'Please create a shop profile before adding products' });
    }

    const { name, category, price, stock, description, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    let image = imageUrl;
    let imageType = 'url';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      imageType = 'upload';
    }

    const product = await Product.create({
      shop: shop._id,
      name,
      category: category || shop.category,
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 10,
      description: description || '',
      image:
        image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      imageType: image ? imageType : 'url',
      isAvailable: Number(stock) > 0,
    });

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Shop Owner)
export const updateProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const product = await Product.findOne({ _id: req.params.id, shop: shop._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    const { name, category, price, stock, description, imageUrl, isAvailable } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) {
      product.stock = Number(stock);
      product.isAvailable = Number(stock) > 0;
    }
    if (description !== undefined) product.description = description;
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
      product.imageType = 'upload';
    } else if (imageUrl) {
      product.image = imageUrl;
      product.imageType = 'url';
    }

    const updatedProduct = await product.save();
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Shop Owner)
export const deleteProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const product = await Product.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by shop with search
// @route   GET /api/products/shop/:shopId
// @access  Public
export const getProductsByShop = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { shop: req.params.shopId };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Global search for products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const products = await Product.find({
      name: { $regex: q, $options: 'i' },
      isAvailable: true,
      stock: { $gt: 0 },
    }).populate('shop', 'name category isOpen rating image location');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
