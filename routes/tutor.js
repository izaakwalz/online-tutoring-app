const express = require('express');
const router = express.Router();

const { isAuthTutor } = require('../middlewares/auth');

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
router.route('/registersubject').post(isAuthTutor, registerSubject);
router.route('/registered/subject').get(isAuthTutor, getSubject);
router
  .route('/registered/:subjectId')
  .put(isAuthTutor, updateSubject)
  .delete(isAuthTutor, deleteSubject);

module.exports = router;
