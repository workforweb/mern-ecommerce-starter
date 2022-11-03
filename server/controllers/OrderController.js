const db = require('../models');

exports.newOrder = async (req, res) => {
  // const io = req.app.get('socketio');
  const owner = req.params.userId;
  if (!db.isValidId(owner)) return false;
  const { customerDetails, status } = req.body;

  try {
    const user = await db.User.findById(owner);

    let cart = await db.Cart.findOne({ owner });

    if (!cart)
      return res.status(400).json({
        success: false,
        message: 'Cart not found!',
      });

    let billWithoutTaxAndShippingCharges = cart.bill;
    let shippingCharges = billWithoutTaxAndShippingCharges > 1000 ? 0 : 200;
    let taxPrice = billWithoutTaxAndShippingCharges * 0.18; // 18% G.S.T.
    let totalBill =
      billWithoutTaxAndShippingCharges + taxPrice + shippingCharges;

    const { address, city, state, country, pincode, phone } = customerDetails;
    if (!address || !city || !state || !country || !pincode || !phone)
      return res.status(400).json({
        success: false,
        message: 'Customer details are mandatory',
      });

    const order = await db.Order.create({
      owner: cart.owner,
      products: cart.products,
      bill: billWithoutTaxAndShippingCharges,
      taxPrice,
      shippingCharges,
      totalBill,
      customerDetails,
      status,
    });

    await order.save();

    const notification = {
      status: 'unread',
      message: `New order from ${user.name}`,
      time: new Date(),
    };
    io.sockets.emit('new-order', notification);
    user.markModified('orders');
    await user.save();

    //delete cart
    // await db.Cart.findByIdAndDelete({ _id: cart.id });

    return res.status(200).json({ success: true, order: order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteOrderCart = async (req, res) => {
  const owner = req.params.userId;
  if (!db.isValidId(owner)) return false;
  try {
    let cart = await db.Cart.findOne({ owner });

    if (!cart)
      return res.status(400).json({
        success: false,
        message: 'Cart not found!',
      });

    await db.Cart.findByIdAndDelete({ _id: cart.id });

    return res.status(200).json({ success: true, message: 'Cart removed!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.removeOrder = async (req, res) => {
  const orderId = req.params.orderId;
  if (!db.isValidId(orderId)) return false;
  try {
    const order = await db.Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with this Id ${orderId}`,
      });
    }

    // delete order
    await db.Order.findByIdAndDelete({ _id: order.id });

    return res
      .status(200)
      .json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// all orders (user)
exports.myOrders = async (req, res) => {
  const owner = req.params.userId;
  if (!db.isValidId(owner)) return false;
  try {
    const orders = await db.Order.find({ owner })
      .populate('owner', ['name', 'email'])
      .sort({ paidAt: -1 });
    return res.status(200).json({ success: true, orders: orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// all orders (admin)
exports.adminOrders = async (req, res) => {
  try {
    const orders = await db.Order.find()
      .populate('owner', ['email', 'name'])
      .sort({ paidAt: -1 });
    res.status(200).json({ success: true, orders: orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.patchShippedOrder = async (req, res) => {
  const io = req.app.get('socketio');

  const { orderId } = req.params;

  const owner = req.body.userId;

  if (!db.isValidId(orderId)) return false;
  try {
    const user = await db.User.findById(owner);

    await db.Order.findByIdAndUpdate(orderId, { status: 'shipped' });
    const orders = await db.Order.find().populate('owner', ['email', 'name']);
    const notification = {
      status: 'unread',
      message: `Order ${orderId} shipped with success`,
      time: new Date(),
    };
    await io.sockets.emit('notification', notification, owner);
    await user.notifications.push(notification);
    await user.save();
    return res.status(200).json({ success: true, orders: orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
