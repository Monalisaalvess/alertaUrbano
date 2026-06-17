const Report = require('../models/Report');


const getAllReports = async (req, res) => {
  try {
    const { neighborhood, category, status } = req.query;

    const filter = {};
    if (neighborhood) filter['location.neighborhood'] = neighborhood;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getHighlights = async (req, res) => {
  try {
    const mostLiked = await Report.find()
      .populate('userId', 'name avatar')
      .sort({ likes: -1 })
      .limit(5);

    const mostReposted = await Report.find()
      .populate('userId', 'name avatar')
      .sort({ reposts: -1 })
      .limit(5);

    res.json({ mostLiked, mostReposted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const pendente = await Report.countDocuments({ status: 'pendentes' });
    const em_analise = await Report.countDocuments({ status: 'analise' });
    const resolvida = await Report.countDocuments({ status: 'resolvidas' })

    const byCategory = await Report.aggregate([
      { $group: { _id: '$category', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const byNeighborhood = await Report.aggregate([
      { $group: { _id: '$location.neighborhood', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    res.json({
      total,
      byStatus: { pendentes, analise, resolvidas },
      byCategory,
      byNeighborhood,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'name avatar')
      .populate('resolvedBy', 'name');

    if (!report) {
      return res.status(404).json({ error: 'Reclamação não encontrada' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReport = async (req, res) => {
  try {

    const { title, description, category, address, neighborhood } = req.body

    if (!req.file) {
      return res.status(400).json({ error: 'Imagem é obrigatória' })
    }

    const report = await Report.create({
      title,
      description,
      category,
      location: { address, neighborhood },
      image: req.file.path,
      userId: req.user._id,
    });

    const populated = await report.populate('userId', 'name avatar');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Reclamação não encontrada' });
    }

    const alreadyLiked = report.likedBy.includes(req.user._id);

    if (alreadyLiked) {
      report.likedBy.pull(req.user._id);
      report.likes -= 1;
    } else {
      report.likedBy.push(req.user._id);
      report.likes += 1;
    }

    await report.save();

    res.json({ likes: report.likes, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const repostReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Reclamação não encontrada' });
    }

    const alreadyReposted = report.repostedBy.includes(req.user._id);

    if (alreadyReposted) {
      return res.status(400).json({ error: 'Você já republicou esta reclamação' });
    }

    report.repostedBy.push(req.user._id);
    report.reposts += 1;
    await report.save();

    res.json({ reposts: report.reposts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserReports = async (req, res) => { //tem q melhorar so n sei oq
  try {
    const reports = await Report.find({ userId: req.params.userId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllReports,
  getHighlights,
  getStats,
  getReportById,
  createReport,
  likeReport,
  repostReport,
  getUserReports,
};