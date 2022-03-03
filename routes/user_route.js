const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user_validation');

/*/////////
//	GET	//
///////*/

/* Get authenticated user's profile */
router.get('/', userController.getUser);

/* Get authenticated user's photos */
router.get('/photos', userController.getPhotos);

/* Get authenticated user's albums */
router.get('/albums', userController.getAlbums);

/*/////////////
//	POST	//
///////////*/

/* Add a photo to the authenticated user */
router.post(
	'/photos',
	userValidationRules.addPhotoRules,
	userController.addPhoto
);

/* Add a album to the authenticated user */
router.post(
	'/albums',
	userValidationRules.addAlbumRules,
	userController.addAlbum
);

/*/////////
//	PUT	//
///////*/

/* Update authenticated user's profile */
router.put('/', userValidationRules.updateRules, userController.updateUser);

/*/////////////
//	DESTROY	//
///////////*/

/* Delete user */
router.delete('/', userController.deleteUser);

module.exports = router;
