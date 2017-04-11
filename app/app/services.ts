import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Device, SQLite, AdMob} from 'ionic-native';
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