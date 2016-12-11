import { Component } from '@angular/core';
import { RecipePage } from '../recipe/recipe';

@Component({
  selector: 'page-recipes-list',
  templateUrl: 'recipes-list.html',
  providers: [
  	RecipePage
  ]
})
export class RecipesListPage {

  constructor() {

  }

}