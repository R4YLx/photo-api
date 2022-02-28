const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photo_validation');

/* Get all resources */
router.get('/', photoController.getPhotos);

/* Get a specific resource */
router.get('/:photoId', photoController.getPhoto);

/* Store a new resource */
router.post('/', photoValidationRules.createRules, photoController.addPhoto);

/* Update a specific resource */
router.put(
	'/:photoId',
	photoValidationRules.updateRules,
	photoController.updatePhoto
);

/* Destroy a specific resource */
router.delete('/:photoId', photoController.deletePhoto);

module.exports = router;
