import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Device} from 'ionic-native';
import {SQLite} from 'ionic-native';
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
  // TO DO 
  retrieveAccessToken() {
    let retrieveAccessTokenPromise = new Promise((resolve, reject) => {
      return resolve('mocktocken');
    });
    return retrieveAccessTokenPromise;
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Register the app to the back end services 
   */
  register() {
    let registerPromise = new Promise((resolve, reject) =>{
      /*let self = this;
      this.retrieveConfig((config) => {
        self.deviceData = Device.device;
        self.deviceData.token = config.token;
        this.http.post(config.authAPI.register, self.deviceData)
        .map((res) => {
          if (res.result === 'ok') {
            return resolve();
          }
          let err = new Error();
          err.status = 500;
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
    return registerPromise;
  }

  /**
   * Log in the app to the back end services
   */
  login() {
    let loginPromise = new Promise((resolve, reject) => {
      /*let self = this;
      this.retrieveConfig((config) => {
        this.http.post(config.authAPI.register, {uuid: Device.device.uuid})
        .map((res) => {
          if (res.access_token) {
            return resolve(res.access_token);
          }
          let err = new Error();
          err.status = 500;
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
    return loginPromise;
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * App authentication
   */
  authentication() {
    let authenticationPromise = new Promise((resolve, reject) => {
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
          db.executeSql('CREATE TABLE IF NOT EXISTS system (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)', {})
          .then((system) => {
              console.log('TABLE CREATED: ', system);

              /*first app init, I call registration method, insert the record, then login*/
              if (!system.rows) {
                this.register()
                  .then(() => {
                    //Now I create the other SQLite tables I need
                    db.executeSql(`
                      CREATE TABLE IF NOT EXISTS favorites (
                      id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT,
                      type TEXT,
                      mainIngredient TEXT,
                      persons INTEGER,
                      notes TEXT,
                      ingredients TEXT,
                      preparation TEXT
                    )`, {})
                    .then(() => {
                      db.executeSql(`CREATE TABLE IF NOT EXISTS calendar (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        day TEXT,
                        data BLOB
                      )`, {})
                      .then(() => {
                        //tables created, now log in the application and store of the token
                        this.login()
                        .then((access_token) =>{
                          db.executeSql(`
                            INSERT INTO system (key, value)
                            VALUES ('access_token', '${access_token}')
                          `, {}).then(() => {
                              db.close().then(() => {
                                return resolve();
                              }).catch((error) => {
                                console.error('unable to close the database', error);
                                return reject(error);
                              });
                          }, (error) => {
                            console.error('Unable to save the access token', error);
                            return reject(error);
                          });
                        })
                        .catch(error => {
                          console.error('Unable to log in the application', error);
                          return reject(error);
                        })
                      }, (error) => {
                        console.error('Unable to execute sql', error);
                        return reject(error);
                      })

                    }, (error) => {
                      console.error('Unable to execute sql', error);
                      return reject(error);
                    });
                  })
                  .catch(error => {
                    console.error('Unable to register the application', error);
                    return reject(error);
                  })

              /*app is already registered, only login here*/                  
              } else {
                this.login()
                .then((access_token) =>{
                  db.executeSql(`
                    UPDATE system 
                    SET value = '${access_token}' 
                    WHERE key = 'access_token'
                  `, {}).then(() => {
                      db.close().then(() => {
                        return resolve();
                      }).catch((error) => {
                        console.error('unable to close the database', error);
                        return reject(error);
                      });
                  }, (error) => {
                    console.error('Unable to save the access token', error);
                    return reject(error);
                  });
                })
                .catch(error => {
                  console.error('Unable to log in the application', error);
                  return reject(error);
                })
              }

          }, (error) => {
              console.error('Unable to execute sql', error);
              return reject(error);
          })
      }, (error) => {
          console.error('Unable to open database', error);
          return reject(error);
      });
    });
    return authenticationPromise;
  }

  /*--------------------------------------------------------------------------------------------------------------*/
  
  /**
   * Get the favorites recipes saved by the user
   * @param {Function} cb callback function
   */
  retrieveFavorites(cb) {
    this.http.get('./favorites.json')
    .subscribe(data => {
      return cb(data.json());
    });
  }

  /**
   * Delete a recipe from the favorites file
   * @param {number} index array index of the recipe to delete
   */
  deleteFavorite(index:number) {
    this.http.get('./favorites.json')
    .subscribe(data => {
      let favorites = data.json();
      let newFavorites = [];
      newFavorites = favorites.splice(index, 1);
      //TO DO- complete
      return;

    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Get the calendar JSON
   * @param {Function} cb callback function
   */
  retrieveCalendar(cb) {
    this.http.get('./calendar.json')
    .subscribe(data => {
      return cb(data.json());
    });
  }

  /**
   * Delete a recipe from the calendar file
   * @param {number} index array index of the recipe to delete
   */
  deleteCalendarRecipe(index:number) {
    console.log(index);
    //TO DO - complete
    return;
  }
}