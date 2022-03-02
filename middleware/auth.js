/**
 * Authentication Middleware
 */

const debug = require('debug')('books:auth');
const bcrypt = require('bcrypt');

const { user_model } = require('../models');

/**
 * HTTP Basic Authentication
 */

const basic = async (req, res, next) => {
	debug('Hello from auth.basic!');

	// make sure authorization header exists, otherwise fail
	if (!req.headers.authorization) {
		debug('Authorization header missing');

		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

	// %o -> placeholder, replaced by next parameter
	debug('Authorization header: %o', req.headers.authorization);

	// split header into "<authSchema> <base64Payload>"
	// creates an array with two parts
	const [authSchema, base64Payload] = req.headers.authorization.split(' ');

	// if authSchema isn't "Basic" then bail
	if (authSchema.toLowerCase() !== 'basic') {
		// not ours to authenticate
		debug("Authorization schema isn't basic");

		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

	// decode payload from base64 => ascii
	const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii');
	// decodedPayload = "email:password"

	// split decoded payload into "<email>:<password>"
	const [email, password] = decodedPayload.split(':');
	console.log(email, password);

	// check if a user with this email and password exists
	const user = await new user_model({ email }).fetch({ require: false });
	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authorization failed',
		});
	}
	const hash = user.get('password');

	// hash the incoming cleartext password using the salt from the db
	// and compare if the generated hash matches the db-hash
	const result = await bcrypt.compare(password, hash);
	if (!result) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authorization failed, invalid password',
		});
	}

	// finally, attach user to request
	req.user = user;

	// pass request along
	next();
};

module.exports = {
	basic,
};
