const Subject = require('../models/Subject-Model');
const Tutor = require('../models/Tutor-Model');

exports.getSubjectByID = async (req, res) => {
  const { subjectId } = req.params;
  try {
    if (subjectId.length < 24) {
      return res.status(400).json({ error: 'please enter a subject id' });
    }
    const subject = await Subject.findOne({ _id: subjectId }).select({
      __v: 0,
    });

    if (subject) {
      return res.status(200).json({
        success: true,
        data: subject,
      });
    } else {
      return res.status(400).json({ error: 'please enter a valid subject id' });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Server Error' });
  }
};

exports.getSubject = async (req, res) => {
  const { category } = req.body;

  try {
    const categories = ['primary', 'sss', 'jss'];
    if (categories.includes(category)) {
      const subject = await Subject.find({ category });
      res.status(200).json({
        count: subject.length,
        data: subject,
      });
    } else {
      res.status(400).json({
        error: `Please enter a valid category from the option: ${categories}. `,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const subject = await Subject.find().select({ __v: 0 });
    if (subject) {
      res.status(200).json({
        count: subject.length,
        data: subject,
      });
    } else {
      res.status(400).json({
        error: 'no data found.....',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.searchSubjects = async (req, res) => {
  try {
    const { subject } = req.body;
    const subjects = await Subject.find({
      $text: { $search: subject },
    })
      .select({ __v: 0 })
      .exec();

    res.status(200).json({ count: subjects.length, data: subjects });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.searchTutors = async (req, res) => {
  const { tutor } = req.body;
  try {
    const tutors = await Tutor.find({ $text: { $search: tutor } })
      .sort({ name: 1 })
      .select({ __v: 0, password: 0 })
      .exec();
    res.status(200).json({ count: tutors.length, data: tutors });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
