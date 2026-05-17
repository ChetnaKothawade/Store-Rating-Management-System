const express = require('express');
const router = express.Router();
const { getAllStores, getStoreById } = require('../controllers/storeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getAllStores);
router.get('/:id', getStoreById);

module.exports = router;
