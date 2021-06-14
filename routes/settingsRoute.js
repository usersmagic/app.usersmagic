const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/settings/index/get');

const indexPostController = require('../controllers/settings/index/post');
const teamAddPostController = require('../controllers/settings/team/add/post');
const teamCreatePostController = require('../controllers/settings/team/create/post');
const teamDeletePostController = require('../controllers/settings/team/delete/post');
const teamRemovePostController = require('../controllers/settings/team/remove/post');

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
router.post(
  '/',
    isLoggedIn,
    indexPostController
);
router.post(
  '/team/add',
    isLoggedIn,
    teamAddPostController
);
router.post(
  '/team/create',
    isLoggedIn,
    teamCreatePostController
);
router.post(
  '/team/delete',
    isLoggedIn,
    teamDeletePostController
);
router.post(
  '/team/remove',
    isLoggedIn,
    teamRemovePostController
);

module.exports = router;
