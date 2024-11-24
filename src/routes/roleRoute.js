const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController.js');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/roles', authenticate, checkPermission("perm_read_review"), roleController.getRoles);

module.exports = router;