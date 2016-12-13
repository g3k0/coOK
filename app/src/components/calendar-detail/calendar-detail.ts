import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RecipesListPage } from '../recipes-list/recipes-list';

@Component({
  selector: 'page-calendar-detail',
  templateUrl: 'calendar-detail.html',
  providers: [
  	RecipesListPage
  ]
})
export class CalendarDetailPage {

  constructor(public navCtrl: NavController) {

  }

}