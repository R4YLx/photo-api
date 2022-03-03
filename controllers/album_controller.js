/**
 * Album Controller
 */

const debug = require('debug')('photos:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all resources
 *
 * GET /
 */
const getAlbums = async (req, res) => {
	const all_albums = await models.album_model.fetchAll();

	res.send({
		status: 'success',
		data: all_albums,
	});
};

/**
 * Get a specific resource
 *
 * GET /:albumId
 */
const getAlbum = async (req, res) => {
	const album = await new models.album_model({
		id: req.params.albumId,
	}).fetch({ withRelated: ['photos'] });

	res.send({
		status: 'success',
		data: album,
	});
};

/**
 * Store a new resource
 *
 * POST /
 */
const addAlbum = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const album = await new models.album_model(validData).save();
		debug('Created new album successfully: %O', album);

		res.send({
			status: 'success',
			data: album,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
};

/**
 * Update a specific resource
 *
 * PUT /:albumId
 */
const updateAlbum = async (req, res) => {
	const albumId = req.params.albumId;

	// make sure album exists
	const album = await new models.album_model({ id: albumId }).fetch({
		require: false,
	});
	if (!album) {
		debug('Album to update was not found. %o', { id: albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
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
		const updatedAlbum = await album.save(validData);
		debug('Updated album successfully: %O', updatedAlbum);

		res.send({
			status: 'success',
			data: updatedAlbum,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new album.',
		});
		throw error;
	}
};

/**
 * Destroy a specific resource
 *
 * DELETE /:albumId
 */
const deleteAlbum = (req, res) => {
	res.status(400).send({
		status: 'fail',
		message: 'Method Not Allowed.',
	});
};

module.exports = {
	getAlbums,
	getAlbum,
	addAlbum,
	updateAlbum,
	deleteAlbum,
};
