/**
 * Photo Controller
 */

const debug = require('debug')('photos:photo_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all resources
 *
 * GET /
 */
const getPhotos = async (req, res) => {
	const all_photos = await models.photo_model.fetchAll();

	res.send({
		status: 'success',
		data: all_photos,
	});
};

/**
 * Get a specific resource
 *
 * GET /:photoId
 */
const getPhoto = async (req, res) => {
	const photo = await new models.photo_model({
		id: req.params.photoId,
	}).fetch({ withRelated: ['users'] });

	res.send({
		status: 'success',
		data: photo,
	});
};

/**
 * Store a new resource
 *
 * POST /
 */
const addPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const photo = await new models.photo_model(validData).save();
		debug('Created new photo successfully: %O', photo);

		res.send({
			status: 'success',
			data: photo,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new photo.',
		});
		throw error;
	}
};

/**
 * Update a specific resource
 *
 * PUT /:photoId
 */
const updatePhoto = async (req, res) => {
	const photoId = req.params.photoId;

	// make sure photo exists
	const photo = await new models.photo_model({ id: photoId }).fetch({
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

/**
 * Destroy a specific resource
 *
 * DELETE /:albumId
 */
const deletePhoto = (req, res) => {
	res.status(400).send({
		status: 'fail',
		message: 'Method Not Allowed.',
	});
};

module.exports = {
	getPhotos,
	getPhoto,
	addPhoto,
	updatePhoto,
	deletePhoto,
};
