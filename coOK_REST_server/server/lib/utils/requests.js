/**
 * @author: Christian PAlazzo
 * @date: 2016 November 04
 */

(function () {
	'use strict';

	class Requests {
		constructor () {

		}

		validate(schema, inputData, success, failure) {
			if (!schema) throw new Error('[Requests][validate] Error missing schema data.');
			if (!inputData) throw new Error('[Requests][validate] Error missing input data.');

			let Ajv = require('ajv');
			let ajv = new Ajv();
			let validate = ajv.compile(schema);
			let valid = validate(inputData);

			if(!valid) return failure(JSON.stringify(validate.errors));

			return success();


		}

	}
	module.exports = Requests;
})();