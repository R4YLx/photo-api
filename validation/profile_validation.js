/**
 * Profile Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

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
	updateRules,
	addPhotoRules,
	addAlbumRules,
};
