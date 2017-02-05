import {Component} from '@angular/core';
import {ViewController,NavParams} from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/shopping-list/shopping-list.html',
	selector: 'shopping-list'
})

export class ShoppingListPage { 

	shoppingList: string[];

	constructor (
		private viewCtrl: ViewController,
		private params: NavParams
	) {
		
	}

	/**
     * Component life cycle methods
     */
	ngOnInit() {
		this.shoppingList = this.params.get('shoppingList');
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