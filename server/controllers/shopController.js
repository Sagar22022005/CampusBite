import Shop from '../models/Shop.js';
import Product from '../models/Product.js';

// @desc    Get shops by category or query
// @route   GET /api/shops
// @access  Public
export const getShops = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const shops = await Shop.find(query).populate('owner', 'name email phone');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shop by ID with its products
// @route   GET /api/shops/:id
// @access  Public
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email phone');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const products = await Product.find({ shop: shop._id });
    res.json({ shop, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current shop owner's shop
// @route   GET /api/shops/my/shop
// @access  Private (Shop Owner)
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(200).json({ shop: null, message: 'No shop created yet' });
    }
    const products = await Product.find({ shop: shop._id });
    res.json({ shop, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update current shop owner's shop
// @route   POST /api/shops/my/shop
// @access  Private (Shop Owner)
export const saveMyShop = async (req, res) => {
  try {
    const { name, category, description, imageUrl, location } = req.body;
    let shop = await Shop.findOne({ owner: req.user._id });

    let image = imageUrl;
    let imageType = 'url';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      imageType = 'upload';
    }

    if (shop) {
      shop.name = name || shop.name;
      shop.category = category || shop.category;
      shop.description = description !== undefined ? description : shop.description;
      shop.location = location || shop.location;
      if (image) {
        shop.image = image;
        shop.imageType = imageType;
      }
      const updatedShop = await shop.save();
      return res.json({ message: 'Shop profile updated successfully', shop: updatedShop });
    } else {
      if (!name || !category) {
        return res.status(400).json({ message: 'Shop name and category are required' });
      }

      shop = await Shop.create({
        owner: req.user._id,
        name,
        category,
        description: description || '',
        location: location || 'IIT Indore Campus',
        image:
          image ||
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        imageType: image ? imageType : 'url',
        isOpen: true,
      });

      return res.status(201).json({ message: 'Shop created successfully', shop });
    }
  } catch (error) {
    console.error('Shop save error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle shop open/close status
// @route   PATCH /api/shops/my/toggle-status
// @access  Private (Shop Owner)
export const toggleShopStatus = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    shop.isOpen = req.body.isOpen !== undefined ? req.body.isOpen : !shop.isOpen;
    await shop.save();

    res.json({
      message: `Shop is now ${shop.isOpen ? 'OPEN 🟢' : 'CLOSED 🔴'}`,
      isOpen: shop.isOpen,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
