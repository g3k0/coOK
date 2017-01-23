/**
 * Recipe Interface, used to define the recipe type
 */
export interface Recipe {
    "name": string,
    "type": string,
    "mainIngredient": string,
    "persons": number,
    "notes"?: string,
    "ingredients": string[],
    "preparation": string
}