import {Injectable} from '@angular/core';
import {Recipe} from '../../interfaces';
import {DBSingletonClass} from '../../database';
import 'rxjs/Rx';

@Injectable()
export class FavoritesService {
	constructor () {

	}

	/**
   * Add a recipe retrieved from the search into the database
   * @param {Recipe} a recipe object as declared in the interfaces file
   */
  addRecipeToFavorites(recipe:Recipe) {
    if (!recipe) return;
    return new Promise((resolve, reject) => {

      DBSingletonClass.getInstance((instance) => {
        let name = recipe.name.replace(new RegExp("'", 'g'),"\"");
        let type = recipe.type.replace(new RegExp("'", 'g'),"\"");
        let mainIngredient = recipe.mainIngredient.replace(new RegExp("'", 'g'),"\"");
        let notes = recipe.notes.replace(new RegExp("'", 'g'),"\"");
        let preparation = recipe.preparation.replace(new RegExp("'", 'g'),"\"");

        let ingredients = [];
        for (let ingredient of recipe.ingredients) {
          let ing = ingredient.replace(new RegExp("'", 'g'),"\"")
          ingredients.push(ing);
        }

        instance.db.executeSql(`
          INSERT INTO favorites
          (name, type, mainIngredient, persons, notes, ingredients, preparation)
          VALUES ('${name}',
                  '${type}',
                  '${mainIngredient}',
                  '${recipe.persons}',
                  '${notes || ''}',
                  '${ingredients}',
                  '${preparation}'
          )
        `,[])
        .then(()=>{
          return resolve();
        });
      });
    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/  
  
  /**
   * Get the favorites recipes saved by the user
   */
  retrieveFavorites() {
    return new Promise((resolve, reject) =>{
      DBSingletonClass.getInstance((instance) => {
        instance.db.executeSql(`SELECT 
          name,
          type,
          mainIngredient,
          persons,
          notes,
          ingredients,
          preparation 
          FROM favorites
        `,[])
        .then((data) => {

          if (!data.rows.length) {
            return resolve([]);
          }

          let recipes = data.rows.length;
          let rv:Recipe[] = new Array(recipes);
          for (let i = 0; i < recipes; i++) {
            let recipe:any = data.rows.item(i);
            rv[i] = {
              name: recipe.name.replace(new RegExp("\"", 'g'),"'"), 
              type: recipe.type.replace(new RegExp("\"", 'g'),"'"), 
              mainIngredient: recipe.mainIngredient.replace(new RegExp("\"", 'g'),"'"),
              persons: recipe.persons,
              notes: recipe.notes.replace(new RegExp("\"", 'g'),"'"),
              ingredients: recipe.ingredients.replace(new RegExp("\"", 'g'),"'").split(','),
              preparation: recipe.preparation.replace(new RegExp("\"", 'g'),"'")
            };
          }
          console.log(`[retrieveFavorites] Recipes retrieved`);
          return resolve(rv);
        });
      });
    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/

  /**
   * Delete a recipe from the favorites file
   * @param {string} recipe name to delete
   */
  deleteFavorite(name:string) {
    return new Promise((resolve, reject) => {
      DBSingletonClass.getInstance((instance) => {
        instance.db.executeSql(`
          DELETE FROM favorites
          WHERE name = '${name.replace(new RegExp("'", 'g'),"\"")}'
        `,[])
        .then(()=>{
          console.log(`[deleteFavorite] recipe was deleted from the database`);
          return resolve();
        });
      });
    });
  }
}