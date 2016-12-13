import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CalendarDetailPage} from '../calendar-detail/calendar-detail'

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
  providers: [
  	CalendarDetailPage
  ]
})
export class CalendarPage {

  constructor(public navCtrl: NavController) {

  }

}
