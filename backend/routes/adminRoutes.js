const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAllUsers,
  getUserById,
  addUser,
  getAllStores,
  addStore,
  getStoreRatings,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateUser } = require('../middleware/validateMiddleware');

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', validateUser, addUser);
router.get('/stores', getAllStores);
router.post('/stores', addStore);
router.get('/stores/:id/ratings', getStoreRatings);

module.exports = router;
