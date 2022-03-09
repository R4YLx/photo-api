const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album_validation');

/* Get all albums */
router.get('/', albumController.getAlbums);

/* Get a specific album */
router.get('/:albumId', albumController.showAlbum);

/* Store a new album */
router.post('/', albumValidationRules.createRules, albumController.addAlbum);

/* Update a specific album */
router.put(
	'/:albumId',
	albumValidationRules.updateRules,
	albumController.updateAlbum
);

/* Store a photo in album */
router.post(
	'/:albumId/photos',
	albumValidationRules.addPhotoRules,
	albumController.addPhoto
);

/* Delete a specific album */
router.delete('/:albumId', albumController.deleteAlbum);

module.exports = router;
