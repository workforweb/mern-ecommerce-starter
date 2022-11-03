const router = require('express').Router();

const upload = require('../middlewares/upload');
const AuthController = require('../controllers/AuthController');
const Middleware = require('../middlewares');

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public

router.post('/signup', AuthController.signup);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

router.post('/login', AuthController.login);

// @desc    Get a new refresh token
// @route   POST /api/v1/auth/refresh_token
// @access  Private

router.post('/refresh_token', AuthController.generateRefreshToken);

// @desc    Logout user
// @route   Delete /api/v1/auth/logout
// @access  Private

router.delete('/logout', AuthController.logout);

// @desc    Delete user
// @route   Delete /api/v1/auth/user/:id
// @access  Private

router.delete('/:id', Middleware.checkAuth, AuthController.deleteUser);

// @desc    Get auth user
// @route   Get /api/v1/getMe
// @access  Private

router.get('/getMe', Middleware.checkAuth, AuthController.getAuthorizedUser);

// @desc    Get auth user
// @route   Get /api/v1/set-profile-image
// @access  Private

router.post(
  '/set-profile-image',
  Middleware.checkAuth,
  upload.single('avatar'),
  AuthController.postProfileImage
);

// @desc    Get user Notifications
// @route   Get /api/v1/:id/updateNotifications
// @access  Private

router.post(
  '/:id/updateNotifications',
  Middleware.checkAuth,
  AuthController.updateNotifications
);

module.exports = router;
