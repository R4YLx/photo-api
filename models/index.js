// Setting up the database connection
const knex = require('knex')({
	debug: true,
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || 'photos',
	},
});

const bookshelf = require('bookshelf')(knex);

const models = {};
models.User = require('./user_model')(bookshelf);
models.Photo = require('./photo_model')(bookshelf);
models.Album = require('./album_model')(bookshelf);

module.exports = {
	bookshelf,
	...models,
};
