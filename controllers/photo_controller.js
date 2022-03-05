/**
 * Photo Controller
 */

const debug = require('debug')('photos:photo_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all photos
 */

const getPhotos = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['photos'],
	});

	res.status(200).send({
		status: 'success',
		data: {
			photo: user.related('photos'),
		},
	});
};

/**
 * Get a specific photo
 */
const showPhoto = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['photos'],
	});

	const photo = user
		.related('photos')
		.find(photo => photo.id == req.params.photoId);

	if (!photo) {
		return res.status(404).send({
			status: 'fail',
			message: 'Photo not found',
		});
	}

	res.send({
		status: 'success',
		data: {
			photo: photo,
		},
	});
};

/**
 * Store a new photo
 */
const addPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	validData.user_id = req.user.user_id;

	try {
		const photo = await new models.Photo(validData).save();
		debug('Created new photo successfully: %O', photo);
		res.send({
			status: 'success',
			data: {
				result: photo,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when attempting to add an photo.',
		});
		throw error;
	}
};

/**
 * Update a specific photo
 */
const updatePhoto = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['photos'],
	});

	// make sure photo exists
	const photo = await models.Photo.fetchById(req.params.photoId);

	const userPhoto = user
		.related('photos')
		.find(photo => photo.id == req.params.photoId);

	// make sure photo exists
	if (!photo) {
		debug('Photo to update was not found. %o', { id: req.params.photoId });
		res.status(404).send({
			status: 'fail',
			data: 'Photo Not Found',
		});
		return;
	}

	// deny if photo doesn't belong to user
	if (!userPhoto) {
		debug('Cannot update due to photo belongs to another user. %o', {
			id: req.params.photoId,
		});
		return res.status(403).send({
			status: 'fail',
			data: 'Action denied',
		});
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedPhoto = await photo.save(validData);
		debug('Updated photo successfully: %O', updatedPhoto);

		res.send({
			status: 'success',
			data: updatedPhoto,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new photo.',
		});
		throw error;
	}
};

module.exports = {
	getPhotos,
	showPhoto,
	addPhoto,
	updatePhoto,
};
