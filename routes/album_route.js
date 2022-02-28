const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album_validation');

/**
 * Get authenticated user's all photos
 */
router.get('/', albumController.getAlbums);

/**
 * Update authenticated user's photo
 */
router.put('/', albumValidationRules.updateRules, albumController.updateAlbum);

/**
 * Get authenticated user's specific photo
 */
router.get('/photos', albumController.getAlbum);

/**
 * Add a photo to the authenticated user
 *
 */
router.post(
	'/photos',
	albumValidationRules.addPhotoRules,
	albumController.addAlbum
);

module.exports = router;
