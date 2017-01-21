import {Component, ViewChild} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {Http} from '@angular/http';
import {RecipePage} from '../recipe/recipe';
import {DataService} from '../../services';

@Component({
  templateUrl: 'build/pages/favorites/favorites.html',
  directives: [RecipePage]
})

export class FavoritesPage {

  @ViewChild(RecipePage) RecipePage: RecipePage;

	items: any[];
  initialItems: any[];

	constructor (
        public http: Http, 
        public modalCtrl: ModalController,
        public data: DataService
    ) {
		
      /**
       * Get the favorites list
       */
      let self = this;
      data.retrieveFavorites(function(data) {
        self.items = data;
        self.initialItems = data;
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
  		this.items = this.initialItems;
  	}
	}

  /**
   * Modal page loading method
   */
  presentModal(item) {
    let modal = this.modalCtrl.create(RecipePage, {recipe:item});
    modal.present();
  }
}
