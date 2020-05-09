const express = require('express');
const router = express.Router();

const { isAuthTutor } = require('../middlewares/auth');

const {
  signup,
  login,
  registerSubject,
  getSubject,
  updateSubject,
} = require('../controllers/tutors-ctrl');

router.route('/signup').post(signup);
router.route('/login').post(login);
router
  .route('/register')
  .get(isAuthTutor, getSubject)
  .post(isAuthTutor, registerSubject);
router.route('/register/:subjectId').put(isAuthTutor, updateSubject);

module.exports = router;
