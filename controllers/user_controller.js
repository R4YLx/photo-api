/**
 * User Controller
 */

const debug = require('debug')('photos:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all resources
 *
 * GET /
 */
const getUsers = async (req, res) => {
	try {
		const all_users = await models.user_model.fetchAll();

		res.send({
			status: 'success',
			data: all_users,
		});
	} catch {
		res.status(500).send({
			status: 'error',
			message: 'Could not GET users',
		});
		throw error;
	}
};

/**
 * Get a specific resource
 *
 * GET /:userId
 */
const getUser = async (req, res) => {
	const user = await new models.user_model({
		id: req.params.userId,
	}).fetch({ withRelated: ['photos', 'albums'] });

	res.send({
		status: 'success',
		data: user,
	});
};

/**
 * Store a new resource
 *
 * POST /
 */
const addUser = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const user = await new models.user_model(validData).save();
		debug('Created new user successfully: %O', user);

		res.send({
			status: 'success',
			data: user,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.',
		});
		throw error;
	}
};

/**
 * Update a specific resource
 *
 * PUT /:userId
 */
const updateUser = async (req, res) => {
	const userId = req.params.userId;

	// make sure user exists
	const user = await new models.user_model({ id: userId }).fetch({
		require: false,
	});
	if (!user) {
		debug('User to update was not found. %o', { id: userId });
		res.status(404).send({
			status: 'fail',
			data: 'User Not Found',
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
		const updatedUser = await user.save(validData);
		debug('Updated user successfully: %O', updatedUser);

		res.send({
			status: 'success',
			data: updatedUser,
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
 * Destroy a specific resource
 *
 * DELETE /:userId
 */
const deleteUser = (req, res) => {
	res.status(400).send({
		status: 'fail',
		message: 'Method Not Allowed.',
	});
};

module.exports = {
	getUsers,
	getUser,
	addUser,
	updateUser,
	deleteUser,
};
