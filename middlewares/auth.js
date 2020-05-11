const jwt = require('jsonwebtoken');
const Tutor = require('../models/Tutor-Model');

exports.isAuthAdmin = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ error: 'No access token, permission not granted!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.data.isAdmin == true) {
      req.team = decoded.data;
      next();
    } else {
      res
        .status(400)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Token not valid' });
  }
};

exports.isAuthTutor = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ error: 'No access token, permission not granted!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.data.role == 'tutor' && decoded.data.isActive == true) {
      req.tutor = decoded.data;
      next();
    } else {
      res
        .status(400)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Token not valid' });
  }
};

exports.isAuthStundent = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ error: 'No access token, permission not granted!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.data.role == 'stundent') {
      req.stundent = decoded.data;
      next();
    } else {
      res
        .status(400)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Token not valid' });
  }
};

exports.isAuthDeactivated = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ error: 'No access token, permission not granted!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = decoded.data.isActive;
    console.log(user);
    if (user == false) {
      res.status(401).json({
        error:
          'You have been deactivated 🤨🤨 by the admin, please contact the admin',
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ Error: 'Server Error' });
    process.exit(1);
  }
};
