import {Component, ViewChild} from '@angular/core';
import {ModalController, AlertController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {AddRecipePage} from '../add-recipe/add-recipe';
import {ShoppingListPage} from '../shopping-list/shopping-list';
import {DataService} from '../../services';
import {Recipe} from '../../interfaces';

@Component({
	templateUrl: 'build/pages/calendar/calendar.html',
	directives: [RecipePage, AddRecipePage]
})

export class CalendarPage {

	@ViewChild(RecipePage) RecipePage: RecipePage;

	flipped:boolean = false;
  calendar:any;
  day:any = {
    'day': 'Lunedi',
    'meals': [{
      'name':'pranzo',
      'recipes': []
    },{
      'name': 'cena',
      'recipes': []
    }]
  };
  shoppingList:string[];
  deleteCalendarRecipe:any;
 
	constructor(
		public modalCtrl: ModalController,
    public data: DataService,
    public alertCtrl: AlertController
	) {
 		  let self = this;
      data.retrieveCalendar(function(data) {
        self.calendar = data;
      });

      this.shoppingList = [];
      this.deleteCalendarRecipe = data.deleteCalendarRecipe;
	}

  /**
 	 * Flip the day detail page
   * param {any} a day object, see www/lendar.json for reference
 	 */
	flip (daySelected:any) {
    if (daySelected && this.day !== daySelected) {
      this.day = daySelected;
    }
    this.flipped = !this.flipped;
  }

	/**
   * Modal page loading method
   * @param {Recipe} a recipe object defined in the interfaces file
   */
  presentModalRecipe (item:Recipe) {
    if (!item) return;
    let modal = this.modalCtrl.create(RecipePage, {recipe:item});
    return modal.present();
  }

  /**
   * Modal that show the favorites recipes to add to the calendar
   */
  presentModalAddRecipe () {
    let modal = this.modalCtrl.create(AddRecipePage);
    return modal.present();
  }

  /**
   * Modal that show all the ingredients for the recipes of the day
   * @param {Array<any>} the meals array 
   */
  presentModalShoppingList(meals:Array<any>) {

    for (let meal of meals) {
      for(let recipe of meal.recipes) {
        this.shoppingList = this.shoppingList.concat(recipe.ingredients);
      }
    }
    let modal = this.modalCtrl.create(ShoppingListPage, {shoppingList:this.shoppingList});
    modal.present();
    this.shoppingList = [];
    return;
  }

  /**
   * Delete recipe confirmation alert
   * @param {number} the array index of the element in the recipes array
   * @param {string} the name of the recipe
   */
  showDeleteConfirm(index:number, name:string) {
    let confirm = this.alertCtrl.create({
      title: 'Cancella ricetta',
      message: `sei sicuro di voler rimuovere dal calendario la ricetta ${name}?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            return;
          }
        },
        {
          text: 'Si',
          handler: () => {
            return this.deleteCalendarRecipe(index);
          }
        }
      ]
    });
    confirm.present();
  }
}
