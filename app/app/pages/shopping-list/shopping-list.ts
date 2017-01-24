import {Component} from '@angular/core';
import {ViewController,NavParams} from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/shopping-list/shopping-list.html',
	selector: 'shopping-list'
})

export class RecipePage { 

	constructor (
		public viewCtrl: ViewController,
		public params: NavParams
	) {
		
	}

	/**
	 * Modal partial view closing method
	 */
	dismiss () {
	    this.viewCtrl.dismiss();
	}
}