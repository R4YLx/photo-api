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
	const thisAlbum = await models.Album.fetchById(req.params.albumId, {
		withRelated: ['photos'],
	});
	res.send({
		status: 'success',
		data: {
			album: thisAlbum,
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

const addPhotoToAlbum = async (req, res) => {
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

	const photos = user.related('photos');

	const photo = photos.find(photo => photo.id == req.params.photoId);

	try {
		const result = await photo.albums().attach(validData.album_id);
		debug('Added photo to album successfully: %O', result);

		res.send({
			status: 'success',
			data: result,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to an album.',
		});
		throw error;
	}

	/*
		const albumId = req.params.albumId;
	
		// Checking after errors before adding photo
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(422).send({ status : "fail", data: errors.array() });
		}
	
		const validData = matchedData(req); 
	
		// get the user's album by id 
		const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums', 'photos'] });
	
		// get the user's albums
		const albums = user.related('albums');
		const userAlbum = albums.find(album => album.id == albumId)
	
		// make sure album exists
		const album = await models.Album.fetchById(albumId);
		const photos = album.related('photos');
	
		if (!album) {
			debug("Album to update was not found. %o", { id: albumId });
			res.status(404).send({
				status: 'fail',
				data: 'Album Not Found',
			});
			return;
		}
		//make sure user has the album in their list
		if(!userAlbum) {
			debug("Album to update does not belong to you. %o", { id: albumId });
			res.status(403).send({
				status:'fail',
				data: 'You are not authorized for this action.'
			});
			return;
		}
		
		try {
	
			const result = await album.photos().attach(validData.photo_id);
	
			if(result === photos){
				debug("Cannot add photo already in list.")
			}
			debug("Added photo successfully: %O", res);
			res.send({
				status: 'success',
				data: 
					result,
			});
		} catch (error) {
			res.status(500).send({
				status: 'error',
				message: "Exception thrown when attempting to add photo",
			});
			throw error;
		}
		*/
};

/**
 * Update a specific album
 */
const updateAlbum = async (req, res) => {
	const albumId = req.params.albumId;

	// make sure album exists
	const album = await new models.Album({ id: albumId }).fetch({
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

module.exports = {
	getAlbums,
	showAlbum,
	addAlbum,
	updateAlbum,
	addPhotoToAlbum,
};
