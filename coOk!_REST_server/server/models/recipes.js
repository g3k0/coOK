/**
 * CoOK REST server services.
 * @model: Recipes
 * @author: Anahita Sepheri
 * @date: 2016 11 04
 */
(function () {
	'use strict';

	let app = require(`${__base}/server`);
	let log = require(`${__base}/lib/logging`);

	module.exports = (Recipes) => {
		//Disabilitation of all methods except find, findById and findOne
		Recipes.disableRemoteMethod('create', true);
		Recipes.disableRemoteMethod('upsert', true);
		Recipes.disableRemoteMethod('updateAll', true);
		Recipes.disableRemoteMethod('updateAttributes', false);
		 
		Recipes.disableRemoteMethod('find', false);
		Recipes.disableRemoteMethod('findById', false);
		Recipes.disableRemoteMethod('findOne', false);
		 
		Recipes.disableRemoteMethod('deleteById', true);
		 
		Recipes.disableRemoteMethod('confirm', true);
		Recipes.disableRemoteMethod('count', true);
		Recipes.disableRemoteMethod('exists', true);
		Recipes.disableRemoteMethod('resetPassword', true);
		Recipes.disableRemoteMethod('replaceOrCreate', true);
		Recipes.disableRemoteMethod('upsertWithWhere', true);
		Recipes.disableRemoteMethod('createChangeStream', true);
		Recipes.disableRemoteMethod('replaceOrCreate', true);
		Recipes.disableRemoteMethod('replaceById', true);
		 
		Recipes.disableRemoteMethod('__count__accessTokens', true);
		Recipes.disableRemoteMethod('__create__accessTokens', true);
		Recipes.disableRemoteMethod('__delete__accessTokens', true);
		Recipes.disableRemoteMethod('__destroyById__accessTokens', true);
		Recipes.disableRemoteMethod('__findById__accessTokens', true);
		Recipes.disableRemoteMethod('__get__accessTokens', true);
		Recipes.disableRemoteMethod('__updateById__accessTokens', true);

		/*--------------------------------------------------------------------------------------------------------------------------*/

		Recipes.ingredients_calculation = (servingSize, cb) => {
			let err = new Error();
			if(!servingSize) {
				log.error('[Recipes][ingredients_calculation] New ingredient calculation requested without servingSize parameter...');
				err.status = 400;
				err.message = 'Parameter servingSize not set.';
				return cb(err); 
			}

			if( !servingSize.numberOfPerson || !servingSize.recipeName ) {
				log.error('[Recipes][ingredients_calculation] New ingredient calculation requested, missing properties of servingSize parameter ...');
				err.status = 400;
				err.message = 'Properties numberOfPerson or recipeName not set.';
				return cb(err); 
			}

			if( (isNaN(servingSize.numberOfPerson)  || !(Number.isInteger(servingSize.numberOfPerson)) ) || typeof servingSize.recipeName !== 'string') {
				log.error('[Recipes][ingredients_calculation] New ingredient calculation requested with incorrect properties of servingSize parameter...');
				err.status = 400;
				err.message = 'Incorrect type of properties.';
				return cb(err); 
			}

			let finalIngredients = [];

			app.models.recipes.findOne({where:{name:servingSize.recipeName}}, (err, recipe) => {
			 	if(err) {
					log.error(`[Recipes][ingredients_calculation][findOne] error: ${JSON.stringify(err)}`);
					return cb(err);
			 	}

			 	if(!recipe) {
			 	log.error('[Recipes][ingredients_calculation][findOne] No recipe found...');
				err.status = 404;
				err.message = 'Recipe not found.';
				return cb(err); 
			 	}

			 	// No calculation for bevande.
			 	if(recipe.type === 'Bevande') {
			 		return cb(null, {persons: servingSize.numberOfPerson, ingredients: recipe.ingredients});
			 	}

			 	// If numberOfPerson = recipe.persons, then no calculation needed.
			 	if(recipe.persons === servingSize.numberOfPerson) {
			 		return cb(null, {persons: servingSize.numberOfPerson, ingredients: recipe.ingredients});
			 	}

			 	for(let initialIngredient of recipe.ingredients) {
			 		
			 		//if ingredient starts with number, then extract the number and do calculation.
			 		let firstWord = initialIngredient.substring(0, initialIngredient.indexOf(" "));
			 		let initialAmount = parseFloat(firstWord);
			 		
			 		if(!isNaN(initialAmount) && isFinite(firstWord)) {

			 			let restOfIngredient = initialIngredient.substring(initialIngredient.indexOf(" "));
			 			let finalAmount = (initialAmount * (parseInt(servingSize.numberOfPerson)/parseInt(recipe.persons))).toFixed(2);
			 			let finalIngredient = "";

						if(finalAmount.match("[0-9](.00)")) {
							finalIngredient = (finalAmount.substring(0, finalAmount.indexOf('.'))) + restOfIngredient;
						}
						else {
							finalIngredient = finalAmount + restOfIngredient;
						}
						finalIngredients.push(finalIngredient);

			 		} else if (isNaN(initialAmount)) {
			 			finalIngredients.push(initialIngredient);
			 		}
			 	}
				return cb(null, {persons: servingSize.numberOfPerson, ingredients: finalIngredients});
		  });
		};
	};
})();
