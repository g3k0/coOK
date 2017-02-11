import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {SQLite} from 'ionic-native';
import 'rxjs/Rx';

@Injectable()
export class RecipeService {
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
	 * It calls a back end service for the calculation of new ingredients quantities
	 * param {number} the new people number
	 * param {string} the recipe name
	 */
	ingredientsCalculation(persons:number, recipeName:string) {
		return new Promise((resolve, reject) => {
			let self=this;
			this.retrieveConfig((config) => {
				let url = config.authAPI.ingredientsCalculation;
				self.retrieveAccessToken()
				.then((access_token) => {
					url += `?access_token=${access_token}`
					self.http.post(url, {
						numberOfPerson:persons,
						recipeName: recipeName
					})
					.subscribe((data) => {
					  let res = data.json();
			          if (!res.ingredients) {
			          	let err = new Error();
			          	err.message = 'There was an error on recalculating the ingredients';
			          	return reject(err);
			          }
			          let response:string[] = res.ingredients
			          return resolve(response);
			        })

				});
			});
			/*mock*/
			//let res:string[] = ['mock 1', 'mock 2', 'mock 3'];
			//return resolve(res);
		});
	}
}