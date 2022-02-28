/**
 * Register Controller
 */

const bcrypt = require('bcrypt');
const debug = require('debug')('photos:register_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Register a new user
 *
 * POST/
 */

const register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({ status: 'fail', data: errors.array() });
	}
	const validData = matchedData(req);

	try {
		validData.password = await bcrypt.hash(validData.password, 10);
	} catch {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when hashing the password.',
		});
		throw error;
	}

	try {
		const user = await new models.user_model(validData).save();
		debug('Created new user successfully: %O', user);

		res.send({
			status: 'success',
			data: {
				user,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.',
		});
		throw error;
	}
};

module.exports = {
	register,
};
