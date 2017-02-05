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
 
	constructor(
		private modalCtrl: ModalController,
    private data: DataService,
    private alertCtrl: AlertController
	) {
 		  
	}

  /**
   * Component life cycle methods
   */
  ngOnInit() {
    this.data.retrieveCalendar()
    .then((calendar) => {
      this.calendar = calendar;
      return;
    })
    .catch((err) => {
      return;
    });

    this.shoppingList = [];
  }

  /**
   *  Update the calendar view
   */
  updateCalendar() {
    this.data.retrieveCalendar()
    .then((calendar) => {
      this.calendar = calendar;
      return;
    })
    .catch((err) => {
      return;
    });
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
   * @param {string} the day selected
   * @param {string} the meal selected
   */ 
  presentModalAddRecipe (day:string, meal:string) {
    this.data.retrieveFavorites()
    .then((recipes) => {
      let modal = this.modalCtrl.create(AddRecipePage, {recipes:recipes, title:'Aggiungi al calendario',day:day, meal:meal});
      return modal.present();
    })
    .catch((err) => {
      return;
    });
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
   * Delete a recipe from calendar
   * @param {string} the day where from to delete the recipe
   * @param {string} the meal where from to delete the recipe
   * @param {string} the recipe name to delete from calendar
   */
  deleteCalendarRecipe(day:string, meal:string, recipeName:string) {
    this.data.deleteCalendarRecipe(day, meal, recipeName)
    .then(() => {
      return;
    })
    .catch((err)=>{
      return;
    }); 
  }

  /**
   * Delete recipe confirmation alert
   * @param {string} the day where from to delete the recipe
   * @param {string} the meal where from to delete the recipe
   * @param {string} the recipe name to delete from calendar
   */
  showDeleteConfirm(day:string, meal:string, recipeName:string) {
    let confirm = this.alertCtrl.create({
      title: 'Cancella ricetta',
      message: `sei sicuro di voler rimuovere dal calendario la ricetta ${recipeName}?`,
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
            return this.deleteCalendarRecipe(day, meal, recipeName);
          }
        }
      ]
    });
    confirm.present();
  }
}
