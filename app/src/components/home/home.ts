import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RecipesListPage } from '../recipes-list/recipes-list';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
  	RecipesListPage
  ]
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

}
