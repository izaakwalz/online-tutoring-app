const Tutor = require('../models/Tutor-Model');
const Lesson = require('../models/Lesson-Model');
const Subject = require('../models/Subject-Model');

// @desc    make a tutor an admin by their email
// @route   Put /api/v1/admin/maketutoradmin
// @access  Private
exports.makeMeAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    //  @check if email is valid
    const is_email = await Tutor.findOne({ email });

    if (is_email) {
      await Tutor.updateOne({ email }, { $set: { admin: true } });
      res.status(201).json({
        success: true,
        message: `Tutor with the '${email}' is now an admin😀`,
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Invalid ${email} 😬, please try again!`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Post create
// @route   POST /api/v1/admin/subject
// @access  Private
exports.createSubject = async (req, res) => {
  const { name, category, dataUrl } = req.body;

  try {
    //   check if subject exist
    const is_subject = await Subject.findOne({ name, category });

    if (is_subject) {
      return res.status(400).json({
        message: `The subject name '${name}' and category  already exist, please enter another subject name`,
      });
    } else {
      const subject = await Subject.create({ name, category, dataUrl });
      subject.__v = undefined;
      return res.status(201).json({
        success: true,
        data: subject,
      });
    }
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

// @desc    Put update subject
// @route   POST /api/v1/admin/subject/:subjctId
// @access  Private
exports.updateSubject = async (req, res) => {
  const { name, category, dataUrl } = req.body;
  try {
    const subject = await Subject.findById({ _id: req.params.subjctId });

    if (subject) {
      let subjectUrl = await Subject.find({ _id: req.params.subjctId }).select({
        dataUrl: 1,
      });
      if (subjectUrl.dataUrl.includes(dataUrl))
        return res.status(401).json({ error: 'Data url already exists' });
      await subjectUrl.dataUrl.push(dataUrl);
      await Subject.findOneAndUpdate(
        { _id: req.params.subjctId },
        {
          $set: {
            name,
            category,
            dataUrl: subjectUrl.dataUrl,
          },
        }
      );
      res.status(201).json({
        success: true,
        message: 'Subject successfully updated🤗',
        data: subject,
      });
    } else {
      res.status(400).json({ success: false, error: 'subject id not valid' });
    }
  } catch (err) {
    console.error(err), res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Delete subject in a category by id
// @route   DELETE /api/v1/admin/subject/:subjct:id
// @access  Private
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.subjctId);

    if (subject) {
      await subject.remove();

      return res.status(200).json({
        success: true,
        message: 'Subject successfully deleted!',
        data: {},
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'No subject found, please enter a valid subject',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get all tutors
// @route   GET /api/v1/admin/tutor
// @access  Private
exports.getTutor = async (req, res) => {
  try {
    const tutors = await Tutor.find().select({ password: 0, __v: 0 });

    return res.status(200).json({
      success: true,
      count: tutors.length,
      data: tutors,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get one tutor by id
// @route   GET /api/v1/admin/tutor/:tutorId
// @access  Private
exports.getTutorById = async (req, res) => {
  try {
    if (tutor) {
      const tutor = await Tutor.findById(req.params.tutorId).select({
        password: 0,
        __v: 0,
      });
      return res.status(200).json({
        success: true,
        count: tutor.length,
        data: tutor,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: 'no data found for that id' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// ?desc    Delete subject in a category by id
// ?route   DELETE /api/v1/admin/subject/:subjct:id
// ?@access  Private
exports.deactivateTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findByIdAndUpdate(req.params.tutorId, {
      active: false,
    });
    res.status(201).json({
      status: true,
      message: `Tutor with the email ID '${tutor.email}' has been deactivated`,
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    add a lesson
// @route   GET /api/v1/admin/lesson/:subjectId
// @access  Private
exports.createLesson = async (req, res) => {
  const { tutorId, title, timeStart, timeEnd, dataUrl } = req.body;
  try {
    //? validate start time and end time
    if (
      new Date(timeStart).getTime() === new Date(timeEnd).getTime() ||
      timeStart > timeEnd
    ) {
      return res.status(400).json({
        success: false,
        error: 'time start must be less than time end and must not be qual',
      });
    }
    // ? get subject by category and name and pouplate
    const is_subject = await Subject.findById(req.params.id).select({ __v: 0 });

    //? check if tutor is valid
    const is_tutor = await Tutor.findOne({ email: tutorId });
    if (!is_tutor)
      return res.status(400).json({
        error: 'Invalid Tutor Id, please check the id and try again ',
      });

    if (is_subject && is_tutor) {
      const lesson = await Lesson.create({
        title,
        tutorId,
        subject: is_subject.name,
        category: is_subject.category,
        dataUrl,
        timeStart,
        timeEnd,
      });
      res.status(201).json({ status: true, data: lesson });
    } else {
      res.status(400).json({
        success: false,
        error:
          'To create a lesson enter a valid tutor Id and a valid subject Id',
      });
    }
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

// @desc    Get all lesson
// @route   GET /api/v1/admin/lesson
// @access  Private
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.find().select({ __v: 0 });

    return res.status(200).json({
      success: true,
      count: lesson.length,
      data: lesson,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get one tutor by id
// @route   GET /api/v1/admin/lesson
// @access  Private
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).select({
      __v: 0,
    });
    if (lesson) {
      return res.status(200).json({
        success: true,
        count: lesson.length,
        data: lesson,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: 'no data found for that id' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
