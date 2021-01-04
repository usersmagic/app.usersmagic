const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/projects/index/get');
const createIndexGetController = require('../controllers/projects/create/index/get');
const createFinishGetController = require('../controllers/projects/create/finish/get');
const detailsGetController = require('../controllers/projects/details/get');
const filtersIndexGetController = require('../controllers/projects/filters/index/get');
const filtersCreateGetController = require('../controllers/projects/filters/create/index/get');
const reportIndexGetController = require('../controllers/projects/report/index/get');

const indexPostController = require('../controllers/projects/index/post');
const createSavePostController = require('../controllers/projects/create/save/post');
const filtersIndexPostController = require('../controllers/projects/filters/index/post');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/create',
    isLoggedIn,
    createIndexGetController
);
router.get(
  '/create/finish',
    isLoggedIn,
    createFinishGetController
);
router.get(
  '/details',
    isLoggedIn,
    detailsGetController
);
router.get(
  '/filters',
    isLoggedIn,
    filtersIndexGetController
);
router.get(
  '/filters/create',
    isLoggedIn,
    filtersCreateGetController
);
router.get(
  '/report',
    isLoggedIn,
    reportIndexGetController
);

router.post(
  '/',  
    isLoggedIn,
    indexPostController
);
router.post(
  '/create/save',
    isLoggedIn,
    createSavePostController
);
router.post(
  '/filters',
    isLoggedIn,
    filtersIndexPostController
);

module.exports = router;
