/**
 * Album model
 */

module.exports = bookshelf => {
	return bookshelf.model('album_model', {
		tableName: 'albums',
		photos() {
			return this.belongsToMany('photo_model');
		},
		users() {
			return this.belongsTo('user_model');
		},
	});
};
