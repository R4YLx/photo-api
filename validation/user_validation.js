/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('email')
		.exists()
		.isLength({ min: 4 })
		.custom(async value => {
			const user = await new models.user_model({ email: value }).fetch({
				require: false,
			});
			if (user) {
				return Promise.reject('Email already exists.');
			}

			return Promise.resolve();
		}),

	body('password').exists().isLength({ min: 4 }),
	body('first_name').exists().isLength({ min: 2 }),
	body('last_name').exists().isLength({ min: 2 }),
];

const updateRules = [
	body('email').optional().isLength({ min: 4 }),
	body('password').optional().isLength({ min: 4 }),
	body('first_name').optional().isLength({ min: 2 }),
	body('last_name').optional().isLength({ min: 2 }),
];

const addPhotoRules = [
	body('photo_id')
		.exists()
		.bail()
		.custom(async value => {
			const book = await new models.photo_model({ id: value }).fetch({
				require: false,
			});
			if (!book) {
				return Promise.reject(`Photo with ID ${value} does not exist.`);
			}

			return Promise.resolve();
		}),
];

const addAlbumRules = [
	body('album_id')
		.exists()
		.bail()
		.custom(async value => {
			const book = await new models.album_model({ id: value }).fetch({
				require: false,
			});
			if (!book) {
				return Promise.reject(`Photo with ID ${value} does not exist.`);
			}

			return Promise.resolve();
		}),
];

module.exports = {
	createRules,
	updateRules,
	addPhotoRules,
	addAlbumRules,
};
