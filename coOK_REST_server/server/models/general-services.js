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

		/**
		 * The service take recipes from a txt file, validate the data and import them into the db
		 */
		Generalservices.importRecipes = (cb) => {
			log.info(`[Generalservices][importRecipes] received request with recipes to import...`);
			let recipesSchema = require(`${__base}/schemas/recipes.json`);

			//TO DO - import txt data from file to JSON object

			//let firstRecipe = recipes[0]; //TO DO - loop the validation to all recipes array request

			/*requestUtils.validate(recipesSchema, firstRecipe, () => {
				log.info(`[Generalservices][importRecipes] response sent`)
				return cb(null,{results:'ok'});

			}, (err) => {
				log.error(`[Generalservices][importRecipes] error: ${err}`);
				return cb(err);
			});*/
			return cb(null,{results:'ok'});

		};

	};

})();
