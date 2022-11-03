const router = require('express').Router();
const ProductController = require('../controllers/ProductController');
const Middleware = require('../middlewares');
const upload = require('../middlewares/upload');

// get products;
router.get('/', ProductController.products);

// create product
router.post(
  '/',
  Middleware.checkAuth,
  Middleware.isAdmin,
  upload.array('images', 2),
  ProductController.createSingleProduct
);

// Find products category
router.get('/categories', ProductController.findProductCategory);

// Get single product (mainly for put api call to help for update product)
router.get('/single/:id', ProductController.getSingleProduct);

// update product
router.patch(
  '/:id',
  Middleware.checkAuth,
  Middleware.isAdmin,
  upload.array('images', 2),
  // upload.fields([{ name: 'images', maxCount: 2 }]),
  ProductController.updateProduct
);

// delete product
router.delete(
  '/:id',
  Middleware.checkAuth,
  Middleware.isAdmin,
  ProductController.deleteSingleProduct
);

// Find similar products
router.get('/:id', ProductController.findSimilarProduct);

module.exports = router;
