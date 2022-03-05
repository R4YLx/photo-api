/**
 * Album Controller
 */

const debug = require('debug')('photos:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all albums
 */
const getAlbums = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['albums'],
	});

	res.status(200).send({
		status: 'success',
		data: {
			album: user.related('albums'),
		},
	});
};

/**
 * Get a specific album
 */
const showAlbum = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['albums'],
	});
	const userAlbums = user.related('albums');
	const album = userAlbums.find(album => album.id == req.params.albumId);

	if (!album) {
		return res.status(404).send({
			status: 'fail',
			message: 'Album not found',
		});
	}
	const albumId = await models.Album.fetchById(req.params.albumId, {
		withRelated: ['photos'],
	});
	res.send({
		status: 'success',
		data: {
			album: albumId,
		},
	});
};

/**
 * Store a new album
 */
const addAlbum = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	validData.user_id = req.user.user_id;

	try {
		const album = await new models.Album(validData).save();
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
 * Update a specific album
 */
const updateAlbum = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['albums'],
	});
	// get album by id
	const album = await models.Album.fetchById(req.params.albumId);

	const userAlbum = user
		.related('albums')
		.find(album => album.id == req.params.albumId);

	// make sure album exists
	if (!album) {
		debug('Album to update was not found. %o', { id: req.params.albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}

	// deny if album doesn't belong to user
	if (!userAlbum) {
		debug('Cannot update due to album belongs to another user. %o', {
			id: req.params.albumId,
		});
		return res.status(403).send({
			status: 'fail',
			data: 'Action denied. Try something that belongs to you!',
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

const addPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	const album = await models.Album.fetchById(req.params.albumId, {
		withRelated: ['photos'],
	});

	// check if album exists for user to add photo to
	const existing_photo = album
		.related('photos')
		.find(photo => photo.id == validData.photo_id);

	if (existing_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists',
		});
	}

	try {
		const result = await album.photos().attach(validData.photo_id);
		debug('Added photo to album successfully: %O', result);

		res.send({
			status: 'success',
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to an album.',
		});
		throw error;
	}
};

module.exports = {
	getAlbums,
	showAlbum,
	addAlbum,
	updateAlbum,
	addPhoto,
};
