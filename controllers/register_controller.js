/**
 * Register Controller
 */

const bcrypt = require('bcrypt');
const debug = require('debug')('photos:register_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
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

/**
 * Login
 */

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await models.user_model.login(email, password);
	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authorization failed',
		});
	}

	const payload = {
		sub: user.get('email'),
		user_id: user.get('id'),
		name: user.get('first_name') + ' ' + user.get('last_name'),
	};

	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
	});

	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w',
	});

	return res.send({
		status: 'success',
		data: {
			access_token,
			refresh_token,
		},
	});
};

/**
 * Refresh
 */

const refresh = (req, res) => {
	try {
		const payload = jwt.verify(
			req.body.token,
			process.env.REFRESH_TOKEN_SECRET
		);

		delete payload.iat;
		delete payload.exp;

		const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
		});

		return res.send({
			status: 'success',
			data: {
				access_token,
			},
		});
	} catch (error) {
		return res.status(401).send({
			status: 'fail',
			data: 'invalid token',
		});
	}
	r;
};

module.exports = {
	register,
	login,
	refresh,
};
