/**
 * Root file. Executed at app boot
 * @author: Christian Palazzo
 * @date: 2016 11 08
 */

(function () {
	'use strict'

	/**
	 * Module dependencies
	 */
	let auth = require('./handlers/auth');
	let log = require(`${__base}/lib/logging`);
	let bodyParser = require('body-parser');
	let common = require('./handlers/common');
	let cookieSession = require('cookie-session');

	module.exports = (server) => {
		/*
		 * body parser middleware for custom services
		 */
	    server.use(bodyParser.json());       // to support JSON-encoded bodies
	    server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	      extended: true
	    }));

		/*
		 * Initialize session middleware
		 */
		server.use(cookieSession({
	    	secret: server.get('cookieSecret')
	    }));

		// Install a `/` route that returns server status
		let router = server.loopback.Router();

		/*
		 * User authentication routes
		 */
		router.get('/', auth.home);
		router.post('/login', auth.login);
		router.get('/logout', auth.logout);

		router.get('/', server.loopback.status());
		server.use(router);
	};
})();