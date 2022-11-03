const db = require('../models');
const Utils = require('../utils');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Validator = require('../utils/ApiValidation');
const ApiFeatures = require('../utils/apiFeatures');

// get products;
exports.products = async (req, res) => {
  try {
    const resultPerPage = 4;
    const productsCount = await db.Product.countDocuments();
    const features = new ApiFeatures(db.Product.find(), req.query)
      .search()
      .sort()
      .filter()
      .pagination(resultPerPage);

    const products = await features.query;
    if (products.length < 1)
      return res
        .status(404)
        .json({ success: false, error: 'No product found' });

    const pages = Math.ceil(productsCount / resultPerPage);

    res.json({
      status: 'success',
      filteredProductsCount: products.length,
      productsCount: productsCount,
      resultPerPage: resultPerPage,
      pages: pages,
      products: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// create product
exports.createSingleProduct = async (req, res) => {
  const { name, description, price, category } = req.body;

  const url = req.protocol + '://' + req.get('host');
  const imagePath = '/public/uploads/products/';

  try {
    const { valid, errors } = Validator.validateProductsInput(
      name,
      description,
      price,
      category
    );
    if (!valid) {
      return res.status(400).json({ success: false, message: errors });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      errors.push('No files were uploaded');
      return res.status(400).json({ success: false, message: errors });
    } else if (Object.keys(req.files).length !== 2) {
      errors.push('Two files is required');
      return res.status(400).json({ success: false, message: errors });
    }

    const dirName = await Utils.createDirectory(imagePath);

    const reqFiles = [];

    const multiplePicturePromise = req.files.map(async (file) => {
      await sharp(file.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(dirName, file.filename)),
        reqFiles.push(url + imagePath + file.filename);
    });

    await Promise.all(multiplePicturePromise);

    await db.Product.create({
      name,
      description,
      price,
      category: await slugify(category),
      images: reqFiles,
    });

    const products = await db.Product.find();

    products ? products : res.json({ message: 'No Product in store' });

    return res
      .status(201)
      .json({ success: true, message: 'Product Added', products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get single product (mainly for put api call to help for update product)
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db.isValidId(id)) return false;

    const findProductById = await db.Product.findOne({ _id: id }).orFail();

    if (!findProductById)
      return res
        .status(404)
        .json({ success: false, error: 'No product found' });

    return res
      .status(200)
      .json({ success: true, message: 'Product found', findProductById });
  } catch (err) {
    console.error('Error from server /products/:id route', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// update product
exports.updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;

  const { id } = req.params;

  if (!db.isValidId(id)) return false;

  const imageRootPath = path.join(process.cwd(), '/public/uploads/products/');
  const url = req.protocol + '://' + req.get('host');

  try {
    const { valid, errors } = Validator.validateProductsInput(
      name,
      description,
      price,
      category
    );
    if (!valid) {
      return res.status(400).json({ success: false, message: errors });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      errors.push('No files were uploaded');
      return res.status(400).json({ success: false, message: errors });
    } else if (Object.keys(req.files).length !== 2) {
      errors.push('Two files is required');
      return res.status(400).json({ success: false, message: errors });
    }

    // Delete image from folder
    const product = await db.Product.findOne({ _id: id }).orFail();

    const deleteAllImagesInArray = await product.images.map(async (file) => {
      const filename = await file.split('/').pop();

      if (fs.existsSync(imageRootPath + filename))
        fs.unlinkSync(imageRootPath + filename);
    });

    await Promise.all(deleteAllImagesInArray);

    // add images tp folder
    const imagePath = '/public/uploads/products/';
    const dirName = await Utils.createDirectory(imagePath);

    const reqFiles = [];

    const multiplePicturePromise = req.files.map(async (file) => {
      await sharp(file.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(dirName, file.filename)),
        reqFiles.push(url + imagePath + file.filename);
    });

    await Promise.all(multiplePicturePromise);

    // update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.images = reqFiles || product.images;

    await product.save();

    const products = await db.Product.find();

    return res
      .status(200)
      .json({ success: true, message: 'Product Updated', products });
  } catch (err) {
    console.error('Error from server /update route', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// delete product
exports.deleteSingleProduct = async (req, res) => {
  const imagePath = path.join(process.cwd(), '/public/uploads/products/');

  const { id } = req.params;
  if (!db.isValidId(id)) return false;

  try {
    const user = await db.User.findById(req.user.id);
    if (!user || req.user.role !== 'admin')
      // req.params.id === req.user.id
      return res.status(401).json("You don't have permission");

    const productToDelete = await db.Product.findOne({ _id: id });

    const deleteAllImagesInArray = await productToDelete.images.map(
      async (file) => {
        const filename = await file.split('/').pop();

        if (fs.existsSync(imagePath + filename))
          fs.unlinkSync(imagePath + filename);
        else return res.json({ message: 'image not found!' });
      }
    );

    await Promise.all([
      deleteAllImagesInArray,
      await db.Product.findByIdAndDelete(id),
    ]);

    const products = await db.Product.find();
    products ? products : res.json({ message: 'No product found!' });

    return res
      .status(200)
      .json({ success: true, message: 'Product Deleted', products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Find similar products
exports.findSimilarProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await db.Product.findById(id);
    const similar = await db.Product.find({ category: product.category }).limit(
      5
    );

    return res.status(200).json({
      success: true,
      message: 'Getting similar products',
      product: product,
      similar: similar,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Find products category
exports.findProductCategory = async (req, res) => {
  try {
    const categories = await db.Product.find().distinct('category'); // .select('category');

    return res.status(200).json({ success: true, categories: categories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

async function slugify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
