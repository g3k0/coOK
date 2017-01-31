import {Component, ViewChild} from '@angular/core';
import {ViewController,NavParams,ToastController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {Recipe} from '../../interfaces';
import {DataService} from '../../services';


@Component({
	templateUrl: 'build/pages/add-recipe/add-recipe.html',
	selector: 'add-recipe',
  	directives: [RecipePage],
    providers: [DataService]
})

export class AddRecipePage { 

	@ViewChild(RecipePage) RecipePage: RecipePage;
	items: Recipe[];
	title: string;

	constructor (
		private viewCtrl: ViewController,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private params: NavParams,
        private data: DataService
	) {
		this.items = params.get('recipes');
		this.title = params.get('title');
	}

	/**
	 * Modal partial view closing method
	 */
	dismiss() {
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

	/**
  	 * toast message method when a recipe is added to favorites
  	 * @param {string} where to show the toast in the web page: top | middle | bottom
  	 */
  	presentToast(position:string='top') {
	    let toast = this.toastCtrl.create({
	      message: 'Ricetta aggiunta ai favoriti!',
	      duration: 2000,
	      position: position
	    });
	    toast.present();
	}

	/**
	 * Add a recipe into the favorites category
	 * @param {Recipe} a recipe object as declared in the interfaces file
	 */
	addFavorite(recipe:Recipe) {
		if (!recipe) return;
		this.data.addRecipe(recipe)
		.then(() => {
			this.presentToast();
			return;
		})
		.catch((err) => {
			return;
		});
	}
}