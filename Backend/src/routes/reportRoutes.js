const express = require('express');
const router = express.Router();
const {
  getAllReports,
  getHighlights,
  getStats,
  getReportById,
  createReport,
  likeReport,
  repostReport,
  getUserReports,
} = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getAllReports);
router.get('/highlights', getHighlights);
router.get('/stats', getStats);
router.get('/user/:userId', getUserReports);
router.get('/:id', getReportById);

router.post('/', authMiddleware, upload.single('image'), createReport);
router.put('/:id/like', authMiddleware, likeReport);
router.put('/:id/repost', authMiddleware, repostReport);

module.exports = router;