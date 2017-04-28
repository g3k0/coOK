import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Device, AdMob} from 'ionic-native';
import {DBSingletonClass} from './database';
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
    this.http.get('./config.json')
    .subscribe(data => {
      return cb(data.json());
    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Register the app to the back end services 
   */
  register() {
    return new Promise((resolve, reject) =>{
      let self = this;
      this.retrieveConfig((config) => {
        self.deviceData = Device.device;
        self.deviceData.token = config.token;
        self.http.post(config.authAPI.register, self.deviceData)
        .subscribe((data) => {
          let res = data.json();
          if (res.results === 'ok') {
            return resolve();
          }
          let err = new Error();
          err.message = 'There was an error on registering the app';
          console.error(`[register] Unable to register the application: ${JSON.stringify(err)}`);
          return reject(err);
        });
      });
    });
  }

  /**
   * Log in the app to the back end services
   */
  login() {
    return new Promise((resolve, reject) => {
      let self = this;
      this.retrieveConfig((config) => {
        self.http.post(config.authAPI.login, {uuid: Device.device.uuid})
        .subscribe((data) => {
          let res = data.json();
          if (res.access_token) {
            return resolve(res.access_token);
          }
          let err = new Error();
          err.message = 'There was an error on logging the app';
          console.error(`[login] Unable to log in the application: ${JSON.stringify(err)}`);
          return reject(err);
        });
      });
    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * App authentication
   */
  authentication() {
    return new Promise((resolve, reject) => {

      DBSingletonClass.getInstance((instance) => {
        instance.db.executeSql(`CREATE TABLE IF NOT EXISTS system (id INTEGER PRIMARY KEY AUTOINCREMENT, key VARCHAR(255), value VARCHAR(255))`, {})
        .then((system) => {
          /*first app init, I call registration method, insert the record, then login*/
          if (!system.rows.length) {
            this.register()
              .then(() => {
                this.login()
                .then((access_token) =>{
                  instance.db.executeSql(`
                    INSERT INTO system 
                    (key, value) 
                    VALUES ('access_token', '${access_token}')
                  `, [])
                  .then(() => {
                    return resolve();
                  });
                });
              });
            /*app is already registered, only login here*/                  
            } else {
              this.login()
              .then((access_token) =>{
                instance.db.executeSql(`
                  UPDATE system 
                  SET value = '${access_token}' 
                  WHERE key = 'access_token'
                `, [])
                .then(() => {
                  return resolve();
                });
              });
            }
        });
      });
    });
  }

  /*--------------------------------------------------------------------------------------------------------------------*/

  /**
   * Display an advertisment banner for Android devices
   */
  adBanner() {
    return new Promise((resolve, reject) => {
      if(AdMob && Device.device.platform === 'Android') {
        this.retrieveConfig(config => {
          AdMob.createBanner({
            adId: config.adMob.banner.id.adIdPublication,
            adSize: config.adMob.banner.appearance.adSize,
            isTesting: config.adMob.banner.appearance.isTesting,
            autoShow: config.adMob.banner.appearance.autoShow
          })
          .then(() => {
            //check "https://github.com/floatinghotpot/cordova-admob-pro/wiki/1.2-Method:-AdMob.setOptions()"
            AdMob.showBanner(config.adMob.banner.appearance.position);
            return resolve();
          });
        });
      } else {
        let error = new Error();
        error.message = 'Impossible to show the banner';
        return reject(error);
      }
    });
  }
}