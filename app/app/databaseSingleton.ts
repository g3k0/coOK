import {Injectable} from '@angular/core';
import {SQLite} from 'ionic-native';

@Injectable()
export class DBSingletonClass {

  private static instance: DBSingletonClass;
  private static db;

  constructor(){
    DBSingletonClass.db = new SQLite();
  }

  public openDB(callback) {

      DBSingletonClass.db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(()=>{
          return callback(DBSingletonClass.db);
      });
  }


  public static getInstance() {
     console.log(JSON.stringify(DBSingletonClass.db));
      if(DBSingletonClass.instance) {
        console.log("already have an instance");
        return DBSingletonClass.instance;
      }
      else {
        DBSingletonClass.instance = new DBSingletonClass();
        console.log("created an instance");
        return DBSingletonClass.instance;
      }
  }
}