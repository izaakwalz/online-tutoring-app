const Subject = require('../models/Subject-Model');
const Tutor = require('../models/Tutor-Model');
const Lesson = require('../models/Lesson-Model');
const factory = require('./handlers');

exports.get_subject = factory.get_category(Subject);
exports.get_subject_id = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).select({
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

// @desc    Add subject
// @route   POST /api/v1/admin/subject
// @access  Private
exports.add_subject = async (req, res) => {
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
      res.json({ lesson });
    } else {
      res.status(400).json({ error: 'invalid credentials' });
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
// exports.add_subject = async (req, res) => {
//   try {
//     const lesson = await Lesson.create(req.body);
//     res.json({ lesson });
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.add_subject = async (req, res) => {
//   try {
//     const { name, category, data_url } = req.body;

//     const is_subject = await Subject.find({ name, category });

//     if (is_subject)
//       return res.status(400).json({
//         message: `The subject name "${name}" and category  already exist, please enter another subject name`,
//       });

//     const subject = await Subject.create(req.body);

//     return res.status(201).json({
//       success: true,
//       data: subject,
//     });
//   } catch (err) {
//     console.log(err);
//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map((val) => val.message);

//       return res.status(400).json({
//         success: false,
//         error: messages,
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         error: 'Server Error',
//       });
//     }
//   }
// };

// @desc    update subject in a category by id
// @route   PUT /api/v1/admin/subject/:subId
// @access  Private
exports.update_subject = async (req, res) => {
  try {
    const body = req.body;
    let subject;

    subject = await Subject.findOneAndUpdate(
      { _id: req.params.subId },
      {
        $set: { body },
        $push: { material: req.body.material },
      },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'No subject found',
      });
    }
    return res.status(200).json({
      success: true,
      data: { subject },
    });
  } catch (err) {
    console.log(err);
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

// @desc    Delete subject in a category by id
// @route   DELETE /api/v1/admin/subject/:id
// @access  Private
exports.delete_subject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'No subject found',
      });
    }

    await subject.remove();

    return res.status(200).json({
      success: true,
      data: {
        id: subject._id,
        name: subject.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete subject by category
// @route   DELETE /api/v1/admin/subject/category
// @access  Private
exports.delete_subject_by_category = async (req, res) => {
  try {
    const categories = Subject.deleteMany(
      { category: req.body.category },
      function (err) {
        console.log(err);
      }
    );

    const data = {
      count: categories.deletedCount,
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.getTutor = async (req, res) => {
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

// exports.deactivateTutor = async (req, res) => {
//   const { id } = req.params;
//   try {
//     //  @check if email is valid
//     const is_email = await Tutor.findOne({ id });

//     if (is_email) {
//       await Tutor.updateOne({ id }, { $set: { active: false } });
//       res.status(201).json({
//         success: true,
//         message: `Tutor with the email "${id.email}" has been deactivated`,
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: `The id ${id._id} is not valid, please try again!`,
//         data: is_email,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: 'Server Error' });
//   }
// };

// exports.deactivateTutor = async (req, res) => {
//   try {
//     await Tutor.findByIdAndUpdate(req.params.id, { active: false });

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.deactivateTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findByIdAndUpdate(req.params.id, {
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
