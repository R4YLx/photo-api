const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album_validation');

/* Get all resources */
router.get('/', albumController.getAlbums);

/* Get a specific resource */
router.get('/:albumId', albumController.getAlbum);

/* Store a new resource */
router.post('/', albumValidationRules.createRules, albumController.addAlbum);

/* Update a specific resource */
router.put(
	'/:albumId',
	albumValidationRules.updateRules,
	albumController.updateAlbum
);

/* Destroy a specific resource */
router.delete('/:albumId', albumController.deleteAlbum);

module.exports = router;
