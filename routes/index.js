const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userValidationRules = require('../validation/user_validation');
const authController = require('../controllers/auth_controller');

router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'Hi there!' } });
});

// register new user
router.post(
	'/register',
	userValidationRules.createRules,
	authController.register
);

router.post('/login', authController.login);

// router.use('/users', auth.validateToken, require('./user_route'));
router.use('/photos', require('./photo_route'));
router.use('/albums', require('./album_route'));

module.exports = router;
