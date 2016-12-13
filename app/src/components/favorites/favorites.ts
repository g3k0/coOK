import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RecipesListPage } from '../recipes-list/recipes-list';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
  providers: [
  	RecipesListPage
  ]
})
export class FavoritesPage {

  constructor(public navCtrl: NavController) {

  }

}
