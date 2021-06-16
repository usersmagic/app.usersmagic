const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const completeGetController = require('../controllers/auth/complete/get');
const loginGetController = require('../controllers/auth/login/get');
const registerGetController = require('../controllers/auth/register/get');
const logoutGetController = require('../controllers/auth/logout/get');

const completePostController = require('../controllers/auth/complete/post');
const loginPostController = require('../controllers/auth/login/post');
const registerPostController = require('../controllers/auth/register/post');
const changePasswordPostController = require('../controllers/auth/change_password/post');

router.get(
  '/complete',
    isLoggedIn,
    completeGetController
);
router.get(
  '/login',
    loginGetController
);
router.get(
  '/register',
    registerGetController
);
router.get(
  '/logout',
    logoutGetController
);

router.post(
  '/complete',
    isLoggedIn,
    completePostController
);
router.post(
  '/login',
    loginPostController
);
router.post(
  '/register',
    registerPostController
);
router.post(
  '/change_password',
    changePasswordPostController
);

module.exports = router;
