/**
 * Profile Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').exists().isLength({ min: 4 }),
	body('user_id')
		.exists()
		.bail()
		.custom(async value => {
			const author = await new models.user_model({ id: value }).fetch({
				require: false,
			});
			if (!author) {
				return Promise.reject(`User with ID ${value} does not exist.`);
			}

			return Promise.resolve();
		}),
];

const updateRules = [body('title').optional().isLength({ min: 4 })];

module.exports = {
	createRules,
	updateRules,
};
