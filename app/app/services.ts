import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class DataService {

  http: any;

  constructor(http: Http) {
    this.http = http;
  }

  retrieveData(cb) {
    this.http.get('./config.development.json')
    .subscribe(data => {
      return cb(data.json());
    });
  }
}

