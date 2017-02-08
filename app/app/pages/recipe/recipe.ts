import {Component} from '@angular/core';
import {ViewController,NavParams} from 'ionic-angular';
import {Recipe} from '../../interfaces';
import {RecipeService} from './recipe.service';
import {FavoritesService} from '../favorites/favorites.service';

@Component({
	templateUrl: 'build/pages/recipe/recipe.html',
	selector: 'recipe',
  	providers: [RecipeService,FavoritesService]
})

export class RecipePage { 

	recipe: Recipe;
	persons: number[];
	peopleLeft: number[];

	constructor (
		private viewCtrl: ViewController,
		private recipeData: RecipeService,
		private favoritesData: FavoritesService,
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
	 * @param {Recipe} the recipe to recalculate
	 */
	removePeople(index:number, recipe:Recipe) {
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

		this.recipeData.ingredientsCalculation(this.persons.length, recipe.name)
		.then((calculatedIngredients) => {
			this.recipe.ingredients = <string[]>calculatedIngredients;  
			this.recipe.persons = this.persons.length;
			/*this.favoritesData.updateFavorite(recipe, this.persons.length)
			.then(() => {
				return;
			});*/
			return;
		})
		.catch((err) => {
			return;
		});
	}

	/**
	 * Add people to the people number of the recipe and recalculate the ingredients
	 * @param {number} the array index of peopleLeft array
	 * @param {Recipe} the recipe to recalculate
	 */
	addPeople(index:number, recipe:Recipe) {
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

		this.recipeData.ingredientsCalculation(this.persons.length, recipe.name)
		.then((calculatedIngredients) => {
			this.recipe.ingredients = <string[]>calculatedIngredients;
			this.recipe.persons = this.persons.length;
			/*this.favoritesData.updateFavorite(recipe, this.persons.length)
			.then(() => {
				return;
			});*/
			return;
		})
		.catch((err) => {
			return;
		});
	}
}