/**
 * CoOK REST server services.
 * @model: General-services
 * @author: Christian Palazzo
 * @date: 2016 11 04
 */

(function () {
	'use strict';

	/**
	 * Module dependencies
	 */
	let log = require(__base + '/lib/logging');
	let app = require(__base + 'server');

	module.exports = (Generalservices) => {

		Generalservices.importRecipes = (recipes, cb) => {
			return cb(null,{results:'ok'});
		};

	};

})();
