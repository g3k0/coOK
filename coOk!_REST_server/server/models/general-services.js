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
	let reachmail = require('reachmailapi');
	let _ = require('underscore');

	module.exports = (GeneralServices) => {
		/*Remote methods disabling*/
		GeneralServices.disableRemoteMethod('importRecipes', true);
		GeneralServices.disableRemoteMethod('modifyDbData', true);

		//------------------------------------------------------------------------------------------------------------------------------------------

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

		/**
		 * The service removes the access tokens that are created more than 2 weeks ago.
		 */
		GeneralServices.purgeDB = (cb) => {

			let time = new Date().getTime();
			//timelimit = ttl * 1000
			let timeLimit = time - app.get('accessTokensTimeLimit');

			app.models.AccessToken.destroyAll({created : {lt : timeLimit}}, (err)  => {
				if (err) {
					log.error(`[GeneralServices][purgeDB] error: ${JSON.stringify(err)}`);
					return cb(err);
				}

				return cb(null, {results:'Ok'});
			});
		}



		GeneralServices.mailService = (cb) => {

			let api = new reachmail({token: app.get('SMTP').token});

			let now= new Date();
			let yesterday = new Date(now.getTime() - (1 * 60 * 60 * 24 * 1000));

			let initialDate = new Date(yesterday.setHours(1, 0, 0, 0));
			let finalDate = new Date(yesterday.setHours(24, 59, 59, 999));
	
			let filter = 
				{ and : [
					{
					date: {gte: initialDate}
					},
					{
						date: {lte: finalDate}
					}

				]
			};
	    	
			app.models.Users.find({where:filter}, (err, users) => {
				
				if (err) {
					log.error(`[GeneralServices][mailService] error: ${JSON.stringify(err)}`);
					return cb(err);
				}

				let userContent = "";
				let bodycontent = "";

				let counter = 1;

				_.each(users, (user) => {

					userContent += counter + ") ";

					if(user.name)
						userContent += "name: " + user.name + " ** ";

					if(user.surname)
						userContent += "surname: " + user.surname + " ** ";
				
					if(user.email)
						userContent += "email: " +  user.email + " ** ";

					if(user.password)
						userContent += "password: " + user.password + " ** ";
				
					if(user.group)
						userContent += "group: " + user.group + " ** ";
					
					if(user.uuid)
						userContent += "uuid: " + user.uuid + " ** ";

					if(user.available)
						userContent += "available: " + user.available + " ** ";
				
					if(user.platform)
						userContent += "platform: " + user.platform + " ** ";

					if(user.version)
						userContent += "version: " + user.version + " ** ";

					if(user.cordova)
						userContent += "cordova: " + user.cordova + " ** ";
				
					if(user.model)
						userContent += "model: " + user.model + " ** ";
				
					if(user.manufacturer)
						userContent += "manufacturer: " + user.manufacturer + " ** ";

					if(user.isVirtual)
						userContent += "isVirtual: " + user.isVirtual + " ** ";
				
					if(user.serial)
						userContent += "serial: " + user.serial + " ** ";
				
					if(user.date)
						userContent += "date: " + user.date;

					userContent += "\n";
					counter++;

				
				});
				let total = users.length;
				userContent += "<br /> and the total = " + total;
				//console.log(userContent);

				if(users.length <= 0 ) {
					 bodycontent = app.get('SMTP').email.bodynouser;
				}
				else {
					bodycontent = app.get('SMTP').email.body + "<br />" + userContent;
				}

				console.log(bodycontent);
				let email = {
					FromAddress: 'from@domain.tld',
					Recipients: [{
						Address: app.get('SMTP').email.to
					}],
				  Headers: { 
					Subject: app.get('SMTP').email.subject , 
					From: app.get('SMTP').email.from
					}, 
					BodyText: bodycontent,
					
					Tracking: true
				};
				let jsonBody = JSON.stringify(email);

				api.get('/administration/users/current', (http_code, response) => {

					console.log("hello");
					if (http_code===200) {
						AccountId=response.AccountId; //extracts account GUID from response obj
						console.log("Success!  Account GUID: " + AccountId); //prints out the Account GUID
						//Next Function sends the message
						api.easySmtpDelivery(AccountId, jsonBody, (http_code, response) => {
							if (http_code===200) {
								console.log("successful connection to EasySMTP API");
								console.log(response);
							}else { 
								console.log("Oops, looks like an error on send. Status Code: " + http_code);
								console.log("Details: " + response);
							}
						});
					} else {
							console.log("Oops, there was an error when trying to get the account GUID. Status Code: " + http_code);
							console.log("Details: " + response);
					}
				});



				/*BodyHtml: 'this is the HTML version of the ES API test', */
				
				if (err) {
					log.error(`[GeneralServices][mailService] error: ${JSON.stringify(err)}`);
					return cb(err);
				}

				return cb(null, {result: "Email Send."});

			});
		}

	};
})();
