/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');

const createRules = [
	body('title').exists().isLength({ min: 4 }),
	body('url').exists().isLength({ min: 4 }),
	body('comment').optional().isLength({ min: 1 }),
];

const updateRules = [
	body('title').optional().isLength({ min: 4 }),
	body('url').optional().isLength({ min: 4 }),
	body('comment').optional().isLength({ min: 1 }),
];

module.exports = {
	createRules,
	updateRules,
};
