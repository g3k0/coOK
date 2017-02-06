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
	peopleLeft: number[];

	constructor (
		private viewCtrl: ViewController,
		private params: NavParams
	) {
		
	}

	/**
     * Component life cycle methods
     */
	ngOnInit() {
		this.recipe = this.params.get('recipe');

		this.persons = [];
		this.peopleLeft = [];
		for (let i=0; i<this.recipe.persons; ++i) {
			this.persons.push(i);
		}
		let left = 9 - this.persons.length;
		for (let k=0; k<left; ++k) {
			this.peopleLeft.push(k);
		}
	}

	/**
	 * Modal partial view closing method
	 */
	dismiss() {
	    this.viewCtrl.dismiss();
	}

	/**
	 * Remove people from people number and recalculate the ingredients
	 * @param {number} the array index of persons array 
	 */
	removePeople(index:number) {
		if (index) {
			this.persons = [];
			this.peopleLeft = [];
			for (let i=0; i<index; ++i) {
				this.persons.push(i);
			}
			let left = 9 - this.persons.length;
			for (let k=0; k<left; ++k) {
				this.peopleLeft.push(k);
			}
		}
	}

	/**
	 * Add people to the people number of the recipe and recalculate the ingredients
	 * @param {number} the array index of peopleLeft array
	 */
	addPeople(index:number) {
		this.peopleLeft = [];
		let remain = this.persons.length + index +1;
		this.persons = [];
		for (let i=0; i<remain; ++i) {
			this.persons.push(i);
		}
		let left = 9 - this.persons.length;
		for (let k=0; k<left; ++k) {
			this.peopleLeft.push(k);
		}


	}
}