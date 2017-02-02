import {Component, ViewChild} from '@angular/core';
import {ModalController, AlertController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {DataService} from '../../services';
import {Recipe} from '../../interfaces';

@Component({
  templateUrl: 'build/pages/favorites/favorites.html',
  directives: [RecipePage]
})

export class FavoritesPage {

  @ViewChild(RecipePage) RecipePage: RecipePage;

	items: any;
  initialItems: any;
  deleteFavorite: any;
  message: string;

	constructor (
        private modalCtrl: ModalController,
        private data: DataService,
        private alertCtrl: AlertController
    ) {

    }

  /**
   * Component life cycle methods
   */
  ngOnInit() {
    this.data.retrieveFavorites()
    .then((recipes) => {
      this.items = recipes;
      this.initialItems = recipes;
      return;
    })
    .catch((err) => {
      return;
    });
    this.deleteFavorite = this.data.deleteFavorite;
  }

  getFavorites() {
    this.data.retrieveFavorites()
    .then((recipes) => {
      this.items = recipes;
      this.initialItems = recipes;
      return;
    })
    .catch((err) => {
      return;
    });
  }
    
  /** 
   * Search bar filter method
   * @param {any} the event on the input element
   */
	getItems(ev:any) {
  	
  	// set val to the value of the searchbar
  	let val = ev.target.value;

  	// if the value is an empty string don't filter the items
  	if (val && val.trim() != '') {
    	this.items = this.items.filter((item) => {
    		return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
    	})
  	} else {
  		this.items = this.initialItems;
      return;
  	}
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

  /**
   * Delete recipe confirmation alert
   * @param {number} the array index of the element in the recipes array
   * @param {string} the name of the recipe
   */
  showDeleteConfirm(index:number, name:string) {
    let confirm = this.alertCtrl.create({
      title: 'Cancella ricetta',
      message: `sei sicuro di voler cancellare la ricetta ${name}?`,
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
            return this.deleteFavorite(index);
          }
        }
      ]
    });
    confirm.present();
  }
}
