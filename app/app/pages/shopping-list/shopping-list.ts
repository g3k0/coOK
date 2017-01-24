import {Component} from '@angular/core';
import {ViewController,NavParams} from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/shopping-list/shopping-list.html',
	selector: 'shopping-list'
})

export class ShoppingListPage { 

	shoppingList: string[];

	constructor (
		public viewCtrl: ViewController,
		public params: NavParams
	) {
		this.shoppingList = params.get('shoppingList');
	}

	/**
	 * Modal partial view closing method
	 */
	dismiss () {
	    this.viewCtrl.dismiss();
	}

	/**
	 * check a certain ingredient
	 */
	ingredientSelected(ingredient:string) {
		console.log(ingredient); 
		return;
	}
}