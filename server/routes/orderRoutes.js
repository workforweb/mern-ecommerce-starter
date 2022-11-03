const router = require('express').Router();
const OrderController = require('../controllers/OrderController');
const Middleware = require('../middlewares');

//creating an order
router.post('/:userId', OrderController.newOrder);

// deleting cart
router.delete('/cart/:userId', OrderController.deleteOrderCart);

// deleting an order
router.delete('/:orderId', OrderController.removeOrder);

// getting all orders (user)
router.get('/:userId', Middleware.checkAuth, OrderController.myOrders);

// getting all orders (admin)
router.get(
  '/',
  Middleware.checkAuth,
  Middleware.isAdmin,
  OrderController.adminOrders
);

//shipping order
router.patch(
  '/:orderId/product-shipped',
  Middleware.checkAuth,
  Middleware.isAdmin,
  OrderController.patchShippedOrder
);

module.exports = router;
