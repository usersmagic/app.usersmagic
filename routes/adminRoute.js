const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const authGetController = require('../controllers/admin/auth/get');
const countriesIndexGetController = require('../controllers/admin/countries/index/get');

const countriesIndexPostController = require('../controllers/admin/countries/index/post');
const authPostController = require('../controllers/admin/auth/post');

router.get(
  '/',
    isAdmin,
    indexGetController  
);
router.get(
  '/auth',
    authGetController
);
router.get(
  '/countries',
    isAdmin,
    countriesIndexGetController
);

router.post(
  '/auth',
    authPostController
);
router.post(
  '/countries',
    isAdmin,
    countriesIndexPostController
);

module.exports = router;
