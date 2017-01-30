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
	let extend = require(`node.extend`);

	module.exports = (Appauth) => {

		/**
		 * The service takes a token furnished by the app, generate an app id for the app and register it as a user
		 */
		/*
         * req.body:
	        {
				token: "token",
				available: true,
				platform: "Android",
				version: "5.0",
				uuid: "d57593a7fc301e5f",
				cordova: "6.0.0",
				model: "ASUS_ZooAD",
				manufacturer: "asus",
				isVirtual: false, 
				serial: "F6AZFGo84541"
			}
		 */
		Appauth.register = (data, cb) => {
			log.info(`[Appauth][register] received app mobile registration request. Processing...`);
			let err = new Error();

			if (!data.token || data.token === '{token}' || data.token !== app.get('mobileApp').initialToken) {
				log.info(`[Appauth][register] initial token not present or wrong. Stopping the registration process...`);
				err.statusCode = 401;
				err.message = 'initial token not set or wrong';

				return cb(err);
			}

			if (!data.uuid || typeof data.uuid !== 'string') {
				log.info(`[Appauth][register] uuid not present or wrong. Stopping the registration process...`);
				err.statusCode = 404;
				err.message = 'uuid token not set or wrong';
			}

			//we are sure here that service was call by an app. I generate now the app data for the User model.
			let user = {};
			user = extend(true, user, data);
			delete user.token;
			user.email = data.uuid + app.get('mobileApp').emailSuffix;
			user.password = app.get('mobileApp').password;
			user.group = app.get('mobileApp').group;
			user.realm = app.get('mobileApp').realm;

			log.info(`[Appauth][register] App id for the mobile app generated. Registering the app...`);

			app.models.users.create(user, (err, userInstance) => {
			    if (err) {
			    	err.statusCode = 500;
			    	err.message = 'Internal server error during app registration';
			    	log.error(`[Appauth][register] Internal server error during app registration: ${err}`);
			    	return cb(err); 
			    }
			    log.info(`[Appauth][register] Mobile app registered with success. App id is ${userInstance.appId}`);
			    return cb(null, {results: 'ok'});
			});
		};

		//------------------------------------------------------------------------------------------------------------------------------

		/**
		 * The service takes the app id furnished by the mobile application, extract the user from the users collection, 
		 * then execute the login and returns the Loopback access token.
		 */
		Appauth.login = (data, cb) => {
			log.info(`[Appauth][login] received app mobile login request. Processing...`);
			let err = new Error();

			if (!data.uuid || data.uuid === '{appId}') {
				log.info(`[Appauth][login] application id not present. Stopping the login process...`);
				err.statusCode = 401;
				err.message = 'uuid id not set';

				return cb(err);
			}

			//I extract here the user from the collection

			/* Promises declaration */
			let user = (uuid) => {
				let userPromise = new Promise((resolve, reject) => {
					app.models.users.findOne({where:{uuid: uuid}}, (err, user) => {
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

			user(data.uuid)
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
						access_token: token
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
