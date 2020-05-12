const express = require('express');
const router = express.Router();
const { isAuthAdmin, isAuthDeactivated } = require('../middlewares/auth');

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
  deleteLesson,
  updateLesson,
  delete_subject_by_category,
} = require('../controllers/admin-ctrl');

//? make tutor admin PUT.
router.route('/makemeadmin').post(isAuthAdmin, isAuthDeactivated, makeMeAdmin);

// @subjet route POST,
router
  .route('/subject')
  .post(isAuthAdmin, isAuthDeactivated, createSubject)
  .delete(isAuthAdmin, isAuthDeactivated, delete_subject_by_category);
// PUT, DELETE
router
  .route('/subject/:subjectId')
  .put(isAuthAdmin, isAuthDeactivated, updateSubject)
  .delete(isAuthAdmin, isAuthDeactivated, deleteSubject);

// @tutor route GET, PUT
router.route('/tutor').get(isAuthAdmin, isAuthDeactivated, getTutor);
router
  .route('/tutor/tutorId')
  .get(isAuthAdmin, isAuthDeactivated, getTutorById)
  .post(isAuthAdmin, isAuthDeactivated, deactivateTutor);

// lesson
router
  .route('/lesson')
  .get(isAuthAdmin, isAuthDeactivated, getLesson)
  .post(isAuthAdmin, isAuthDeactivated, createLesson);
router
  .route('/lesson/:lessonId')
  .get(isAuthAdmin, isAuthDeactivated, getLessonById)
  .put(isAuthAdmin, isAuthDeactivated, updateLesson)
  .delete(isAuthAdmin, isAuthDeactivated, deleteLesson);

module.exports = router;
