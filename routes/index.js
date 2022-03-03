const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const registerController = require('../controllers/register_controller');
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
	registerController.register
);

router.post('/login', registerController.login);

router.post('/refresh', registerController.refresh);

module.exports = router;
