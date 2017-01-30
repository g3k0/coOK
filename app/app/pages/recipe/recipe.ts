import {Component} from '@angular/core';
import {ViewController,NavParams} from 'ionic-angular';
import {Recipe} from '../../interfaces';

@Component({
	templateUrl: 'build/pages/recipe/recipe.html',
	selector: 'recipe'
})

export class RecipePage { 

	recipe: Recipe;
	persons: number[];

	constructor (
		private viewCtrl: ViewController,
		private params: NavParams
	) {
		this.recipe = params.get('recipe');

		this.persons = [];
		for (let i=0; i<this.recipe.persons; ++i) {
			this.persons.push(i);
		}
	}

	/**
	 * Modal partial view closing method
	 */
	dismiss () {
	    this.viewCtrl.dismiss();
	}
}