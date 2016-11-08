/** 
 * File: auth.js
 * @author: Christian Palazzo
 * @date: 2016 11 08
 */

(function () {
	'use strict';

	/** 
	 * Module dependencies
	 */
	let app = require(`${__base}/server`);

	let User = app.models.users;

	let home = (req, res, next) => {
	    res.render('login', {
	    	name: '',
	    	surname: '',
	    	email: '',
	    	password: '',
	    	realm: ''
	    });
	};

	let login = (req, res, next) => {
		User.login({
			realm: req.body.realm,
	    	email: req.body.email,
	    	password: req.body.password
	    }, 'user', (err, token) => {
	    	if (err) {
	        	res.render('response', {
	        		title: 'Login failed',
	        		content: err,
	        		redirectTo: '/',
	        		redirectToLinkText: 'Try again'
	       		});
	        	return;
	      	}

	    	res.render('home', {
	        	email: req.body.email,
	        	accessToken: token.id
	      	});
	    });
	};

	let logout = (req, res, next) => {
		if (!req.query.access_token) return res.sendStatus(401);

	    User.logout(req.query.access_token, (err) => {
	    	if (err) return next(err);
	    	res.redirect('/');
	    });
	};

	let register = (req, res, next) => {
		User.create(req.body, (err,user) => {
			res.render('registered', {
				email: user.email
			});
		});
	};

	/**
	 * Functions exports
	 */
	module.exports.login = login;
	module.exports.logout = logout;
	module.exports.home = home;
	module.exports.register = register;
})();