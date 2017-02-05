/**
 * CoOK REST server services.
 * @model: Recipes
 * @author: Christian Palazzo
 * @date: 2016 11 04
 */

(function () {
	'use strict';

	module.exports = (Recipes) => {
		//Disabilitation of all methods except find, findById and findOne
		Recipes.disableRemoteMethod("create", true);
		Recipes.disableRemoteMethod("upsert", true);
		Recipes.disableRemoteMethod("updateAll", true);
		Recipes.disableRemoteMethod("updateAttributes", false);
		 
		Recipes.disableRemoteMethod("find", false);
		Recipes.disableRemoteMethod("findById", false);
		Recipes.disableRemoteMethod("findOne", false);
		 
		Recipes.disableRemoteMethod("deleteById", true);
		 
		Recipes.disableRemoteMethod("confirm", true);
		Recipes.disableRemoteMethod("count", true);
		Recipes.disableRemoteMethod("exists", true);
		Recipes.disableRemoteMethod("resetPassword", true);
		Recipes.disableRemoteMethod("replaceOrCreate", true);
		Recipes.disableRemoteMethod("upsertWithWhere", true);
		Recipes.disableRemoteMethod('createChangeStream', true);
		Recipes.disableRemoteMethod('replaceOrCreate', true);
		Recipes.disableRemoteMethod('replaceById', true);
		 
		Recipes.disableRemoteMethod('__count__accessTokens', true);
		Recipes.disableRemoteMethod('__create__accessTokens', true);
		Recipes.disableRemoteMethod('__delete__accessTokens', true);
		Recipes.disableRemoteMethod('__destroyById__accessTokens', true);
		Recipes.disableRemoteMethod('__findById__accessTokens', true);
		Recipes.disableRemoteMethod('__get__accessTokens', true);
		Recipes.disableRemoteMethod('__updateById__accessTokens', true);
	};

})();
