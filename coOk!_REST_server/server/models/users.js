/*jshint esversion: 6*/
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
	let Models = require(`${__base}/server`).models;
	let log = require(`${__base}/lib/logging`);

	module.exports = (Users) => {
		/*
	     * Update RoleMapping if Group is changed
	     */
	    Users.observe('before save', function updateRoleMapping (ctx, next) {

	    	if (!ctx.data) return next();
	   
	    	if (ctx.data.group !== ctx.currentInstance.group) {

	      		Models.RoleMapping.destroyAll({principalId:ctx.data.id}, (err, info) => {
	         		if (err) {
	          			err.message = 'can\'t  delete the RoleMapping associated to user';
	          			log.error(`[models][users] Error: can\'t  delete the RoleMapping associated to user ${JSON.stringify(ctx.where)}`);
	          			return next(err);
	        		}

	        		log.info(`[models][users] RoleMapping associated to user ${JSON.stringify(ctx.where)} deleted with success: ${JSON.stringify(info)}`);
	        		return next();
	      		});
	    	} else {
	      		return next();
	   	 	}
	  	});

	  	Users.observe('before save', function AddDate (ctx, next) {
	  		
	  		ctx.instance.date = new Date();
	  		return next();

	  	});

	    /*
	   	 * Map the user to the Loopback role based on his group
	     */
	    Users.observe('after save', function createRoleMapping (ctx, next) { 

	    	var instance = ctx.instance || ctx.data;

	    	if (!instance.group) {
	      		var err = new Error();
	      		err.status = 422;
	      		err.message = 'Error on mapping user to role: user is not assigned to a group';
	      		log.error('[models][users] Error on mapping user to role: user is not assigned to a group');
	      		return next(err);
	    	}

	   	 	if (ctx.currentInstance && instance.group === ctx.currentInstance.group) {
	      		return next();
	    	}

	    	Models.Role.findOrCreate({where: {name:instance.group}}, {name:instance.group}, (err, role) => {
	      		if (err) {
	        		err.message = 'Error on mapping user to role: can\'t instanciate the role';
	        		log.error('[models][user] Error on mapping user to role: can\'t instanciate the role');
	        		return next(err);
	      		}

	      		role.principals.create({
	        		principalType: Models.RoleMapping.USER,
	        		principalId: instance.id
	      		}, (err, principal) => {
	        		if (err) {
	          			err.message = 'Error on mapping user to role: can\'t create the role mapping';
	          			log.error('[models][user] Error on mapping user to role: can\'t create the role mapping');
	          			return next(err);
	        		}
	        		
	        		return next();
	      		});
	    	});
		});

	 	/*
		 * Delete the role mapping before to delete the user
		 */
		Users.observe('after delete', function deleteAssociatedRole (ctx, next) {
		   
			Models.RoleMapping.destroyAll({principalId:ctx.where.id}, (err, info) => {
		    	if (err) {
		        	err.message = 'can\'t  delete the RoleMapping associated to user';
		        	log.error(`[models][users] Error: can\'t  delete the RoleMapping associated to user ${JSON.stringify(ctx.where)}`);
		        	return next(err);
		      	}
		      	log.info(`[models][users] RoleMapping associated to user  ${JSON.stringify(ctx.where)} deleted with success: ${JSON.stringify(info)}`);
		      	return next();
		    });
		});
	};
})();
