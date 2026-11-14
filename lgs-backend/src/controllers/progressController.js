const Progress = require('../models/Progress');

exports.getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id });
    }
    const studied = {};
    if (progress.studied) {
      for (const [k, v] of progress.studied) {
        studied[k] = v;
      }
    }
    res.json({
      career: progress.career,
      uni: progress.uni,
      studied,
      demo: progress.demo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { career, uni, studied, demo } = req.body;
    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = new Progress({ user: req.user._id });
    }
    if (career !== undefined) progress.career = career;
    if (uni !== undefined) progress.uni = uni;
    if (demo !== undefined) progress.demo = demo;
    if (studied && typeof studied === 'object') {
      progress.studied = new Map(Object.entries(studied));
    }
    await progress.save();

    const studiedObj = {};
    if (progress.studied) {
      for (const [k, v] of progress.studied) {
        studiedObj[k] = v;
      }
    }
    res.json({
      career: progress.career,
      uni: progress.uni,
      studied: studiedObj,
      demo: progress.demo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};