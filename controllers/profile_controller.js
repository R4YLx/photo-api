/**
 * Profile Controller
 */

const debug = require('debug')('photos:profile_controller');
const { matchedData, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

/**
 * Get authenticated user's profile
 *
 */
const getProfile = async (req, res) => {
	res.send({
		status: 'success',
		data: {
			user: req.user,
		},
	});
};

/**
 * Update authenticated user's profile
 *
 */
const updateProfile = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	if (validData.password) {
		try {
			validData.password = await bcrypt.hash(validData.password, 10);
		} catch {
			res.status(500).send({
				status: 'error',
				message: 'Exception thrown in database when hashing the password.',
			});
			throw error;
		}
	}

	try {
		const updatedUser = await req.user.save(validData);
		debug('Updated user successfully: %O', updatedUser);

		res.send({
			status: 'success',
			data: {
				user: updatedUser,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new user.',
		});
		throw error;
	}
};

/**
 * Get authenticated user's photos
 *
 */
const getPhotos = async (req, res) => {
	await req.user.load('photos');

	res.status(200).send({
		status: 'success',
		data: { photos: req.user.related('photos') },
	});
};

/**
 * Add authenticated user's photo
 *
 */

const addPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	// lazy-load photo relationship
	await req.user.load('photos');

	// get the user's photos
	const photos = req.user.related('photos');

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
		const result = await req.user.photos().attach(validData.photo_id);
		debug('Added photo to user successfully: %O', result);

		res.send({
			status: 'success',
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to a user.',
		});
		throw error;
	}
};

/**
 * Get authenticated user's albums
 *
 */

const getAlbums = async (req, res) => {
	await req.user.load('albums');

	res.status(200).send({
		status: 'success',
		data: { albums: req.user.related('albums') },
	});
};

/**
 * Add authenticated user's album
 *
 */

const addAlbum = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	// lazy-load album relationship
	await req.user.load('albums');

	// get the user's albums
	const albums = req.user.related('albums');

	// check if album is already in the user's list of albums
	const existing_album = albums.find(album => album.id == validData.album_id);

	// if it already exists, bail
	if (existing_album) {
		return res.send({
			status: 'fail',
			data: 'Album already exists.',
		});
	}

	try {
		const result = await req.user.albums().attach(validData.album_id);
		debug('Added album to user successfully: %O', result);

		res.send({
			status: 'success',
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a album to a user.',
		});
		throw error;
	}
};

module.exports = {
	getProfile,
	updateProfile,
	getPhotos,
	addPhoto,
	getAlbums,
	addAlbum,
};
