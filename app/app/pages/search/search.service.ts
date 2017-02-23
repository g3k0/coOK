import {Injectable} from '@angular/core';
import {SQLite} from 'ionic-native';
import {Http} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class SearchService {
	private http: any;

	constructor (
		http: Http
	) {
		this.http = http;
	}

	/**
	 * Get the configuration file 
	 * @param {Function} cb configuration callback function
	 */
	retrieveConfig(cb) {
	    this.http.get('./config.json')
	    .subscribe(data => {
	      return cb(data.json());
	    });
	}

    /*--------------------------------------------------------------------------------------------------------------*/

	/**
	 * Get the access_token needed for authenticated calls to the back end services
	 */
	retrieveAccessToken() {
	    return new Promise((resolve, reject) => {
	      let db = new SQLite();
	      let access_token = '';
	      db.openDatabase({
	          name: 'data.db',
	          location: 'default'
	      }).then(() => {
	        db.executeSql(`SELECT key, value FROM system WHERE key = 'access_token'`
	          , []).then((data) => {
	            if (!data.rows.length) {
	              return reject('data not found');
	            }
	            for(var i = 0; i < data.rows.length; i++) {
	                access_token = data.rows.item(i).value;
	            }
	            db.close().then(() => {
	              return resolve(access_token);
	            });
	          });
	      })
	      .catch((error) => {
	        console.error(`[retrieveAccessToken] Error: ${JSON.stringify(error)}`);
	        return reject(error);
	      });
	    });
	}

	/*--------------------------------------------------------------------------------------------------------------*/

	/**
	 * Get the recipes returned from a call to the recipes back end service
	 * @param {string[]} ingredients array pushed by the user
	 * @param {Object} filters objet setted by the user
	 */

	getRecipes(ingredients:string[]=[''],filters:any={}) {
	    return new Promise((resolve,reject) => {
	      let self = this;
	      this.retrieveConfig((config) => {
	        let url = config.authAPI.recipes;
	        self.retrieveAccessToken()
	        .then((access_token) => {
	          url += `?access_token=${access_token}`;

						self.getData(ingredients,filters,url).then( (data) => {
							console.log("end");
							return resolve(data);
						});

	        })
	        .catch((error) => {
	          console.error(`[getRecipes] Error: ${JSON.stringify(error)}`);
	          return reject(error);
	        });
	      });
	    });
	}

	getRecipeUrl(ingredients:string[]=[''],filters:any={},url:string='') {

		if(ingredients && ingredients.length) {
    	let ingredientFilterCounter = 0;
      for (let ingredient of ingredients) {
      	url += `&filter[where][and][${ingredientFilterCounter}][ingredients][regexp]=/(?=.* ${ingredient} .*)/i`;
      	ingredientFilterCounter++;	             
      }
    }

    url += `&filter[limit]=100`;

    if (filters && filters.recipeName) {
      url += `&filter[where][name]=${filters.recipeName}`;
    }

    if (filters && filters.mainIngredient) {
      url += `&filter[where][mainIngredient]=${filters.mainIngredient}`;
    }

    if (filters && filters.recipeType && filters.recipeType.length) {
      for (let type of filters.recipeType) {
        url += `&filter[where][type]=${type}`;
      }
    }

		return url; 
	}




  getData(ingredients:string[]=[''],filters:any={},url:string='') {
  	return new Promise((resolve,reject) => {
			this.http.get(this.getRecipeUrl(ingredients,filters,url))
			.subscribe(result => {
				if(result.json().length > 0) {
					console.log(result.json().length);

					return resolve(result.json());
				} else {
					let newIngredients = ingredients.slice(0, ingredients.length - 1);
					console.log(newIngredients);

					this.getData(newIngredients,filters,url).then ( (data) =>{
						return resolve(data);
						});
				}
			});

  	});
  }


	/*
	 * Return a string to display if the recipe search has no results
	 * {Function} a callback function
	 */
	displaySentence(cb) {
		this.retrieveConfig((config) => {
			let sentences:string[] = config.noRecipesFoundSentences; 
			return cb(sentences[Math.floor(Math.random()*sentences.length)]);
		});
	}
}