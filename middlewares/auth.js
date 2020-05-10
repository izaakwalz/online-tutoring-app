const jwt = require('jsonwebtoken');

exports.isAuthAdmin = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ error: 'No access tooken, permission not granted!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.tutor.isAdmin == true) {
      req.team = decoded;
      next();
    } else {
      res
        .status(400)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: 'Token not valid' });
  }
};

exports.isAuthTutor = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ error: 'No access tooken, permission not granted!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.tutor.isAdmin == false ||
      decoded.tutor.isAdmin == true ||
      decoded.tutor.isActive == true
    ) {
      req.tutor = decoded.tutor;
      next();
    } else {
      res
        .status(400)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: 'Token not valid' });
  }
};

exports.isAuthStundent = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ error: 'No access tooken, permission not granted!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: 'You are not authorized to view this route' });
  }
};
