import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CalendarDetailPage} from '../calendar-detail/calendar-detail'
import { RecipesListPage } from '../recipes-list/recipes-list';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
  providers: [
  	CalendarDetailPage,
  	RecipesListPage
  ]
})
export class CalendarPage {

  constructor(public navCtrl: NavController) {

  }

}
