/**
 * Authentication Middleware
 */

const debug = require('debug')('books:auth');
const jwt = require('jsonwebtoken');

/**
 * Validate JWT token
 */

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

module.exports = {
	validateToken,
};
