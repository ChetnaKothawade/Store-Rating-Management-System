const express = require('express');
const router = express.Router();
const {
  submitRating,
  updateRating,
  getMyRating,
  getStoreRatings,
  getOwnerDashboard,
} = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateRating } = require('../middleware/validateMiddleware');

router.use(authMiddleware);

router.get('/owner-dashboard', roleMiddleware('owner'), getOwnerDashboard);
router.get('/store/:storeId', roleMiddleware('owner'), getStoreRatings);
router.get('/my/:storeId', roleMiddleware('user'), getMyRating);
router.post('/', roleMiddleware('user'), validateRating, submitRating);
router.put('/:id', roleMiddleware('user'), validateRating, updateRating);

module.exports = router;
