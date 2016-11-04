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
	let log = require(`${__base}/lib/logging`);
	let app = require(`${__base}/server`);
	let requestUtils = require(`${__base}/lib/utils`).requests;

	module.exports = (Generalservices) => {

		Generalservices.importRecipes = (recipes, cb) => {

			let recipesSchema = require(`${__base}/schemas/recipes.json`);
			let firstRecipe = recipes[0]; //TO DO - loop the validation to all recipes array request

			requestUtils.validate(recipesSchema, firstRecipe, () => {

				return cb(null,{results:'ok'});

			}, (err) => {
				log.error(`[Generalservices][importRecipes] error: ${err}`);
				return cb(err);
			});
		};

	};

})();
