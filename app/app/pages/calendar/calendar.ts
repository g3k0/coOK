import {Component, ViewChild} from '@angular/core';
import {ModalController, AlertController, ToastController, NavController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {AddRecipePage} from '../add-recipe/add-recipe';
import {ShoppingListPage} from '../shopping-list/shopping-list';
import {CalendarService} from './calendar.service';
import {FavoritesService} from '../favorites/favorites.service';
import {InfoPage} from '../info/info';
import {FavoritesPage} from '../favorites/favorites';
import {Recipe} from '../../interfaces';
import {HammerGesturesDirective} from '../../directives/hammerGesturesDirective';

@Component({
	templateUrl: 'build/pages/calendar/calendar.html',
	directives: [RecipePage, AddRecipePage, HammerGesturesDirective],
  providers: [CalendarService,FavoritesService]
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
    private toastCtrl: ToastController,
    private calendarData: CalendarService,
    private favoritesData: FavoritesService,
    private alertCtrl: AlertController,
    private nav: NavController
	) {
 		  this.nav = nav;
	}

  /**
   * Component life cycle methods
   */
  ngOnInit() {
    this.calendarData.retrieveCalendar()
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
   * toast message method when a recipe is deleted from favorites
   * @param {string} where to show the toast in the web page: top | middle | bottom
   */
  presentToast(position:string='top') {
    let toast = this.toastCtrl.create({
      message: 'Calendario resettato con successo!',
      duration: 2000,
      position: position
    });
    toast.present();
  }

  /**
   *  Update the calendar view
   */
  updateCalendar() {
    this.calendarData.retrieveCalendar()
    .then((calendar) => {
      this.calendar = calendar;
      return;
    })
    .catch((err) => {
      return;
    });
  }

  /**
   * Reset the calendar view
   */
  resetCalendar() {
    this.calendarData.resetCalendar()
    .then(() => {
      this.calendarData.retrieveCalendar()
      .then((calendar) => {
        this.calendar = calendar;
        this.presentToast();
        return;
      });
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
    this.favoritesData.retrieveFavorites()
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
    this.calendarData.deleteCalendarRecipe(day, meal, recipeName)
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

     /**
     * gesture directive function
     * @param {string} the event catched by the div tag of the directive
     */

    doSwipe(direction: string) {

      console.log("Direction: ", direction);
      switch (direction) {
        case 'swiperight':
          this.nav.push(InfoPage);
          break;

        case 'swipeleft':
          this.nav.push(FavoritesPage);
          break;

        default:
          break;
      }
        
    }

}
