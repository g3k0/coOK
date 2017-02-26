import {Component} from '@angular/core';
import {AlertController, ToastController, ModalController, LoadingController} from 'ionic-angular';
import {SearchService} from './search.service';
import {AddRecipePage} from '../add-recipe/add-recipe';


@Component({
	templateUrl: 'build/pages/search/search.html',
	directives: [AddRecipePage],
    providers: [SearchService]
})

export class SearchPage {

	ingredients: any[];
	filters: {
		recipeName:string,
		mainIngredient:string,
		recipeType: any[]
	}
	message: any;
	loader: any;
	wrongIngredient:boolean;

	constructor(
		private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
		private searchData: SearchService
	) {
		
	}

	/**
     * Component life cycle methods
     */
	ngOnInit() {
		this.ingredients = [];
		this.filters = {
			recipeName: null,
			mainIngredient: null,
			recipeType: []
		};
		this.wrongIngredient = false;
	}

	/**
	 * ingredients form input
	 * @param {string} the ingredient passed by the text input html element
	 */
	pushIngredient(ingredient:string) {
		if (!ingredient) return;
		return this.ingredients.push(ingredient);
	}

	/**
	 * method that pop an ingredient from the ingredients array, 
	 * called in the ingredient x html button
	 * @param {string} the ingredient passed by the text input html element
	 */
	deleteIngredient(ingredient:string) {
		let index = this.ingredients.indexOf(ingredient);

		if (index > -1) {
		    this.ingredients.splice(index, 1);
		}

		return;
	}

	checkIngredient(ingredient:string='') {
		if (!ingredient) return;
		
		if (ingredient.indexOf(' ') > -1) {
			this.wrongIngredient = true;
		} else {
			this.wrongIngredient = false;
		}
		return;
	} 

	/**
	 * Filters alerts
	 */
	recipeName() {
	    let prompt = this.alertCtrl.create({
	    	title: 'Nome ricetta',
	    	message: 'Inserisci il nome della ricetta',
	    	inputs: [
	    		{
	          		name: 'recipeName',
	          		placeholder: 'nome ricetta'
	        	}
	      	],
	      	buttons: [
	        	{
	          		text: 'Cancella',
	          		handler: data => {
	            		return;
	          		}
	        	},
	        	{
	          		text: 'Inserisci',
	          		handler: data => {
	            		this.filters.recipeName = data.recipeName;
	          		}
	        	}
	      	]
	    });
	    prompt.present();
  	}

  	mainIngredient() {
	    let prompt = this.alertCtrl.create({
	    	title: 'Ingrediente principale',
	    	message: "Inserisci l'ingrediente principale",
	    	inputs: [
	    		{
	          		name: 'mainIngredient',
	          		placeholder: 'ingrediente principale'
	        	}
	      	],
	      	buttons: [
	        	{
	          		text: 'Cancella',
	          		handler: data => {
	            		return;
	          		}
	        	},
	        	{
	          		text: 'Inserisci',
	          		handler: data => {
	            		this.filters.mainIngredient = data.mainIngredient;
	          		}
	        	}
	      	]
	    });
	    prompt.present();
  	}

	recipeType() {
	    let alert = this.alertCtrl.create();
	    alert.setTitle('Tipo di piatto');
	    let dishes:string[] = ['Bevande','Antipasto','Primo','Carne','Pollame','Pesce','Contorno','Salsa','Dessert'];

	    for (let dish of dishes) {
		    alert.addInput({
		    	type: 'checkbox',
		    	label: dish,
		    	value: dish
		    });
		}

	    alert.addButton('Cancella');

	    alert.addButton({
	    	text: 'Inserisci',
	    	handler: data => {
	        	this.filters.recipeType = data;
	      	}
	    });
	    alert.present();
  	}

  	/**
  	 * Init filters method in clear filter html button
   	 */
  	clearFilters() {
  		this.filters = {
			recipeName: null,
			mainIngredient: null,
			recipeType: []
		};
		return;
  	}

  	/**
  	 * toast message method when clear filter button is pressed
  	 * @param {string} where to show the toast in the web page: top | middle | bottom
  	 */
  	presentToast(position:string) {
	    let toast = this.toastCtrl.create({
	      message: 'Filtri resettati con successo!',
	      duration: 2000,
	      position: position
	    });
	    toast.present();
	}

    /**
     * Search method, called by the search html button
     */
    search() {
	  	if (!this.ingredients.length && 
	  		!this.filters.recipeName &&
	  		!this.filters.mainIngredient &&
	  		!this.filters.recipeType.length
	  	) {
	  		console.log('no data');
	  		return;
	  	}

	  	this.loader = this.loadingCtrl.create({
	      content: "Attendere...",
	      duration: 5000
	    });
	    this.loader.present();

	    let self=this;
	  	this.searchData.getRecipes(this.ingredients,this.filters)
	  	.then((recipes) => {
	  		self.loader.dismiss();
	  		let res = <any[]>recipes;
	  		if (!res.length) {
	  			this.searchData.displaySentence((sentence) => {
	  				let modal = this.modalCtrl.create(AddRecipePage, {recipes:recipes, title:'risultati ricerca', message:sentence});
    				return modal.present();
	  			});
	  		} else {
	  			let modal = this.modalCtrl.create(AddRecipePage, {recipes:recipes, title:'risultati ricerca'});
    			return modal.present();
	  		}
	  	})
	  	.catch((err) => {
	  		console.error(`There was an error on getting the recipes: ${JSON.stringify(err)}`);
	  		return;
	  	});
    } 
}