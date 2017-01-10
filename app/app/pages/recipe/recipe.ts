import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/recipe/recipe.html',
	selector: 'recipe'
})

export class RecipePage { 

	constructor (
		public viewCtrl: ViewController
	) {

	}

	/**
	 * Modal partial view closing method
	 */
	dismiss () {
	    this.viewCtrl.dismiss();
	}
}