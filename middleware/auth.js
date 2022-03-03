/**
 * Authentication Middleware
 */

const debug = require('debug')('books:auth');
const jwt = require('jsonwebtoken');
// const { User } = require('../models');

const validateToken = (req, res, next) => {
	if (!req.headers.authorization) {
		debug('Authorization header missing');

		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

	const [authSchema, token] = req.headers.authorization.split(' ');
	if (authSchema.toLowerCase() !== 'bearer') {
		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

	try {
		const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
		req.user = payload;
	} catch (error) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

	next();
};

// const basic = async (req, res, next) => {
// 	if (!req.headers.authorization) {
// 		debug('Authorization header missing');

// 		return res.status(401).send({
// 			status: 'fail',
// 			data: 'Authorization required',
// 		});
// 	}

// 	debug('Authorization header: %o', req.headers.authorization);

// 	const [authSchema, base64Payload] = req.headers.authorization.split(' ');

// 	if (authSchema.toLowerCase() !== 'basic') {
// 		return res.status(401).send({
// 			status: 'fail',
// 			data: 'Authorization is not basic',
// 		});
// 	}

// 	const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii');

// 	const [email, password] = decodedPayload.split(':');

// 	const user = await User.login(email, password);
// 	if (!user) {
// 		return res.status(401).send({
// 			status: 'fail',
// 			data: 'Authorization failed',
// 		});
// 	}

// 	req.user = user;

// 	next();
// };

module.exports = {
	validateToken,
	// basic,
};
