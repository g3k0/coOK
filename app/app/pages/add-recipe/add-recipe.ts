import {Component, ViewChild} from '@angular/core';
import {ViewController,NavParams,ToastController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {RecipePage} from '../recipe/recipe';
import {Recipe} from '../../interfaces';
import {CalendarService} from '../calendar/calendar.service';
import {FavoritesService} from '../favorites/favorites.service';


@Component({
	templateUrl: 'build/pages/add-recipe/add-recipe.html',
	selector: 'add-recipe',
  	directives: [RecipePage],
    providers: [CalendarService, FavoritesService]
})

export class AddRecipePage { 

	@ViewChild(RecipePage) RecipePage: RecipePage;
	items: Recipe[];
	title: string;
	message: string;
	day: string;
	meal: string;
	results:string;

	constructor (
		private viewCtrl: ViewController,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private params: NavParams,
        private calendarData: CalendarService,
        private favoritesData: FavoritesService
	) {
		
	}

	/**
     * Component life cycle methods
     */
	ngOnInit() {
		this.items = this.params.get('recipes');
		this.title = this.params.get('title');
		this.day = this.params.get('day') || '';
		this.meal = this.params.get('meal') || '';
		this.message = this.params.get('message') || '';

		if(!this.day) {
			this.results = ` - ${this.items.length} risultati`;
		}

		if (!this.items.length && !this.message) {
			this.message = 'Non ci sono ricette salvate. Effettua una ricerca e salva le ricette nei favoriti.'
		}
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
  	 * @param {string} the toast message
  	 */ 
  	presentToast(position:string='top', message:string) {
	    let toast = this.toastCtrl.create({
	      message: message,
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
		this.favoritesData.addRecipeToFavorites(recipe)
		.then(() => {
			this.presentToast('top', 'Ricetta aggiunta ai favoriti!');
			return;
		})
		.catch((err) => {
			return;
		});
	}

	/**
	 *  Add a recipe to the calendar
	 *  @param {Recipe} the recipe to save into the calendar
	 */
	addRecipeToCalendar(recipe:Recipe) {
		if (!recipe) return;
		this.calendarData.addRecipeToCalendar(this.day,this.meal, recipe)
		.then(() => {
			this.presentToast('top', 'Ricetta aggiunta al calendario!');
			return;
		})
		.catch((err) => {
			return;
		});
	}
}