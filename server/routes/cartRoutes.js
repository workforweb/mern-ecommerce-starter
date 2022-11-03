const router = require('express').Router();
const CartController = require('../controllers/CartController');

router.get('/:userId', CartController.getCartItems);
router.post('/:userId', CartController.createCart);
router.put('/:userId', CartController.updateCart);
router.delete('/:userId/:productId', CartController.deleteItem);

module.exports = router;
