const db = require('../models');
const Validator = require('../utils/ApiValidation');
const Utils = require('../utils');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public/Anyone

exports.signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const { valid, errors } = Validator.validateRegisterInput(
      name,
      username,
      email,
      password
    );
    if (!valid) {
      return res.status(400).json({ success: false, message: errors });
    }
    //check if email is already taken:
    let user = await db.User.findOne({ email });

    if (user) {
      errors.push('Email already taken');
      return res.status(400).json({ success: false, message: errors });
    }

    // create new user and generate tokens and send
    const hashedPassword = await Utils.encryptPassword(password);

    user = await db.User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    //generate a pair of tokens if valid credentials
    await Utils.generateTokenCookies(res, user._id);

    return res.status(201).json({ success: true, message: 'signin success' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/users
// @access  Public/Anyone

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { valid, errors } = Validator.validateLoginInput(email, password);
    if (!valid) {
      return res.status(400).json({ success: false, message: errors });
    }
    //check if user exists in database:
    let user = await db.User.findOne({ email }).select('+password');

    //send error if no user found:
    if (!user) {
      errors.push('No user found!');
      return res.status(400).json({ success: false, message: errors });
    }
    //check if password is valid: (Mongoose methods working only with already created instance)
    const isMatch = await Utils.comparePassword(password, user.password);

    if (!isMatch) {
      errors.push('Invalid credentials');
      return res.status(400).json({ success: false, message: errors });
    }

    //generate a pair of tokens if valid credentials
    await Utils.generateTokenCookies(res, user._id);

    return res
      .status(200)
      .json({ success: true, message: 'login success', user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Generate new refresh token
// @route   POST /api/users
// @access  Private/User
exports.generateRefreshToken = async (req, res) => {
  try {
    //get refreshToken
    const { refreshToken } = req.cookies;

    //send error if no refreshToken is sent
    if (!refreshToken)
      return res.status(403).json({ message: 'No token provided!' });

    //generate a pair of tokens if valid credentials
    await Utils.generateRefreshTokenCookies(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Generate New Access Token 😊 👌',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Logout user
// @route   DELETE /auth/logout
// @access  Private/User

exports.logout = async (req, res) => {
  try {
    //delete the refresh token saved in database:
    const { refreshToken } = req.cookies;
    await db.Token.findOneAndDelete({ token: refreshToken });
    return res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .clearCookie('loggedIn')
      .status(200)
      .json({ success: true, message: 'Successfully logged out 😏 🍀' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    get Authorized User
// @route   GEt /api/users
// @access  Private/User

exports.getAuthorizedUser = async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id).select(
      '-password -createdAt -updatedAt'
    );

    return res.status(200).json({ success: true, user: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Logout user
// @route   POST /api/users
// @access  Private/User

const resizeImg = async (req, imgPath) => {
  // upload one file it's req.file and to multiple files is req.files.
  // req.file holds multer uploaded file.
  if (!req.file)
    return res.status(401).json({ error: 'Please provide an image' });

  const dirName = await Utils.createDirectory(imgPath);

  return await sharp(req.file.path)
    .resize(200, 200)
    .jpeg({ quality: 90 })
    .toFile(path.resolve(dirName, req.file.filename));
};

exports.postProfileImage = async (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  try {
    const user = await db.User.findById(req.user.id);

    const imagePath = '/public/uploads/avatar/';

    await resizeImg(req, imagePath);

    user.avatar = url + imagePath + req.file.filename;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: 'Avatar upload successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete user
// @route   Delete /api/v1/auth/user/:id
// @access  Private

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const imagePath = path.join(process.cwd(), '/public/uploads/avatar/');
  try {
    const user = await db.User.findById(id);

    const filename = await user.avatar.split('/').pop();

    if (fs.existsSync(imagePath + filename))
      fs.unlinkSync(imagePath + filename);
    else return res.json({ message: 'image not found!' });

    await db.Token.deleteMany({ userId: id });
    await db.User.findByIdAndDelete(id).orFail();

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// update user notifcations
exports.updateNotifications = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.User.findById(id);
    user.notifications.forEach((notif) => {
      notif.status = 'read';
    });
    user.markModified('notifications');
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};
