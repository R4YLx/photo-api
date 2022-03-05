/**
 * Album Validation Rules
 */

const { body } = require('express-validator');

const createRules = [body('title').exists().isLength({ min: 4 })];

const updateRules = [body('title').optional().isLength({ min: 4 })];

const addPhotoRules = [
	body('photo_id')
		.exists()
		.isInt()
		.bail()
		.custom(async value => {
			const photo = await new models.Photo({ id: value }).fetch({
				require: false,
			});
			if (!photo) {
				return Promise.reject(`Photo with ID ${value} does not exist.`);
			}
			return Promise.resolve();
		}),
];

module.exports = {
	createRules,
	updateRules,
	addPhotoRules,
};
