import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
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
   * Delete a recipe from the favorites file
   * @param {number} index array index of the recipe to delete
   * @param {string} file  file name where the favorites are saved
   */
  delete(index:number, file:string) {
    console.log(index);
    return;
  }


}

