const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/settings/index/get');

const indexPostController = require('../controllers/settings/index/post');
const memberInvitePostController = require('../controllers/settings/member/invite/post');
const teamAddPostController = require('../controllers/settings/team/add/post');
const teamCreatePostController = require('../controllers/settings/team/create/post');
const teamDeletePostController = require('../controllers/settings/team/delete/post');
const teamRemovePostController = require('../controllers/settings/team/remove/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    indexGetController
);

router.post(
  '/',
    isLoggedIn,
    isComplete,
    indexPostController
);
router.post(
  '/member/invite',
    isLoggedIn,
    isComplete,
    memberInvitePostController
);
router.post(
  '/team/add',
    isLoggedIn,
    isComplete,
    teamAddPostController
);
router.post(
  '/team/create',
    isLoggedIn,
    isComplete,
    teamCreatePostController
);
router.post(
  '/team/delete',
    isLoggedIn,
    isComplete,
    teamDeletePostController
);
router.post(
  '/team/remove',
    isLoggedIn,
    isComplete,
    teamRemovePostController
);

module.exports = router;
