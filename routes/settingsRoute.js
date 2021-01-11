const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/settings/get');

const indexPostController = require('../controllers/settings/post');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);

router.post(
  '/',
    isLoggedIn,
    indexPostController
);

module.exports = router;
