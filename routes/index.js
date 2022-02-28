const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const registerController = require('../controllers/register_controller');
const userValidationRules = require('../validation/user_validation');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' } });
});

router.use('/photos', require('./photos_route'));
router.use('/albums', require('./albums_route'));
router.use('/profile', auth.basic, require('./profile_route'));

router.post(
	'/register',
	userValidationRules.createRules,
	registerController.register
);

module.exports = router;
