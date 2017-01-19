import {Component} from '@angular/core';
import { AlertController } from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/search/search.html'
})

export class SearchPage {

	ingredients: any[];

	constructor(
		public alertCtrl: AlertController
	) {
		this.ingredients = [];
	}

	/**
	 * ingredients form input
	 */
	pushIngredient(ingredient:string) {
		return this.ingredients.push(ingredient);
	}

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
	            		console.log('Cancel clicked');
	          		}
	        	},
	        	{
	          		text: 'Salva',
	          		handler: data => {
	            		console.log('Saved clicked');
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
	            		console.log('Cancel clicked');
	          		}
	        	},
	        	{
	          		text: 'Salva',
	          		handler: data => {
	            		console.log('Saved clicked');
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
	    	value: 'value1'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Antipasti',
	     	value: 'value2'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Primi',
	     	value: 'value3'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Carni',
	     	value: 'value4'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Pollame',
	     	value: 'value5'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Pesce',
	     	value: 'value6'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Contorni',
	     	value: 'value7'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Salse',
	     	value: 'value8'
	    });

	    alert.addInput({
	    	type: 'checkbox',
	    	label: 'Dolci',
	     	value: 'value9'
	    });

	    alert.addButton('Cancella');

	    alert.addButton({
	    	text: 'Salva',
	    	handler: data => {
	        	console.log('Checkbox data:', data);
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
}