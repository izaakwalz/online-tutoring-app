const express = require('express');
const router = express.Router();
const { isAuthAdmin } = require('../middlewares/auth');

const {
  makeMeAdmin,
  createSubject,
  updateSubject,
  deleteSubject,
  getTutor,
  getTutorById,
  deactivateTutor,
  createLesson,
  getLesson,
  getLessonById,
} = require('../controllers/admin-ctrl');

//? make tutor admin PUT.
router.route('/makemeadmin').post(isAuthAdmin, makeMeAdmin);

// @subjet route POST,
router.route('/subject').post(isAuthAdmin, createSubject);
// PUT, DELETE
router
  .route('/subject/:subjectId')
  .put(isAuthAdmin, updateSubject)
  .delete(deleteSubject);

// @tutor route GET, PUT
router.route('/tutor').get(isAuthAdmin, getTutor);
router
  .route('/tutor/tutorId')
  .get(isAuthAdmin, getTutorById)
  .put(isAuthAdmin, deactivateTutor);

// lesson
router
  .route('/lesson')
  .get(isAuthAdmin, getLesson)
  .post(isAuthAdmin, createLesson);
router.route('/lesson/:lessonId').get(isAuthAdmin, getLessonById);

module.exports = router;
