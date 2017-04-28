import {Injectable} from '@angular/core';
import {SQLite} from 'ionic-native';

@Injectable()
export class SingletonClass {

  private static instance: SingletonClass;

  constructor(){
 
  }


  public openDB(callback) {

      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(()=>{
          return callback(db);
      });
  }


  public static getInstance() {

      if(SingletonClass.instance) {
        console.log("already have an instance");
        return SingletonClass.instance;
      }
      else {
        SingletonClass.instance = new SingletonClass();
        console.log("created an instance");
        return SingletonClass.instance;
      }
  }
}