const express = require('express');
const router = express.Router();
const {
  getAllReports,
  updateReportStatus,
  getDetailedStats,
  getAllUsers,
  deleteReport,
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.use(authMiddleware, adminMiddleware);

router.get('/reports', getAllReports);
router.put('/reports/:id/status', updateReportStatus);
router.delete('/reports/:id', deleteReport);
router.get('/stats', getDetailedStats);
router.get('/users', getAllUsers);

module.exports = router;