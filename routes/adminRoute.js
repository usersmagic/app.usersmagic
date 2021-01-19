const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const authGetController = require('../controllers/admin/auth/get');
const companiesIndexGetController = require('../controllers/admin/companies/index/get');
const companiesDetailsGetController = require('../controllers/admin/companies/details/get');
const countriesIndexGetController = require('../controllers/admin/countries/index/get');
const targetsIndexGetController = require('../controllers/admin/targets/index/get');
const targetsDetailsGetController = require('../controllers/admin/targets/details/get');

const countriesIndexPostController = require('../controllers/admin/countries/index/post');
const authPostController = require('../controllers/admin/auth/post');
const targetsDetailsPostController = require('../controllers/admin/targets/details/post');

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
  '/companies',
    isAdmin,
    companiesIndexGetController
);
router.get(
  '/companies/details',
    isAdmin,
    companiesDetailsGetController
);
router.get(
  '/countries',
    isAdmin,
    countriesIndexGetController
);
router.get(
  '/targets',
    isAdmin,
    targetsIndexGetController
);
router.get(
  '/targets/details',
    isAdmin,
    targetsDetailsGetController
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
router.post(
  '/targets/details',
    isAdmin,
    targetsDetailsPostController
);

module.exports = router;
