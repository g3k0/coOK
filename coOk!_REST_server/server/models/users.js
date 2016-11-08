/**
 * CoOK REST server services.
 * @model: Users
 * @author: Christian Palazzo
 * @date: 2016 11 08
 */

(function () {
	'use strict';

	/**
	 * Module dependencies
	 */
	/*let log = require(`${__base}/lib/logging`);
	let path = require('path');*/

	module.exports = (Users) => {
		//send verification email after registration
	    /*Users.afterRemote('create', (context, user, next) => {
	    	log.info('[Users][create] user.afterRemote triggered');

	    	let options = {
	            type: 'email',
	            to: user.email,
	            from: 'noreply@cook.com',
	            subject: 'Grazie per la registrazione.',
	            template: path.resolve(`${__base}server/views/verify.ejs`),
	            redirect: '/verified',
	            user: user
	        };

	    	user.verify(options, (err, response) => {
	     		if (err) {
	        		User.deleteById(user.id);
	        		return next(err);
	      		}

	      		log.info(`[Users][verify]verification email sent: ${response}`);

	      		context.res.render('response', {
	        		title: 'Signed up successfully',
	        		content: 'Per favore controlla la tua casella email email e clicca sullink di verifica prima di effettuare la log in.',
	        		redirectTo: '/',
	        		redirectToLinkText: 'Log in'
	      		});
	   		});
	  	});*/
	};
})();
