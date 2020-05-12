const express = require('express');
const router = express.Router();
const { isAppAuth } = require('../middlewares/auth');

const {
  getSubjectByID,
  getSubject,
  getCategory,
  searchSubjects,
  searchTutors,
} = require('../controllers/general-ctrl');

router.route('/subject/:subjectId').get(isAppAuth, getSubjectByID);
router.route('/subject').get(isAppAuth, getSubject);
router.route('/getcategory').post(isAppAuth, getCategory);
router.route('/searchsubject').post(isAppAuth, searchSubjects);
router.route('/searchtutor').post(isAppAuth, searchTutors);

module.exports = router;
