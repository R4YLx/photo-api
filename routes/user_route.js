const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user_validation');

/* Get all resources */
router.get('/', userController.getUsers);

/* Get a specific resource */
router.get('/:userId', userController.getUser);

/* Store a new resource */
router.post('/', userValidationRules.createRules, userController.addUser);

/* Update a specific resource */
router.put(
	'/:userId',
	userValidationRules.updateRules,
	userController.updateUser
);

/* Destroy a specific resource */
router.delete('/:userId', userController.deleteUser);

module.exports = router;
