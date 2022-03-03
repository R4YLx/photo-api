const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photo_validation');

/* Get all photos */
router.get('/', photoController.getPhotos);

/* Get a specific photo */
router.get('/:photoId', photoController.showPhoto);

/* Store a new photo */
router.post('/', photoValidationRules.createRules, photoController.addPhoto);

/* Update a specific photo */
router.put(
	'/:photoId',
	photoValidationRules.updateRules,
	photoController.updatePhoto
);

module.exports = router;
