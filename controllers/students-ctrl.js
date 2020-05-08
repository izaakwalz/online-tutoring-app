const Stundent = require('../models/Stundent-Model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Signup stundentstu
// @route   POST /api/v1/
// @access  Public
const sendToken = (tutor, req, res, next) => {
  const payload = {
    tutor: {
      id: tutor._id,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 360000,
  });
  tutor.password = undefined;
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

    // const tutors = await tutor.save();
    sendToken(tutor, req, res);
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
