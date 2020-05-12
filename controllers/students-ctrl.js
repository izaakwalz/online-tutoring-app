const Stundent = require('../models/Stundent-Model');
const Lesson = require('../models/Lesson-Model');
const Tutor = require('../models/Tutor-Model');
const Subject = require('../models/Subject-Model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc generate token for stundent on login
const sendToken = (stundent, req, res, next) => {
  const payload = {
    data: {
      id: stundent._id,
      name: stundent.name,
      email: stundent.email,
      role: 'stundent',
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 3600 * 10000,
    issuer: '@teamWalz',
  });
  stundent.password = undefined;
  return res.status(201).json({
    success: true,
    data: {
      id: stundent.id,
      email: stundent.email,
      active: stundent.active,
    },
    token,
  });
};

exports.signup = async (req, res) => {
  const { name, category, email, password } = req.body;

  const email_exist = await Stundent.findOne({ email });
  try {
    //  @check if stundent is registerd
    if (email_exist)
      return res.status(400).json({
        success: false,
        error: 'Stundent already exists, please try to login',
      });

    // password check length
    if (password.length < 6) {
      res
        .status(400)
        .json({ warning: 'Password should be at least 6 characters ' });
    } else {
      // @hash password with bcryptjs
      const salt = await bcrypt.genSalt(12);
      const hash_password = await bcrypt.hash(password, salt);

      const stundent = await Stundent.create({
        name,
        category,
        email,
        password: hash_password,
      });
      return res.status(200).json({
        success: true,
        data: {
          id: stundent.id,
          name: stundent.name,
          email: stundent.email,
          active: stundent.active,
        },
      });
      // ---> const stundents = await stundent.save();  <-----
    }
  } catch (err) {
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

// @desc    tutor login route
// @route   Put /api/v1/tutor/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'please enter all fields' });
  }

  try {
    let stundent = await Stundent.findOne({ email });

    if (!stundent) {
      return res.status(404).json({
        success: false,
        error: 'Email or password is not correct',
      });
    }
    //   check if password is correct
    const isValidPassword = await bcrypt.compare(password, stundent.password);

    if (!isValidPassword) {
      return res.status(404).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    //  -----> token will be placed in res.header('x-auth-token', token).send(token); <------
    sendToken(stundent, req, res);
  } catch (err) {
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

// @desc    stundent book lesson route
// @route   post /api/v1/stundent/booklesson
// @access  private
exports.bookLesson = async (req, res) => {
  const { title, tutor, subject, category } = req.body;

  try {
    const $user = req.stundent.id;

    const stundents = await Stundent.findById($user).select({ category: 1 });
    if (stundents.category != category) {
      return res
        .status(400)
        .json({ error: "you can't book a lesson outside your category " });
    }

    const is_lesson = await Lesson.findOne({ title, subject, tutorId: tutor });
    if (is_lesson) {
      const user = req.stundent.id;

      let stundent = await Stundent.findOne({ _id: user });

      if (stundent.lessons.includes(is_lesson._id)) {
        return res
          .status(400)
          .json({ error: 'You have already booked this lesson' });
      } else {
        await stundent.lessons.push(is_lesson._id);

        stundent = await Stundent.findByIdAndUpdate(
          { _id: user },
          {
            $push: { lessons: is_lesson._id },
          },
          { new: true }
        );
        return res.status(400).json({ data: stundent });
      }
    } else {
      res.status(400).json({
        error: `No lesson found with the name '${title}' and category '${subject}', Please select a valid subject from the subject list`,
      });
    }
  } catch (err) {
    res.status(400).json({ error: 'Server Error' });
  }
};

exports.getTutorsBySubjectCategory = async (req, res) => {
  const { subject, category } = req.body;

  if (!subject || !category) {
    return res.status(400).json({ warning: 'please enter all fields' });
  }

  try {
    const subjectCategory = await Subject.find({ name: subject, category });

    if (subjectCategory) {
      let subjects = await Subject.find({ name: subject, category }).select({
        _id: 1,
      });
      subjects = subjects[0]._id;
      const tutorSubject = await Tutor.find().select({ subjects: 1 });

      let tutors = [];
      tutorSubject.forEach((subject) => {
        if (subject.subjects.includes(subjects)) {
          tutors.push(subject._id);
        }
      });

      let count = [];

      for (let i = 0; i < tutors.length; i++) {
        const tutor = await Tutor.find({ _id: tutors[i] });
        count.push(tutor[0]);
      }

      res.status(200).json({
        success: true,
        count: count.length,
        data: count,
      });
    } else {
      res.status(400).json({
        error:
          'Subject not found. Please Enusure that you entered the right category and subject',
      });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Server Error' });
  }
};
