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
	const photos = user.related('photos');

	const photo = photos.find(photo => photo.id == req.params.photoId);

	if (!photo) {
		return res.status(404).send({
			status: 'fail',
			message: 'Photo not found',
		});
	}

	res.send({
		status: 'success',
		data: {
			album: photo,
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

	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['photos'],
	});

	// get the user's photos
	const photos = user.related('photos');

	// check if photo is already in the user's list of photos
	const existing_photo = photos.find(photo => photo.id == validData.photo_id);

	// if it already exists, bail
	if (existing_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

	try {
		const result = await user.photos().attach(validData.photo_id);

		debug('Added photo successfully: %o', res);
		res.send({
			status: 'success',
			data: {
				result: result,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when attempting to add an album.',
		});
		throw error;
	}
};

/**
 * Update a specific photo
 */
const updatePhoto = async (req, res) => {
	const photoId = req.params.photoId;

	// make sure photo exists
	const photo = await new models.Photo({ id: photoId }).fetch({
		require: false,
	});
	if (!photo) {
		debug('Photo to update was not found. %o', { id: photoId });
		res.status(404).send({
			status: 'fail',
			data: 'Photo Not Found',
		});
		return;
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
