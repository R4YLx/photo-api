/**
 * Profile Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').exists().isLength({ min: 4 }),
	body('url').exists().isLength({ min: 4 }),
	body('comment').optional().isInt({ min: 1 }),
	body('user_id')
		.exists()
		.bail()
		.custom(async value => {
			const user = await new models.user_model({ id: value }).fetch({
				require: false,
			});
			if (!user) {
				return Promise.reject(`User with ID ${value} does not exist.`);
			}

			return Promise.resolve();
		}),
];

// Tillåt endast lösen, för- och efternamn uppdateras.
const updateRules = [
	body('title').optional().isLength({ min: 4 }),
	body('url').optional().isLength({ min: 4 }),
	body('comment').optional().isInt({ min: 1 }),
	body('user_id')
		.exists()
		.bail()
		.custom(async value => {
			const user = await new models.user_model({ id: value }).fetch({
				require: false,
			});
			if (!user) {
				return Promise.reject(`User with ID ${value} does not exist.`);
			}

			return Promise.resolve();
		}),
];

module.exports = {
	createRules,
	updateRules,
};
