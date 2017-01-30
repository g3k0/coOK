import {Component, ViewChild} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {DataService} from '../../services';
import {Recipe} from '../../interfaces';


@Component({
	templateUrl: 'build/pages/add-recipe/add-recipe.html',
	selector: 'add-recipe',
  	directives: [RecipePage],
    providers: [DataService]
})

export class AddRecipePage { 

	@ViewChild(RecipePage) RecipePage: RecipePage;
	items: Recipe[];

	constructor (
		private viewCtrl: ViewController,
        private modalCtrl: ModalController,
        private data: DataService
	) {
		let self = this;
      	data.retrieveFavorites(function(data) {
        	self.items = data;
      	});
	}

	/**
	 * Modal partial view closing method
	 */
	dismiss () {
	    this.viewCtrl.dismiss();
	}

	/**
     * Modal page loading method
     * @param {Recipe} a recipe object defined in the interfaces file
     */
     presentModal(item:Recipe) {
     	if (!item) return;
	    let modal = this.modalCtrl.create(RecipePage, {recipe:item});
	    modal.present();
	    return;
	}
}