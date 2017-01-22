import {Component, ViewChild} from '@angular/core';
import {ModalController} from 'ionic-angular';
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
    "day": 'Lunedi',
    'meals': [{
      'name':'pranzo',
      'recipes': []
    },{
      'name': 'cena',
      'recipes': []
    }]
  };
 
	constructor(
		public modalCtrl: ModalController,
    public data: DataService
	) {
 		 let self = this;
      data.retrieveCalendar(function(data) {
        self.calendar = data;
      });
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
}
