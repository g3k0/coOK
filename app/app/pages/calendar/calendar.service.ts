import {Injectable} from '@angular/core';
import {SQLite} from 'ionic-native';
import {Recipe} from '../../interfaces';
import 'rxjs/Rx';

@Injectable()
export class CalendarService {
	constructor () {

	}

	/**
     * Get the calendar JSON
     */
    retrieveCalendar() {
        return new Promise((resolve, reject) => {
            let db = new SQLite();
            db.openDatabase({
                name: 'data.db',
                location: 'default'
            }).then(() => {
        		db.executeSql(`
          			SELECT day, meals
          			FROM calendar
        		`, [])
        		.then((data) => {
          			let calendar:any[] = new Array();
          			for (let i = 0; i < 7; i++) {
            			let day:any = data.rows.item(i);
            			let item = {
	              			day: day.day,
	              			meals: JSON.parse(day.meals)
	            		}
			            for (let k = 0; k < item.meals.length; k++) {
			              if (item.meals[k].recipes.length) {
			                for (let j = 0; j < item.meals[k].recipes.length; j++) {
			                  let recipe = item.meals[k].recipes[j];
			                  recipe.name = recipe.name.replace(new RegExp("\"", 'g'),"'"); 
			                  recipe.type = recipe.type.replace(new RegExp("\"", 'g'),"'"); 
			                  recipe.mainIngredient = recipe.mainIngredient.replace(new RegExp("\"", 'g'),"'");
			                  recipe.notes = recipe.notes.replace(new RegExp("\"", 'g'),"'");
			                  recipe.preparation = recipe.preparation.replace(new RegExp("\"", 'g'),"'");

			                  for (let y=0; y < recipe.ingredients.length; y++) {
			                    recipe.ingredients[y] = recipe.ingredients[y].replace(new RegExp("\"", 'g'),"'");
			                  }
			                }
			              }
			            }
	            		calendar.push(item);
	          		}
	          		db.close().then(() => {
	           			return resolve(calendar);
	          		});
        		});
        	})
        	.catch((error) => {
        		console.error(`[retrieveCalendar] Error: ${JSON.stringify(error)}`);
        		return reject(error);
        	});
    	});
  	}

  	/*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Add a recipe to the calendar table
   * @param {string} the day selected by the user
   * @param {string} the meal selected by the user
   * @param {Recipe} the recipe to add
   */
  addRecipeToCalendar(day:string, meal:string, recipe:Recipe) {
    return new Promise((resolve, reject) => {
    	let db = new SQLite();
       	db.openDatabase({
         	name: 'data.db',
            location: 'default'
      	}).then(() => {
        	db.executeSql(`
          		SELECT day, meals
          		FROM calendar
          		WHERE day = '${day}'
        	`, [])
        	.then((data) => {
          		let calendarDay:any = data.rows.item(0);
          		let item:any = {
            		day: calendarDay.day,
            		meals: JSON.parse(calendarDay.meals)
          		};
          		let newRecipe:Recipe = {
            		name: recipe.name.replace(new RegExp("'", 'g'),"\""),
            		type: recipe.type.replace(new RegExp("'", 'g'),"\""),
            		mainIngredient: recipe.mainIngredient.replace(new RegExp("'", 'g'),"\""),
            		notes: recipe.notes.replace(new RegExp("'", 'g'),"\""),
            		ingredients: [],
            		persons: recipe.persons,
            		preparation: recipe.preparation.replace(new RegExp("'", 'g'),"\"")
          		};
          		for (let i=0; i < recipe.ingredients.length; i++) {
            		newRecipe.ingredients.push(recipe.ingredients[i].replace(new RegExp("'", 'g'),"\""));
          		}	
          		for (let k=0; k < item.meals.length; k++) {
            		if (item.meals[k].name === meal) {
              			item.meals[k].recipes.push(newRecipe);
            		}
          		}
          		db.executeSql(`
            		UPDATE calendar 
            		SET meals = '${JSON.stringify(item.meals)}' 
            		WHERE day = '${day}'
          		`,[])
          		.then(() => {
            		db.close().then(() => {
              			return resolve();
            		});
          		});
        	});
        })
        .catch((error) => {
        	console.error(`[addRecipeToCalendar] Error: ${JSON.stringify(error)}`);
        	return reject(error);
      });
    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/
  
  /**
   * Delete a recipe from the calendar file
   * @param {string} the day where from to delete the recipe
   * @param {string} the meal where from to delete the recipe
   * @param {string} the recipe name to delete from calendar
   */
    deleteCalendarRecipe(day:string, meal:string, recipeName:string) {
    	return new Promise((resolve, reject) => {
      		let db = new SQLite();
       		db.openDatabase({
          		name: 'data.db',
          		location: 'default'
      		}).then(() => {
        		db.executeSql(`
          			SELECT day, meals
          			FROM calendar
          			WHERE day = '${day}'
       	 		`, [])
        		.then((data) => {
          			let calendarDay:any = data.rows.item(0);
          			let item:any = {
           		 		day: calendarDay.day,
            			meals: JSON.parse(calendarDay.meals)
          			};
          			for (let i=0; i < item.meals.length; i++) {
            			if (!item.meals[i].recipes.length) {
              				db.close().then(() => {
                				return resolve();
              				}).catch((error) => {
                				console.error('unable to close the database', error);
                				return reject(error);
              				});
            			}
            			if (item.meals[i].name === meal) {
               				for (let k = 0; k < item.meals[i].recipes.length; k++) {
                 				if (item.meals[i].recipes[k].name.replace(new RegExp("\"", 'g'),"'") === recipeName) {
                   					item.meals[i].recipes.splice(k,1);
                 				}
               				}
            			}
          			}
          			db.executeSql(`
            			UPDATE calendar 
            			SET meals = '${JSON.stringify(item.meals)}' 
           				WHERE day = '${day}'
          			`,[])
          			.then(() => {
            			db.close().then(() => {
              				return resolve();
            			});
          			});
        		});
      		})
      		.catch((error) => {
        		console.error(`[deleteCalendarRecipe] Error: ${JSON.stringify(error)}`);
        		return reject(error);
      		});
    	});
  	}
}