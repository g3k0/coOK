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
	let commonUtils = require(`${__base}/lib/utils`).common;
	let fs = require('fs');
	let _ = require('underscore');

	module.exports = (GeneralServices) => {
		/*Remote methods disabling*/
		GeneralServices.disableRemoteMethod("importRecipes", true);
		GeneralServices.disableRemoteMethod("modifyDbData", true);

		/**
		 * The service take recipes from a txt file, validate the data and import them into the db
		 */
		GeneralServices.importRecipes = (cb) => {
			log.info(`[GeneralServices][importRecipes] received request with recipes to import...`);

			let recipes = fs.readFileSync(`${__base}/uploads/ricette`, 'utf8');
			let recipesArray = recipes.split(':Ricette').filter((item) => {
				return item.indexOf('Nome') > -1;
			});

			let recipeObjs = [];

			_.each(recipesArray, (recipe) => {
				let recipeObj = {};
				recipeObj = commonUtils.convertTextToJSON(recipe, '-');
				recipeObjs.push(recipeObj);
			});

			app.models.recipes.create(recipeObjs, (err) => {
				if (err) {
					log.error(`[GeneralServices][importRecipes] error: ${err}`);
					return cb(err);
				}

				log.info(`[GeneralServices][importRecipes] ${recipeObjs.length} ricette sono state correttamente importate nel database`);
				return cb(null,{results:'ok'});
			});
		};

		/**
		 * The service modify the recipes data documents on db
		 */
		GeneralServices.modifyDbData = (cb) => {
			app.models.recipes.find((err, recipes) => {
				if (err) {
					log.error(`[GeneralServices][modifyDbData] error: ${err}`);
					return cb(err);
				}
				
				_.each(recipes, (recipe) => {
					let arr = [];
					for (let ingredient of recipe.ingredients) {
						let ingredient1 = ingredient.indexOf('====') > -1 ? ingredient.replace('====', '') : ingredient;
						let ingredient2 = ingredient1.indexOf('  ') > -1 ? ingredient1.replace('  ', ' ') : ingredient1;

						if (ingredient2[0] === ' ') {
							ingredient2 = ingredient2.slice(1, ingredient2.length);
						}
						arr.push(ingredient2);
					}
					recipe.ingredients = arr;
					
					app.models.recipes.upsert(recipe, (err, recipe) => {
						if (err) {
							log.error(`[GeneralServices][modifyDbData] error: ${err}`);
							return cb(err);
						}
						log.info(`[GeneralServices][modifyDbData] updated document with id: ${recipe.id}`);
					});
				});			
				return cb(null,{results:'ok'});
			});
		}; 
	};
})();
