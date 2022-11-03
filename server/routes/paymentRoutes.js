require('dotenv').config({ path: './../.env' });
// const db = require('../models');
const router = require('express').Router();
// initiate stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

// send stripe key to client
router.get('/config', (req, res) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// create payment intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  // console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'INR', // change currency accordingly
      amount: amount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: 'false', message: error.message });
  }
});

module.exports = router;
