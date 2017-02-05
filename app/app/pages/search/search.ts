import {Component} from '@angular/core';
import {AlertController, ToastController, ModalController} from 'ionic-angular';
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

	constructor(
		private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private modalCtrl: ModalController,
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
	          		text: 'Salva',
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
	          		text: 'Salva',
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

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Bevande',
	    	value: 'Bevande'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Antipasti',
	     	value: 'Antipasto'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Primi',
	     	value: 'Primo'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Carni',
	     	value: 'Carne'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Pollame',
	     	value: 'Pollame'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Pesce',
	     	value: 'Pesce'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Contorni',
	     	value: 'Contorno'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Salse',
	     	value: 'Salsa'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Dolci',
	     	value: 'Dessert'
	    });

	    alert.addButton('Cancella');

	    alert.addButton({
	    	text: 'Salva',
	    	handler: data => {
	        	this.filters.recipeType = data;
	      	}
	    });
	    alert.present();
  	}
  	/*
  	persons() {
	    let alert = this.alertCtrl.create();
    	alert.setTitle('Numero di persone');

    	let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    	for (let num of numbers) {
    		alert.addInput({
	      		type: 'radio',
	      		label: num,
	      		value: num
	    	});
    	}

    	alert.addButton('Cancella');
    	alert.addButton({
      		text: 'Salva',
      		handler: data => {
      		}
    	});
    	alert.present();
  	}
  	*/

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

	  	this.searchData.getRecipes(this.ingredients,this.filters)
	  	.then((recipes) => {
	  		let modal = this.modalCtrl.create(AddRecipePage, {recipes:recipes, title:'risultati ricerca'});
    		return modal.present();
	  	})
	  	.catch((err) => {
	  		console.error(`There was an error on getting the recipes: ${JSON.stringify(err)}`);
	  		return;
	  	});
    } 
}