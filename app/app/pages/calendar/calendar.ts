import {Component, ViewChild} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {AddRecipePage} from '../add-recipe/add-recipe';

@Component({
	templateUrl: 'build/pages/calendar/calendar.html',
	directives: [RecipePage, AddRecipePage]
})

export class CalendarPage {

	@ViewChild(RecipePage) RecipePage: RecipePage;

	flipped: boolean = false;
 
	constructor(
		public modalCtrl: ModalController
	) {
 		
	}
 	
 	/**
 	 * Flip the day detail page
 	 */
	flip () {
    	this.flipped = !this.flipped;
  	}

  	/**
     * Modal page loading method
     */
    presentModalRecipe () {
        let modal = this.modalCtrl.create(RecipePage);
        modal.present();
    }

    presentModalAddRecipe () {
        let modal = this.modalCtrl.create(AddRecipePage);
        modal.present();
    }
}
