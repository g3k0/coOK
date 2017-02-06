/**
 * CoOK REST server services.
 * @model: Recipes
 * @author: Christian Palazzo
 * @date: 2016 11 04
 */

(function () {
	'use strict';



	let app = require(`${__base}/server`);
	let log = require(`${__base}/lib/logging`);

	module.exports = (Recipes) => {


		Recipes.ingredients_calculation = (servingSize, cb) => {

			let err = new Error();

			if(!servingSize) {

				log.error('[Recipes][ingredients_calculation] New ingredient calculation requested without servingSize parameter...');
				err.status = 400;
				err.message = "Parameter servingSize not set.";
				return cb(err); 
			}


			if( !servingSize.numberOfPerson || !servingSize.recipeName ) {

				log.error('[Recipes][ingredients_calculation] New ingredient calculation requested, missing properties of servingSize parameter ...');
				err.status = 400;
				err.message = "Properties numberOfPerson or recipeName not set.";
				return cb(err); 
			}


			if( (isNaN(servingSize.numberOfPerson)  || !(Number.isInteger(servingSize.numberOfPerson)) ) && 
				(isNaN(servingSize.recipeName)  || !(Number.isInteger(servingSize.recipeName)))) {

				log.error('[Recipes][ingredients_calculation] New ingredient calculation requested with incorrect properties of servingSize parameter...');
				err.status = 400;
				err.message = "Incorrect type of properties.";
				return cb(err); 
			}


			let numberOfPerson = servingSize.numberOfPerson;
			let finalIngredients = [];

			app.models.recipes.findOne({where:{name:servingSize.recipeName}}, (er, recipe) => {

			 	if(er) {
					log.error(`[Recipes][ingredients_calculation][findOne] error: ${er}`);
					return cb(er);
			 	}

			 	if(!recipe) {
			 	log.error('[Recipes][ingredients_calculation][findOne] No recipe found...');
				err.status = 404;
				err.message = "Recipe not found.";
				return cb(err); 
			 	}

			 	// No calculation for bevande.
			 	if(recipe.type === "Bevande") {
			 		return cb(null, {persons: numberOfPerson, ingredients: recipe.ingredients});
			 	}

			 	// If numberOfPerson = recipe.persons, then no calculation needed.
			 	if(recipe.persons === numberOfPerson) {
			 		return cb(null, {persons: numberOfPerson, ingredients: recipe.ingredients});
			 	}


			 	for(let initialIngredient of recipe.ingredients) {
			 		
			 		//if ingredient starts with number, then extract the number and do calculation.
			 		let firstWord = initialIngredient.substring(0, initialIngredient.indexOf(" "));
			 		let initialAmount = parseFloat(firstWord);
			 		
			 		if(!isNaN(initialAmount) && isFinite(firstWord)) {

			 			let restOfIngredient = initialIngredient.substring(initialIngredient.indexOf(" "));
			 			let finalAmount = (initialAmount * (parseInt(numberOfPerson)/parseInt(recipe.persons))).toFixed(2);
			 			let finalIngredient = "";

						if(finalAmount.match("[0-9](.00)")) {
							finalIngredient = (finalAmount.substring(0, finalAmount.indexOf('.'))) + restOfIngredient;
						}
						else {
							finalIngredient = finalAmount + restOfIngredient;
						}

						finalIngredients.push(finalIngredient);
			 		
			 		}

			 	}

				return cb(null, {persons: numberOfPerson, ingredients: finalIngredients});

		  });

		};

	};

})();
