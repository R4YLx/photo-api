/**
 * Profile Validation Rules
 */

const { body } = require('express-validator');

const createRules = [body('title').exists().isLength({ min: 4 })];

const updateRules = [body('title').optional().isLength({ min: 4 })];

module.exports = {
	createRules,
	updateRules,
};
