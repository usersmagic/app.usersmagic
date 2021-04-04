const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isAccountComplete = require('../middleware/isAccountComplete');

const filterGetController = require('../controllers/templates/filter/get');
const indexGetController = require('../controllers/templates/index/get');
const updateGetController = require('../controllers/templates/update/get');

router.get(
  '/',
    isLoggedIn,
    isAccountComplete,
    indexGetController
);
router.get(
  '/filter',
    isLoggedIn,
    isAccountComplete,
    filterGetController
);
router.get(
  '/update',
    isLoggedIn,
    isAccountComplete,
    updateGetController
);

module.exports = router;
