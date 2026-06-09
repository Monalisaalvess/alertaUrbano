const Report = require('../models/Report');
const User = require('../models/User');

const getAllReports = async (req, res) => {
  try {
    const { neighborhood, category, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (neighborhood) filter['location.neighborhood'] = neighborhood;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('userId', 'name email avatar')
        .populate('resolvedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(filter),
    ]);

    res.json({
      reports,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    const validStatus = ['pendente', 'em_analise', 'resolvida', 'duplicada'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Reclamação não encontrada' });
    }

    report.status = status;
    report.adminComment = adminComment || report.adminComment;

    if (status === 'resolvida') {
      report.resolvedBy = req.user._id;
    }

    await report.save();

    const updated = await Report.findById(report._id)
      .populate('userId', 'name email avatar')
      .populate('resolvedBy', 'name');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDetailedStats = async (req, res) => {
  try {
    const [
      total,
      byStatus,
      byCategory,
      byNeighborhood,
      recentReports,
      totalUsers,
    ] = await Promise.all([
      Report.countDocuments(),
      Report.aggregate([
        { $group: { _id: '$status', total: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Report.aggregate([
        { $group: { _id: '$category', total: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Report.aggregate([
        { $group: { _id: '$location.neighborhood', total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]),
      Report.find()
        .populate('userId', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(5),
      User.countDocuments({ role: 'user' }),
    ]);

    res.json({
      total,
      totalUsers,
      byStatus,
      byCategory,
      byNeighborhood,
      recentReports,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ role: 'user' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments({ role: 'user' }),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Reclamação não encontrada' });
    }

    if (report.image){
      const publicId = report.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await report.deleteOne();
    res.json({ message: 'Reclamação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllReports,
  updateReportStatus,
  getDetailedStats,
  getAllUsers,
  deleteReport,
};