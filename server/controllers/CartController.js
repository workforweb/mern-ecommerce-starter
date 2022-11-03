const db = require('../models');

exports.getCartItems = async (req, res) => {
  const owner = req.params.userId;
  if (!db.isValidId(owner)) return false;
  try {
    let cart = await db.Cart.findOne({ owner });

    if (cart && cart.products.length > 0) {
      return res.status(200).json({ success: true, cart: cart });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'cart is empty!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCart = async (req, res) => {
  const { productId, quantity } = req.body;
  /* "owner" from database and "req.body.userId" from req.body (coming fromn client) */
  const owner = req.params.userId;
  if (!db.isValidId(owner)) return false;

  try {
    const cart = await db.Cart.findOne({ owner });

    const product = await db.Product.findOne({ _id: productId });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'product not found!' });

    const price = product.price;
    const name = product.name;
    const image = product.images[0];
    //If cart already exists for user,
    if (cart) {
      let itemIndex = cart.products.findIndex(
        (item) => String(item.productId) === String(productId)
      );

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, name, quantity, price, image });
      }

      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      await cart.save();
      return res.status(200).json({ success: true, cart: cart });
    } else {
      //no cart exists, create one
      const newCart = await db.Cart.create({
        owner,
        products: [{ productId, name, quantity, price, image }],
        bill: quantity * price,
      });
      return res.status(201).json({ success: true, cart: newCart });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  const owner = req.params.userId;
  const productId = req.params.productId;
  if (!db.isValidId(owner)) return false;
  if (!db.isValidId(productId)) return false;
  try {
    let cart = await db.Cart.findOne({ owner });
    let itemIndex = cart.products.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      let productItem = cart.products[itemIndex];
      cart.bill -= productItem.quantity * productItem.price;
      cart.products.splice(itemIndex, 1);
    }

    cart = await cart.save();

    return res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const owner = req.params.userId;
  const { productId, quantity } = req.body;
  if (!db.isValidId(owner)) return false;

  try {
    let cart = await db.Cart.findOne({ owner });

    if (!cart)
      return res.status(400).json({
        success: false,
        message: 'Cart not found!',
      });

    const product = cart.products.find(
      (p) => String(p.productId) === String(productId)
    );

    product.quantity = quantity;

    cart.bill = cart.products.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);

    cart = await cart.save();
    return res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
