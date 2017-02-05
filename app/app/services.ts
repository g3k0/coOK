import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Device} from 'ionic-native';
import {SQLite} from 'ionic-native';
import {Recipe} from './interfaces';
import 'rxjs/Rx';

@Injectable()
export class DataService {

  private http: any;
  private deviceData: any;

  constructor(
    http: Http
  ) {
    this.http = http;
    this.deviceData = {
      token: '',
      available: false,
      platform: '',
      version: '',
      uuid: '',
      cordova: '',
      model: '',
      manufacturer: '',
      isVirtual: false, 
      serial: ''
    };
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Get the configuration file 
   * @param {Function} cb configuration callback function
   */
  retrieveConfig(cb) {
    this.http.get('./config.development.json')
    .subscribe(data => {
      return cb(data.json());
    });
  }

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
   * Register the app to the back end services 
   */
  register() {
    return new Promise((resolve, reject) =>{
      /*this.retrieveConfig((config) => {
        this.deviceData = Device.device;
        this.deviceData.token = config.token;
        this.http.post(config.authAPI.register, this.deviceData)
        .map((res) => {
          if (res.result === 'ok') {
            return resolve();
          }
          let err = new Error();
          err.statusCode = 500;
          err.message = 'There was an error on registering the app';
          log.error('Unable to register the application',err);
          return reject(err);
        })
        .catch((err) => {
          log.error('Unable to register the application',err);
          return reject(err);
        });
      });*/
      return resolve();
    });
  }

  /**
   * Log in the app to the back end services
   */
  login() {
    return new Promise((resolve, reject) => {
      /*this.retrieveConfig((config) => {
        this.http.post(config.authAPI.register, {uuid: Device.device.uuid})
        .map((res) => {
          if (res.access_token) {
            return resolve(res.access_token);
          }
          let err = new Error();
          err.statusCode = 500;
          err.message = 'There was an error on logging the app';
          log.error('Unable to log in the application',err);
          return reject(err);
        })
        .catch((err) => {
          log.error('Unable to log in the application',err);
          return reject(err);
        });
      });*/
      return resolve('mocktoken')
    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * App authentication
   */
  authentication() {
    return new Promise((resolve, reject) => {
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      })
      .then(() => {
        db.executeSql(`CREATE TABLE IF NOT EXISTS system (id INTEGER PRIMARY KEY AUTOINCREMENT, key VARCHAR(255), value VARCHAR(255))`, {})
        .then((system) => {
          console.log('TABLE CREATED: ', system);

          /*first app init, I call registration method, insert the record, then login*/
          if (!system.rows.length) {
            this.register()
              .then(() => {
                //Now I create the other SQLite tables I need
                db.executeSql(`
                  CREATE TABLE IF NOT EXISTS favorites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    name VARCHAR(255), 
                    type VARCHAR(255), 
                    mainIngredient VARCHAR(255), 
                    persons INTEGER, 
                    notes VARCHAR(255), 
                    ingredients VARCHAR(255), 
                    preparation VARCHAR(255),
                    CONSTRAINT constraint_name UNIQUE (name)
                  )`
                , {})
                .then(() => {
                  db.executeSql(`
                    CREATE TABLE IF NOT EXISTS calendar (
                      id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      day CHARACTER(20), 
                      meals BLOB
                    )`
                  , {})
                  .then(() => {
                    let meals = '[{"name":"pranzo","recipes": []},{"name": "cena","recipes": []}]'
                    db.executeSql(`
                      INSERT INTO calendar
                      (day,meals)
                      VALUES
                      ('lunedi', '${meals}'),
                      ('martedi', '${meals}'),
                      ('mercoledi', '${meals}'),
                      ('giovedi', '${meals}'),
                      ('venerdi', '${meals}'),
                      ('sabato', '${meals}'),
                      ('domenica', '${meals}')
                    `, []).then(() => {
                      //tables created, now log in the application and store of the token
                      this.login()
                      .then((access_token) =>{
                        db.executeSql(`
                          INSERT INTO system 
                          (key, value) 
                          VALUES ('access_token', '${access_token}')
                        `, [])
                        .then(() => {
                          db.close().then(() => {
                            return resolve();
                          });
                        });
                      });
                    });
                  });
                });
              });
            /*app is already registered, only login here*/                  
            } else {
              this.login()
              .then((access_token) =>{
                db.executeSql(`
                  UPDATE system 
                  SET value = '${access_token}' 
                  WHERE key = 'access_token'
                `, [])
                .then(() => {
                  db.close().then(() => {
                    return resolve();
                  });
                });
              });
            }
        });
      })
      .catch((error) => {
        console.error(`[authentication] Error: ${JSON.stringify(error)}`);
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
    let getRecipesPromise = new Promise((resolve,reject) => {
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
          
          //this.http.get(uri)
          self.http.get('./mock.json')
          .subscribe(data => {
            return resolve(data.json());
          });
        })
        .catch((err) => {
          console.error(`${err}`);
          return reject(err);
        });
      });
    });
    return getRecipesPromise;
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Add a recipe retrieved from the search into the database
   * @param {Recipe} a recipe object as declared in the interfaces file
   */
  addRecipeToFavorites(recipe:Recipe) {
    if (!recipe) return;

    
    let addRecipePromise = new Promise((resolve, reject) => {
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
        let name = recipe.name.replace(new RegExp("'", 'g'),"\"");
        let type = recipe.type.replace(new RegExp("'", 'g'),"\"");
        let mainIngredient = recipe.mainIngredient.replace(new RegExp("'", 'g'),"\"");
        let notes = recipe.notes.replace(new RegExp("'", 'g'),"\"");
        let preparation = recipe.preparation.replace(new RegExp("'", 'g'),"\"");

        let ingredients = [];
        for (let ingredient of recipe.ingredients) {
          let ing = ingredient.replace(new RegExp("'", 'g'),"\"")
          ingredients.push(ing);
        }

        db.executeSql(`
          INSERT INTO favorites
          (name, type, mainIngredient, persons, notes, ingredients, preparation)
          VALUES ('${name}',
                  '${type}',
                  '${mainIngredient}',
                  '${recipe.persons}',
                  '${notes || ''}',
                  '${ingredients}',
                  '${preparation}'
          )
        `,[])
        .then(()=>{
          db.close().then(() => {
            console.log('recipe was inserted into the database');
            return resolve();
          }).catch((error) => {
            console.error('unable to close the database', error);
            return reject(error);
          });
        }, (error) => {
          console.error('Unable to execute sql', error);
          return reject(error);
        });
      }, (error) => {
          console.error('Unable to open database', error);
          return reject(error);
      });
    });
    return addRecipePromise;
  }

  /*--------------------------------------------------------------------------------------------------------------*/  
  
  /**
   * Get the favorites recipes saved by the user
   */
  retrieveFavorites() {
    let retrieveFavoritesPromise = new Promise((resolve, reject) =>{
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
        db.executeSql(`SELECT 
          name,
          type,
          mainIngredient,
          persons,
          notes,
          ingredients,
          preparation 
          FROM favorites
        `,[]).then((data) => {
            let recipes = data.rows.length;
            let rv:Recipe[] = new Array(recipes);
            for (let i = 0; i < recipes; i++) {
              let recipe:any = data.rows.item(i);
              rv[i] = {
                name: recipe.name.replace(new RegExp("\"", 'g'),"'"), 
                type: recipe.type.replace(new RegExp("\"", 'g'),"'"), 
                mainIngredient: recipe.mainIngredient.replace(new RegExp("\"", 'g'),"'"),
                persons: recipe.persons,
                notes: recipe.notes.replace(new RegExp("\"", 'g'),"'"),
                ingredients: recipe.ingredients.replace(new RegExp("\"", 'g'),"'").split(','),
                preparation: recipe.preparation.replace(new RegExp("\"", 'g'),"'")
              };
            }

            db.close().then(() => {
              console.log('recipe was inserted into the database');
              return resolve(rv);
            }).catch((error) => {
              console.error('unable to close the database', error);
              return reject(error);
            });
        }, (error) => {
          console.error('Unable to execute sql', error);
          return reject(error);
        });
      },(error) => {
        console.error('Unable to open database', error);
        return reject(error);
      });
    });
    return retrieveFavoritesPromise;
  }

  /**
   * Delete a recipe from the favorites file
   * @param {string} recipe name to delete
   */
  deleteFavorite(name:string) {
    let deleteFavoritePromise = new Promise((resolve, reject) => {
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
        db.executeSql(`
          DELETE FROM favorites
          WHERE name = '${name}'
        `,[]).then(()=>{
          db.close().then(() => {
            console.log('recipe was deleted from the database');
            return resolve();
          }).catch((error) => {
            console.error('unable to close the database', error);
            return reject(error);
          });
        }, (error) => {
          console.error('Unable to execute sql', error);
          return reject(error);
        });
      }, (error) => {
        console.error('Unable to open database', error);
        return reject(error);
      });
    });
    return deleteFavoritePromise;
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Get the calendar JSON
   */
  retrieveCalendar() {
    let retrieveCalendarPromise = new Promise((resolve, reject) => {
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
        db.executeSql(`
          SELECT day, meals
          FROM calendar
        `, []).then((data) => {
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
          }).catch((error) => {
            console.error('unable to close the database', error);
            return reject(error);
          });
        }, (error) => {
          console.error('Unable to execute sql', error);
          return reject(error);
        })
      }, (error) => {
        console.error('Unable to open database', error);
        return reject(error);
      });
    });
    return retrieveCalendarPromise;
  }

  /**
   * Add a recipe to the calendar table
   * @param {string} the day selected by the user
   * @param {string} the meal selected by the user
   * @param {Recipe} the recipe to add
   */
  addRecipeToCalendar(day:string, meal:string, recipe:Recipe) {
    let addRecipeToCalendarPromise = new Promise((resolve, reject) => {
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
          `,[]).then(() => {
            db.close().then(() => {
              return resolve();
            }).catch((error) => {
              console.error('unable to close the database', error);
              return reject(error);
            });
          }, (error) => {
            console.error('Unable to execute sql', error);
            return reject(error);
          });
        }, (error) => {
          console.error('Unable to execute sql', error);
          return reject(error);
        });
      }, (error) => {
        console.error('Unable to open database', error);
        return reject(error);
      });
    });
    return addRecipeToCalendarPromise;
  }
  

  /**
   * Delete a recipe from the calendar file
   * @param {string} the day where from to delete the recipe
   * @param {string} the meal where from to delete the recipe
   * @param {string} the recipe name to delete from calendar
   */
  deleteCalendarRecipe(day:string, meal:string, recipeName:string) {
    let deleteCalendarRecipePromise = new Promise((resolve, reject) => {
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
            }).catch((error) => {
              console.error('unable to close the database', error);
              return reject(error);
            });
          }, (error) => {
            console.error('Unable to execute sql', error);
            return reject(error);
          });
        }, (error) => {
          console.error('Unable to execute sql', error);
          return reject(error);
        });
      }, (error) => {
        console.error('Unable to open database', error);
        return reject(error);
      });
    });
    return deleteCalendarRecipePromise;
  }
}