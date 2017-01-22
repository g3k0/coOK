import {Component, ViewChild} from '@angular/core';
import {ModalController, AlertController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {AddRecipePage} from '../add-recipe/add-recipe';
import {DataService} from '../../services';

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
  delete:any;
 
	constructor(
		public modalCtrl: ModalController,
    public data: DataService,
    public alertCtrl: AlertController
	) {
 		 let self = this;
      data.retrieveCalendar(function(data) {
        self.calendar = data;
      });

      this.delete = data.delete;
	}

  /**
 	 * Flip the day detail page
 	 */
	flip (daySelected:any) {
    if (daySelected) {
      this.day = daySelected;
    }
    this.flipped = !this.flipped;
  }

	/**
   * Modal page loading method
   */
  presentModalRecipe (item:any) {
    if (!item) return;
    let modal = this.modalCtrl.create(RecipePage, {recipe:item});
    modal.present();
  }

  presentModalAddRecipe () {
    let modal = this.modalCtrl.create(AddRecipePage);
    modal.present();
  }

  /**
   *  Delete recipe confirmation alert
   */
  showDeleteConfirm(index, name) {
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
            return this.delete(index,'favorites.json');
          }
        }
      ]
    });
    confirm.present();
  }
}
