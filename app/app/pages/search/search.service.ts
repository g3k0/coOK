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
	          url += `?access_token=${access_token}`

	          if (ingredients && ingredients.length) {
	            url += `&filter[where][ingredients][regexp]=/`;

	            for (let ingredient of ingredients) {
	              url += `(?=.*?${ingredient})`;
	            }

	            url += `/i`;
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
	          
	          this.http.get(url)
	          .subscribe(data => {
	            return resolve(data.json());
	          });
	        })
	        .catch((error) => {
	          console.error(`[getRecipes] Error: ${JSON.stringify(error)}`);
	          return reject(error);
	        });
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