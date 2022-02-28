/**
 * User model
 */

module.exports = bookshelf => {
	return bookshelf.model('user_model', {
		tableName: 'users',
		photos() {
			return this.belongsToMany('photo_model');
		},
		albums() {
			return this.belongsToMany('album_model');
		},
	});
};
