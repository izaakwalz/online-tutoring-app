const express = require('express');
const router = express.Router();
const { isAuthStundent } = require('../middlewares/auth');

const { signup, login, bookLesson } = require('../controllers/students-ctrl');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/booklesson').post(isAuthStundent, bookLesson);

module.exports = router;
