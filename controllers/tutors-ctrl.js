const Tutor = require('../models/Tutor-Model');
const Subject = require('../models/Subject-Model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendToken = (tutor, req, res, next) => {
  const payload = {
    tutor: {
      id: tutor._id,
      name: tutor.name,
      email: tutor.email,
      isActive: tutor.active,
      isAdmin: tutor.admin,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 3600 * 10000,
    issuer: '@teamWalz',
  });
  tutor.password = undefined;
  return res.status(201).json({
    success: true,
    data: {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      active: tutor.active,
    },
    token,
  });
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const email_exist = await Tutor.findOne({ email });
  try {
    //  @ check if tutor is registerd
    if (email_exist) {
      return res.status(400).json({
        success: false,
        error: 'Tutor already exists, please try to login',
      });
    }
    // @ hash password with bcryptjs
    const salt = await bcrypt.genSalt(12);
    const hash_password = await bcrypt.hash(password, salt);

    const tutor = await Tutor.create({
      name,
      email,
      password: hash_password,
    });
    tutor;
    return res.status(200).json({
      success: true,
      data: {
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
        active: tutor.active,
      },
    });
  } catch (err) {
    console.log(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      // check fo existing user
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let tutor = await Tutor.findOne({ email });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        error: 'Email or password is not correct',
      });
    }
    //   check if password is correct
    const isValidPassword = await bcrypt.compare(password, tutor.password);

    if (!isValidPassword) {
      return res.status(404).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    // token will be placed in res.header('x-auth-token', token).send(token);
    sendToken(tutor, req, res);
  } catch (err) {
    console.log(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      // check fo existing user
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

exports.registerSubject = async (req, res) => {
  const { name, category } = req.body;

  try {
    if (!name || !category) {
      return res
        .status(400)
        .json({ error: 'please enter all fields to register a subject' });
    }

    const is_subject = await Subject.findOne({ name, category });

    if (is_subject) {
      const user = req.tutor.id;
      let tutor = await Tutor.findOne({ _id: user }).select({ subjects: 1 });

      if (tutor.subjects.includes(is_subject._id)) {
        return res
          .status(400)
          .json({ success: false, error: 'subject already registered' });
      } else {
        await tutor.subjects.push(is_subject._id);

        tutor = await Tutor.findOneAndUpdate(
          { _id: user },
          {
            $push: { subjects: is_subject._id },
          },
          { new: true }
        );
        return res.status(200).json({ data: tutor.subjects });
      }
    } else {
      res.status(400).json({
        error: `No subject found with the name '${name}' and category '${category}', Please select a valid subject from the subject list`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server Error' });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const user = req.tutor.id;
    const tutor = await Tutor.findOne({ _id: user }).select({
      email: 1,
      subjects: 1,
    });

    if (!tutor || tutor.length == 0) {
      return res
        .status(400)
        .json({ message: 'There is no subject for this user' });
    }

    res.status(200).json({
      success: true,
      tutor,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ Error: 'Server Error' });
  }
}; // @desc    Put update subject // @route   POST /api/v1/admin/subject/:subjctId // @access  Private

// @desc    Put update subject
// @route   POST /api/v1/admin/subject/:subjctId
// @access  Private
exports.updateSubject = async (req, res) => {
  const { name, category, dataUrl } = req.body;
  try {
    const subject = await Subject.findById({ _id: req.params.subjectId });

    if (subject) {
      await Subject.findOneAndUpdate(
        { _id: req.params.subjectId },
        {
          $set: {
            name,
            category,
            dataUrl,
          },
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: 'Subject successfully updated',
      });
    } else {
      res.status(400).json({ success: false, error: 'subject id not valid' });
    }
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      // check fo existing user
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

exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);

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
