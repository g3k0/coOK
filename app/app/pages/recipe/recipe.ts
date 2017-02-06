import {Component} from '@angular/core';
import {ViewController,NavParams} from 'ionic-angular';
import {Recipe} from '../../interfaces';
import {RecipeService} from './recipe.service';

@Component({
	templateUrl: 'build/pages/recipe/recipe.html',
	selector: 'recipe',
  	providers: [RecipeService]
})

export class RecipePage { 

	recipe: Recipe;
	persons: number[];
	peopleLeft: number[];

	constructor (
		private viewCtrl: ViewController,
		private recipeData: RecipeService,
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
	 * @param {string} the recipe name to recalculate
	 */
	removePeople(index:number, name:string) {
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

		this.recipeData.ingredientsCalculation(this.persons.length, name)
		.then((calculatedIngredients):string[] => {
			this.recipe.ingredients = <string[]>calculatedIngredients;
			return;
		})
		.catch((err) => {
			return;
		});
	}

	/**
	 * Add people to the people number of the recipe and recalculate the ingredients
	 * @param {number} the array index of peopleLeft array
	 * @param {string} the recipe name to recalculate
	 */
	addPeople(index:number, name:string) {
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

		this.recipeData.ingredientsCalculation(this.persons.length, name)
		.then((calculatedIngredients):string[] => {
			this.recipe.ingredients = <string[]>calculatedIngredients;
			return;
		})
		.catch((err) => {
			return;
		});
	}
}