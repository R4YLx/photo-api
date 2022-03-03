const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user_validation');

router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'Hi there!' } });
});

router.use('/users', auth.validateToken, require('./user_route'));
router.use('/photos', require('./photo_route'));
router.use('/albums', require('./album_route'));

router.post(
	'/register',
	userValidationRules.createRules,
	authController.register
);

router.post('/login', authController.login);

router.post('/refresh', authController.refresh);

module.exports = router;
