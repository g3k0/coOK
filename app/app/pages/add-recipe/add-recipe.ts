import {Component, ViewChild} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {Http} from '@angular/http';
import {ModalController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';


@Component({
	templateUrl: 'build/pages/add-recipe/add-recipe.html',
	selector: 'add-recipe',
  	directives: [RecipePage]
})

export class AddRecipePage { 

	@ViewChild(RecipePage) RecipePage: RecipePage;
	items: any[];

	constructor (
		public viewCtrl: ViewController,
		public http: Http, 
        public modalCtrl: ModalController
	) {
		this.http.get('./saved_recipes.json')
		.subscribe(res => {
			this.items = res.json();
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
     */
    presentModal() {
        let modal = this.modalCtrl.create(RecipePage);
        modal.present();
    }
}