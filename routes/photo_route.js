const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photo_validation');

/**
 * Get authenticated user's all photos
 */
router.get('/', photoController.getPhotos);

/**
 * Update authenticated user's photo
 */
router.put('/', photoValidationRules.updateRules, photoController.updatePhoto);

/**
 * Get authenticated user's specific photo
 */
router.get('/photos', photoController.getPhoto);

/**
 * Add a photo to the authenticated user
 *
 */
router.post(
	'/photos',
	photoValidationRules.addPhotoRules,
	photoController.addPhoto
);

module.exports = router;
