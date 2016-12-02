/**
 * CoOK REST server services.
 * @model: Appauth
 * @author: Christian Palazzo
 * @date: 2016 12 01
 */

(function () {
	'use strict';

	/**
	 * Module dependencies
	 */
	let log = require(`${__base}/lib/logging`);
	let app = require(`${__base}/server`);
	let commonUtils = require(`${__base}/lib/utils`).common;

	module.exports = (Appauth) => {

		/**
		 * The service takes a token furnished by the app, generate an app id for the app and register it as a user
		 */
		Appauth.register = (token, cb) => {
			log.info(`[Appauth][register] received app mobile registration request. Processing...`);
			let err = new Error();

			if (!token || token === '{token}' || token !== app.get('mobileApp').initialToken) {
				log.info(`[Appauth][register] initial token not present or wrong. Stopping the registration process...`);
				err.statusCode = 401;
				err.message = 'initial token not set or wrong';

				return cb(err);
			}

			//we are sure here that service was call by an app. I generate now the app data for the User model.
			let user = {
				email: '',
				password: app.get('mobileApp').password,
				group: app.get('mobileApp').group,
				realm: app.get('mobileApp').realm,
				appId: ''
			};

			//I generate a random app id and I use it even for the email field, required for the login.
			user.appId = commonUtils.guid();
			user.email = user.appId + app.get('mobileApp').emailSuffix;

			log.info(`[Appauth][register] App id for the mobile app generated. Registering the app...`);

			app.models.users.create(user, (err, userInstance) => {
			    if (err) {
			    	err.statusCode = 500;
			    	err.message = 'Internal server error during app registration';
			    	log.error(`[Appauth][register] Internal server error during app registration: ${err}`);
			    	return cb(err); 
			    }
			    log.info(`[Appauth][register] Mobile app registered with success. App id is ${userInstance.appId}`);
			    return cb(null, {results: userInstance.appId});
			});
		};

		//------------------------------------------------------------------------------------------------------------------------------

		/**
		 * The service takes the app id furnished by the mobile application, extract the user from the users collection, 
		 * then execute the login and returns the Loopback access token.
		 */
		Appauth.login = (appId, cb) => {
			log.info(`[Appauth][login] received app mobile login request. Processing...`);
			let err = new Error();

			if (!appId || appId === '{appId}') {
				log.info(`[Appauth][login] application id not present. Stopping the login process...`);
				err.statusCode = 401;
				err.message = 'app id not set';

				return cb(err);
			}

			//I extract here the user from the collection

			/* Promises declaration */
			let user = (appId) => {
				let userPromise = new Promise((resolve, reject) => {
					app.models.users.findOne({where:{appId: appId}}, (err, user) => {
						if (err) reject(err);
						resolve(user);
					});
				});

				return userPromise;
			};

			let loopbackLogin = (email) => {
				let loopbackLoginPromise = new Promise((resolve, reject) => {
					app.models.users.login({
				    	email: email,
				    	password: app.get('mobileApp').password,
				    	realm: app.get('mobileApp').realm
				  	}, 'user', function(err, token) {
				   		if (err) reject(err);
				    	resolve(token.id);
				    });
				});
				
				return loopbackLoginPromise;
			};
			/* End promises declaration */

			user(appId)
			.then((user) => {
				//resolve
				if (!user) {
					log.info(`[Appauth][login] user not found. Stopping the login process...`);
					err.statusCode = 404;
					err.message = 'user not found';
					return cb(err);
				}
				// I have the user object, now I do the Loopback login
				log.info(`[Appauth][login] user found. Obtaining an access token fot the mobile app...`);

				loopbackLogin(user.email)
				.then((token) => {
					if (!token) {
						err.statusCode = 404;
						err.message = 'User not found';
						log.info(`[Appauth][login] ${err}. Stopping the login process...`);
						return cb(err);
					}
					return cb(null, {
						results: token
					});

				}, (err) => {
					//reject
					log.error(`[Appauth][login] Error on user login collection: ${err}. Stopping the login process...`);
					err.statusCode = 500;
					err.message = 'Internal server error';
					return cb(err);
					});
			}, (err) => {
				//reject
				log.error(`[Appauth][login] Error on querying the users collection: ${err}. Stopping the login process...`);
				err.statusCode = 500;
				err.message = 'Internal server error';
				return cb(err);
			});
		};
	};
})();
