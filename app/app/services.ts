import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {File} from "ionic-native";
import 'rxjs/Rx';

@Injectable()
export class DataService {

  http: any;

  constructor(http: Http) {
    this.http = http;
  }

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

      console.log(cordova);

      /*cordova object should be available only on a device/emulator*/
      File.createDir(cordova.file.applicationDirectory, 'coOk_test',true)
      .then( 
        () => console.log('yay')
      ).catch(
        err => console.log(err)
      );

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
    return;
  }
}

