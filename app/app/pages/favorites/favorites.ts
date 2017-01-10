import {Component, ViewChild} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {Http} from '@angular/http';
import {RecipePage} from '../recipe/recipe';

@Component({
  templateUrl: 'build/pages/favorites/favorites.html',
  directives: [RecipePage]
})

export class FavoritesPage {

  @ViewChild(RecipePage) RecipePage: RecipePage;

	items: any[];

	constructor (
        public http: Http, 
        public modalCtrl: ModalController
    ) {
		this.http.get('./saved_recipes.json')
		.subscribe(res => {
			this.items = res.json();
		});
    }
    
    /** 
     * Search bar filter method
     */
	getItems (ev: any) {
  	
      	// set val to the value of the searchbar
      	let val = ev.target.value;

      	// if the value is an empty string don't filter the items
      	if (val && val.trim() != '') {
        		this.items = this.items.filter((item) => {
        			return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        		})
      	} else {
      		this.http.get('./saved_recipes.json')
    		.subscribe(res => {
    			this.items = res.json();
    		});
      	}
	}

    /**
     * Modal page loading method
     */
    presentModal() {
        let modal = this.modalCtrl.create(RecipePage);
        modal.present();
    }
}
