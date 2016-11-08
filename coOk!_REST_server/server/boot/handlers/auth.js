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

	let User = app.models.user;

	let home = (req, res, next) => {
		let credentials = dsConfig.emailDs.transports[0].auth;
	    res.render('login', {
	      email: '',
	      password: ''
	    });
	};

	let login = (req, res, next) => {
		User.login({
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
		if (!req.accessToken) return res.sendStatus(401);

	    User.logout(req.accessToken.id, (err) => {
	      if (err) return next(err);
	      res.redirect('/');
	    });
	};

	/**
	 * Functions exports
	 */
	module.exports.login = login;
	module.exports.logout = logout;
	module.exports.home = home;
})();