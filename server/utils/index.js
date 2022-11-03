require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const db = require('../models');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const accessTokenOptions = { expiresIn: '<expiresIn time>' };
const refreshTokenOptions = { expiresIn: '<expiresIn time>' };

const generateAccessJwtToken = async (id) => {
  const signedAccessJwtToken = jwt.sign(
    { id },
    ACCESS_TOKEN_SECRET,
    accessTokenOptions
  );
  return signedAccessJwtToken;
};

const generateRefreshJwtToken = async (id) => {
  const signedRefreshJwtToken = jwt.sign(
    { id },
    REFRESH_TOKEN_SECRET,
    refreshTokenOptions
  );
  return signedRefreshJwtToken;
};

const setAccessTokenCookie = async (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 1 * 60 * 1000),
  };
  return await res.cookie('accessToken', token, cookieOptions);
};

const setRefreshTokenCookie = async (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  };
  return await res.cookie('refreshToken', token, cookieOptions);
};

const setLoggedInCookie = async (res) => {
  const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 1 * 60 * 1000),
  };

  return await res.cookie('loggedIn', true, cookieOptions);
};

exports.generateTokenCookies = async (res, authUserInDb) => {
  let accessToken = await generateAccessJwtToken(authUserInDb);
  let refreshToken = await generateRefreshJwtToken(authUserInDb);

  const userToken = await db.Token.findOne({ userId: authUserInDb });
  if (userToken) await userToken.remove();

  await db.Token.create({ userId: authUserInDb, token: refreshToken });

  await setAccessTokenCookie(res, accessToken);
  await setRefreshTokenCookie(res, refreshToken);
  await setLoggedInCookie(res);
};

exports.generateRefreshTokenCookies = async (res, refreshToken) => {
  //query for the token to check if it is valid:
  const tokenInDb = await db.Token.findOne({ token: refreshToken });
  //send error if no token found:
  if (!tokenInDb) return res.status(401).json({ message: 'Token expired!' });

  //extract payload from refresh token and generate a new access token and send it
  const payload = await verifyRefreshJwtToken(tokenInDb.token);

  const accessToken = await generateAccessJwtToken(payload.id);

  await setAccessTokenCookie(res, accessToken);
  await setLoggedInCookie(res);
};

exports.verifyAccessJwtToken = async (token) => {
  const verifiedAccessJwtToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  return verifiedAccessJwtToken;
};

const verifyRefreshJwtToken = async (token) => {
  const verifiedRefreshJwtToken = jwt.verify(token, REFRESH_TOKEN_SECRET);
  return verifiedRefreshJwtToken;
};

exports.getTokenFromHeaders = async (headers) => {
  const token = headers['authorization'];

  return token ? token.slice(7, token.length) : null;
};

exports.generateString = (len) => {
  var ans = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = len; i > 0; i--) {
    ans += characters[Math.floor(Math.random() * charactersLength)];
  }
  return ans;
};

// Hash users password
exports.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

/**
 * compares password
 * @param {String} password Password
 * @param {String} hash Hash to be compared with password
 * @returns {Boolean} Boolean
 */

exports.comparePassword = async (password, hashedPassword) => {
  const isMatched = await bcrypt.compare(password, hashedPassword);

  return isMatched;
};

// create directory if not exist
// const dirName = await createDirectory('/public/uploads/avatar/');
exports.createDirectory = async (dirPath) => {
  const dirName = path.join(process.cwd(), dirPath);

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  return dirName;
};
