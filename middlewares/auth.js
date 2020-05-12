const jwt = require('jsonwebtoken');

exports.isAuthAdmin = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.data.isAdmin == true) {
      req.team = decoded.data;
      next();
    } else {
      res
        .status(401)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.isAuthTutor = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.data.role == 'tutor' && decoded.data.isActive == true) {
      req.tutor = decoded.data;
      next();
    } else {
      res
        .status(401)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.isAuthStundent = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.data.role == 'stundent') {
      req.stundent = decoded.data;
      next();
    } else {
      res
        .status(401)
        .json({ error: 'You are not authorized to view this route' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.isAuthDeactivated = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token)
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = decoded.data.isActive;
    if (user == false) {
      res.status(401).json({
        error:
          'You have been deactivated 🤨🤨 by the admin, please contact the admin',
      });
    }
    next();
  } catch (err) {
    res.status(401).json({ Error: 'Server Error' });
    process.exit(1);
  }
};

exports.isAppAuth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.data) {
      req.user = decoded.data;
      next();
    } else {
      res.status(401).json({ error: 'Please Login to proceed' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
