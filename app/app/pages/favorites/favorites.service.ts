import {Injectable} from '@angular/core';
import {SQLite} from 'ionic-native';
import {Recipe} from '../../interfaces';
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
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
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
        db.executeSql(`
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
          db.close().then(() => {
            console.log(`[addRecipeToFavorites] recipe was inserted into the database`);
            return resolve();
          });
        });
      })
      .catch((error) => {
        console.error(`[addRecipeToFavorites] Error: ${JSON.stringify(error)}`);
        return reject(error);
      });
    });
  }

  /*--------------------------------------------------------------------------------------------------------------*/  
  
  /**
   * Get the favorites recipes saved by the user
   */
  retrieveFavorites() {
    return new Promise((resolve, reject) =>{
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
        db.executeSql(`SELECT 
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
          db.close().then(() => {
            console.log(`[retrieveFavorites] Recipes retrieved`);
            return resolve(rv);
          });
        });
      })
      .catch((error) => {
        console.error(`[retrieveFavorites] Error: ${JSON.stringify(error)}`);
        return reject(error);
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
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {
        db.executeSql(`
          DELETE FROM favorites
          WHERE name = '${name.replace(new RegExp("'", 'g'),"\"")}'
        `,[])
        .then(()=>{
          db.close().then(() => {
            console.log(`[deleteFavorite] recipe was deleted from the database`);
            return resolve();
          });
        });
      })
      .catch((error) => {
        console.error(`[deleteFavorite] Error: ${JSON.stringify(error)}`);
        return reject(error);
      });
    });
  }

  /**
   * Update an existing recipe in the Favorites list
   * @param {Recipe} the recipe to update
   * @param {number} the new number of persons for the recalculated recipe
   */
  /*updateFavorite(recipe:Recipe, persons:number) {
    return new Promise((resolve, reject) => {
      let db = new SQLite();
      db.openDatabase({
          name: 'data.db',
          location: 'default'
      }).then(() => {

        let newIngredients:string[];
        for (let ingredient of recipe.ingredients) {
          ingredient = ingredient.replace(new RegExp("'", 'g'),"\"");
          newIngredients.push(ingredient);
        }

        db.executeSql(`
          UPDATE favorites
          SET ingredients = '${newIngredients}',
              persons = '${persons}'
          WHERE name = '${recipe.name.replace(new RegExp("'", 'g'),"\"")}'
        `,[])
        .then(() => {
          db.close().then(() => {
            console.log(`[updateFavorite] recipe was updated correctly`);
            return resolve();
          });
        });
      })
      .catch((error) => {
        console.error(`[updateFavorite] Error: ${JSON.stringify(error)}`);
        return reject(error);
      });
    });
  }*/
}