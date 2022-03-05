const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userValidationRules = require('../validation/user_validation');
const authController = require('../controllers/auth_controller');

router.get('/', (req, res, next) => {
	res.send({
		success: true,
		data: { msg: 'Hi there, this app is upp and running!' },
	});
});

// register new user
router.post(
	'/register',
	userValidationRules.createRules,
	authController.register
);

router.post('/login', authController.login);

// Issue new access token
router.post('/refresh', authController.refresh);

router.use(auth.validateToken);
router.use('/photos', require('./photo_route'));
router.use('/albums', require('./album_route'));

module.exports = router;
