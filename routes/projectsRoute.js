const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/projects/index/get');
const createIndexGetController = require('../controllers/projects/create/index/get');
const createFinishGetController = require('../controllers/projects/create/finish/get');
const detailsGetController = require('../controllers/projects/details/get');
const reportIndexGetController = require('../controllers/projects/report/index/get');

const indexPostController = require('../controllers/projects/index/post');
const createSavePostController = require('../controllers/projects/create/save/post');

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

module.exports = router;
