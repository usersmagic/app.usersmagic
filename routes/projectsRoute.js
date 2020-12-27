const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const createGetController = require('../controllers/projects/create/get');

router.get(
  '/create',
    createGetController
);

module.exports = router;
