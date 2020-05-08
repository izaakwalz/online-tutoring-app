const express = require('express');
const router = express.Router();

const { isAuthTutor } = require('../middlewares/auth');

const { signup, login } = require('../controllers/tutors-ctrl');

router.route('/signup').post(signup);
router.route('/login').post(login);

module.exports = router;
