// Setting up the database connection
const knex = require('knex')({
	debug: true,
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		charset: process.env.DB_CHARSET || 'utf8mb4',
		database: process.env.DB_NAME || 'photos',
		user: process.env.DB_USER || 'photos',
		password: process.env.DB_PASSWORD || '',
	},
});

const bookshelf = require('bookshelf')(knex);

const models = {};
models.user_model = require('./user_model')(bookshelf);
models.photo_model = require('./photo_model')(bookshelf);
models.album_model = require('./album_model')(bookshelf);

module.exports = {
	bookshelf,
	...models,
};
