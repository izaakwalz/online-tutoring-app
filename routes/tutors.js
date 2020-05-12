const express = require('express');
const router = express.Router();

const { isAuthTutor, isAuthDeactivated } = require('../middlewares/auth');

const {
  signup,
  login,
  registerSubject,
  getSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/tutors-ctrl');

router.route('/signup').post(signup);
router.route('/login').post(login);
router
  .route('/registersubject')
  .post(isAuthTutor, isAuthDeactivated, registerSubject);
router
  .route('/registered/subject')
  .get(isAuthTutor, isAuthDeactivated, getSubject);
router
  .route('/registered/:subjectId')
  .put(isAuthTutor, isAuthDeactivated, updateSubject)
  .delete(isAuthTutor, isAuthDeactivated, deleteSubject);

module.exports = router;
