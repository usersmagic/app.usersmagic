const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isAccountComplete = require('../middleware/isAccountComplete');

const indexGetController = require('../controllers/projects/index/get');
const createIndexGetController = require('../controllers/projects/create/index/get');
const createFinishGetController = require('../controllers/projects/create/finish/get');
const detailsGetController = require('../controllers/projects/details/get');
const filtersIndexGetController = require('../controllers/projects/filters/index/get');
const filtersCreateGetController = require('../controllers/projects/filters/create/index/get');
const filtersCreateFinishGetController = require('../controllers/projects/filters/create/finish/get');
const filtersSubmitPostController = require('../controllers/projects/filters/submit/post');
const reportIndexGetController = require('../controllers/projects/report/index/get');
const editIndexGetController = require('../controllers/projects/edit/index/get');
const editUndoGetController = require('../controllers/projects/edit/undo/get');
const editCheckForChangesGetController = require('../controllers/projects/edit/checkForChanges/get');
const editUpdateGetController = require('../controllers/projects/edit/update/get');

const indexPostController = require('../controllers/projects/index/post');
const createSavePostController = require('../controllers/projects/create/save/post'); //use this route both for projects/create and projects/edit autosave
const filtersIndexPostController = require('../controllers/projects/filters/index/post');
const filtersCreateSavePostController = require('../controllers/projects/filters/create/save/post');
const editSavePostController = require('../controllers/projects/edit/save/post');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/create',
    isLoggedIn,
    isAccountComplete,
    createIndexGetController
);
router.get(
  '/create/finish',
    isLoggedIn,
    isAccountComplete,
    createFinishGetController
);
router.get(
  '/details',
    isLoggedIn,
    isAccountComplete,
    detailsGetController
);
router.get(
  '/filters',
    isLoggedIn,
    isAccountComplete,
    filtersIndexGetController
);
router.get(
  '/filters/create',
    isLoggedIn,
    isAccountComplete,
    filtersCreateGetController
);
router.get(
  '/filters/create/finish',
    isLoggedIn,
    isAccountComplete,
    filtersCreateFinishGetController
);
router.get(
  '/report',
    isLoggedIn,
    isAccountComplete,
    reportIndexGetController
);

router.post(
  '/',
    isLoggedIn,
    isAccountComplete,
    indexPostController
);
router.post(
  '/create/save',
    isLoggedIn,
    isAccountComplete,
    createSavePostController
);
router.post(
  '/filters',
    isLoggedIn,
    isAccountComplete,
    filtersIndexPostController
);
router.post(
  '/filters/create/save',
    isLoggedIn,
    isAccountComplete,
    filtersCreateSavePostController
);
router.post(
  '/filters/submit',
    isLoggedIn,
    isAccountComplete,
    filtersSubmitPostController
);
router.get(
  '/edit',
  isLoggedIn,
  isAccountComplete,
  editIndexGetController
);
router.get(
  '/edit/undo',
  isLoggedIn,
  isAccountComplete,
  editUndoGetController
);
router.post(
  '/edit/save',
    isLoggedIn,
    isAccountComplete,
    editSavePostController
);
router.get(
  '/edit/checkForChanges',
  isLoggedIn,
  isAccountComplete,
  editCheckForChangesGetController
);
router.get(
  '/edit/update',
  isLoggedIn,
  isAccountComplete,
  editUpdateGetController
);

module.exports = router;
