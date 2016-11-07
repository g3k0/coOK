/**
 * @author: Christian PAlazzo
 * @date: 2016 November 04
 */

(function () {
	'use strict';

	class Common {
		constructor () {

		}

		validate(schema, inputData, success, failure) {
			if (!schema) throw new Error('[Common][validate] Error missing schema data.');
			if (!inputData) throw new Error('[Common][validate] Error missing input data.');

			let Ajv = require('ajv');
			let ajv = new Ajv();
			let validate = ajv.compile(schema);
			let valid = validate(inputData);
			if(!valid) return failure(JSON.stringify(validate.errors));
			return success();
		}

		convertTextToJSON(text, propertySeparator) {
			if (!text) throw new Error('[Common][convertTextToJSON] Error missing text data.');
			if (!propertySeparator) throw new Error('[Common][convertTextToJSON] Error missing propertySeparator data.');

			let arr = text.replace(/\r?/g,'').split('\n');

			let obj = {};
			let res = {};

			for (let i=0; i<arr.length; ++i) {
				if (arr[i].indexOf('-') > -1) {
					arr[i] = arr[i].replace('-','');
					if (arr[i+1].indexOf('=') === -1) {
						obj[arr[i]] = arr[i+1];
					} else {
						obj[arr[i]] = [];
					}
				}
			}
            
            for (let i=0; i<arr.length; ++i) {
            	if (arr[i].indexOf('=') > -1 || arr[i].indexOf('Di') > -1 &&  arr[i].indexOf('/') > -1) {
            		if (obj.Ingredienti && Array.isArray(obj.Ingredienti)) obj.Ingredienti.push(arr[i]);
            	}
            }


			if (obj[' ']) delete obj[' '];

			res.name = obj.Nome ? obj.Nome : null;
			res.type = obj.Tipo_Piatto ? obj.Tipo_Piatto : null;
			res.mainIngredient = obj.Ing_Principale ? obj.Ing_Principale : null;
			res.persons = obj.Persone ? parseInt(obj.Persone) : null;
			res.notes = obj.Note ? obj.Note : null;
			res.ingredients = obj.Ingredienti ? obj.Ingredienti : null;
			res.preparation = obj.Preparazione ? obj.Preparazione : null;

			if (res.notes === ' -') res.notes = '';

			return res;
		}

	}
	module.exports = Common;
})();