import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {

    const products = await Product.find({}).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      images,
      volume,
      region,
      category,
      badge,
      badgeType,
      countInStock
    } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const product = new Product({
      title: title || 'Sample Product',
      price: price || 0,
      description: description || 'Sample Description',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'],
      volume: volume || '500ml',
      region: region || 'Tunisia',
      category,
      badge: badge || null,
      badgeType: badgeType || null,
      countInStock: countInStock || 10,
      rating: 5.0
    });

    const createdProduct = await product.save();
    const populatedProduct = await Product.findById(createdProduct._id).populate('category');
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    title,
    price,
    description,
    images,
    volume,
    region,
    category,
    badge,
    badgeType,
    countInStock,
    rating
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title !== undefined ? title : product.title;
      product.price = price !== undefined ? price : product.price;
      product.description = description !== undefined ? description : product.description;
      product.images = images !== undefined ? images : product.images;
      product.volume = volume !== undefined ? volume : product.volume;
      product.region = region !== undefined ? region : product.region;
      product.category = category !== undefined ? category : product.category;
      product.badge = badge !== undefined ? badge : product.badge;
      product.badgeType = badgeType !== undefined ? badgeType : product.badgeType;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.rating = rating !== undefined ? rating : product.rating;

      const updatedProduct = await product.save();
      const populatedProduct = await Product.findById(updatedProduct._id).populate('category');
      res.json(populatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
