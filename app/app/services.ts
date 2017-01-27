import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Device} from 'ionic-native';
import {DeviceData} from './interfaces';
import {SQLite} from 'ionic-native';
import 'rxjs/Rx';

@Injectable()
export class DataService {

  private http: any;
  private deviceData: DeviceData;

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
              return resolve()

              /*first app init, I insert the record, then registration and login*/
              //if (!system.rows) {
              
              /*app is already registered, only login here*/                  
              //} else {

              //}

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
   * It calls the internal db and check if the app is already registered
   */
  isRegistered():boolean {
    return false
  }

  /**
   * Register the app to the back end services 
   * 
   */
  //TO DO - implemment the register and login services
  register() {
    var self = this;
    this.retrieveConfig(function(config) {
      //this.deviceData = Device.device;
      self.deviceData = {
        available: true,
        platform: "Android",
        version: "5.0",
        uuid: "d57593a7fc301e5f",
        cordova: "6.0.0",
        model: "ASUS_ZooAD",
        manufacturer: "asus",
        isVirtual: false, 
        serial: "F6AZFGo84541"
      }
      self.deviceData.token = config.token;
      //TO DO - call back end register
      return console.log(self.deviceData);
    });
  }

  /**
   * Log in the app to the back end services
   */
  login() {

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