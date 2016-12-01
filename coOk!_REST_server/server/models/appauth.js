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

			if (!token || token !== app.get('mobileApp').initialToken) {
				log.info(`[Appauth][register] initial token not present or wrong. Stopping registration process...`);
				err.statusCode = 401;
				err.message = 'initial token not set or wrong';

				return cb(err);
			}

			//we are sure here that service was call by an app. I generate now the app data for the User model.
			let user = {
				email: '',
				password: 'mobileApp',
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
	};
})();
