const Tutor = require('../models/Tutor-Model');
const Subject = require('../models/Subject-Model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendToken = (tutor, req, res, next) => {
  const payload = {
    tutor: {
      id: tutor._id,
      email: tutor.email,
      isAdmin: tutor.admin,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 3600 * 10000,
    issuer: '@teamWalz',
  });
  // tutor.password = undefined;
  return res.status(201).json({
    success: true,
    token,
    data: { tutor },
  });
};

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const email_exist = await Tutor.findOne({ email });
  try {
    //  @check if tutor is registerd
    if (email_exist)
      return res.status(400).json({
        success: false,
        error: 'Tutor already exists, please try to login',
      });

    // @hash password with bcryptjs
    const salt = await bcrypt.genSalt(12);
    const hash_password = await bcrypt.hash(password, salt);

    const tutor = await Tutor.create({
      firstname,
      lastname,
      email,
      password: hash_password,
    });
    tutor;
    return res.status(200).json({ success: true, data: tutor });
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

    const isValidPassword = await bcrypt.compare(password, tutor.password);

    if (!isValidPassword) {
      return res.status(404).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    sendToken(tutor, req, res);

    // res.header('x-auth-token', token).send(token);
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
