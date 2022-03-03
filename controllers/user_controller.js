/**
 *
 * User Controller
 *
 */

const debug = require('debug')('photos:user_controller');
const { matchedData, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { User } = require('../models');

/**
 * Get authenticated user profile
 */

const getUser = async (req, res) => {
	try {
		const user = await User.fetchById(req.user.user_id);
		res.send({
			status: 'success',
			data: {
				user,
			},
		});
	} catch (error) {
		return res.sendStatus(404);
	}
};

/**
 * Update authenticated user profile
 */
const updateUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

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
		const user = await User.fetchById(req.user.user_id);
		const updatedUser = await user.save(validData);
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
			message: 'Exception thrown in database when updating a user.',
		});
		throw error;
	}
};

module.exports = {
	getUser,
	updateUser,
};
