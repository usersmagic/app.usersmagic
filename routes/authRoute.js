const express = require('express');
const router = express.Router();

const loginGetController = require('../controllers/auth/login/get');
const registerGetController = require('../controllers/auth/register/get');

const loginPostController = require('../controllers/auth/login/post');
const registerPostController = require('../controllers/auth/register/post');

router.get(
  '/login',
    loginGetController
);
router.get(
  '/register',
    registerGetController
);

router.post(
  '/login',
    loginPostController
);
router.post(
  '/register',
    registerPostController
);

module.exports = router;
