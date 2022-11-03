const db = require('../models');
const Utils = require('../utils');

//middleware function to check if the incoming request in authenticated:
exports.checkAuth = async (req, res, next) => {
  // get the token stored in the custom header called 'x-auth-token'
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  //send error message if no token is found:
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Please login first!' });
  }
  try {
    const payload = await Utils.verifyAccessJwtToken(token);
    if (!payload) req.user = undefined;
    req.user = await db.User.findById(payload.id).select('-password');

    next();
  } catch (err) {
    if (err) req.user = undefined;
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.isloggedIn = (req, res, next) => {
  if (req?.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
};

exports.isAdmin = (req, res, next) => {
  if (req?.user && req?.user?.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Invalid Admin Token' });
    return;
  }
};
