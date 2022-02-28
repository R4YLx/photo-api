/**
 * Photo model
 */

module.exports = bookshelf => {
	return bookshelf.model('photo_model', {
		tableName: 'photos',
		users() {
			return this.belongsTo('user_model');
		},
		albums() {
			return this.hasMany('album_model');
		},
	});
};
