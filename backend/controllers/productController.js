import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const query = {};

    // 1. Keyword search (regex match on title)
    if (req.query.keyword) {
      query.title = {
        $regex: req.query.keyword,
        $options: 'i',
      };
    }

    // 2. Category filtering
    if (req.query.category) {
      const categories = req.query.category.split(',');
      query.category = { $in: categories };
    }

    // 3. Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // 4. Volume filtering
    if (req.query.volume) {
      const volumes = req.query.volume.split(',').map(v => new RegExp(v.trim(), 'i'));
      query.volume = { $in: volumes };
    }

    // 5. Region filtering
    if (req.query.region) {
      const regions = req.query.region.split(',').map(r => r.trim());
      query.region = { $in: regions };
    }

    // 6. Sorting
    let sort = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') {
        sort = { price: 1 };
      } else if (req.query.sort === 'price_desc') {
        sort = { price: -1 };
      } else if (req.query.sort === 'rating') {
        sort = { rating: -1 };
      } else if (req.query.sort === 'newest') {
        sort = { createdAt: -1 };
      }
    }

    // Return the raw list as an array for backward compatibility if no page/limit is provided
    if (req.query.all === 'true' || (!req.query.page && !req.query.limit)) {
      const products = await Product.find(query).populate('category').sort(sort);
      return res.json(products);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category')
      .sort(sort)
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
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
