import {Injectable} from '@angular/core';
import {SQLite} from 'ionic-native';

@Injectable()
export class DBSingletonClass {

  private static instance: DBSingletonClass;
  public db;

  constructor(cb){
    this.db = new SQLite();
    this.db.openDatabase({
      name: 'data.db',
      location: 'default'
    }).then(() => {
      this.db.executeSql(`
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
        this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS calendar (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            day CHARACTER(20), 
            meals BLOB
          )`
        , {})
        .then(() => {
          let meals = '[{"name":"pranzo","recipes": []},{"name": "cena","recipes": []}]'
          this.db.executeSql(`
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
            return cb(); 
          });
        });
      });
    });
  }

  public static getInstance(cb) {

    /*object already instantiated*/
    if(DBSingletonClass.instance) {
      return cb(DBSingletonClass.instance);

    /*instance not present*/
    } else {
      DBSingletonClass.instance = new DBSingletonClass(() => {
        return cb(DBSingletonClass.instance);
      });
    }
  }

}