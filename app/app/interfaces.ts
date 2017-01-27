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

export interface DeviceData {
    "token"?: string,
    "available": boolean,
    "platform": string,
    "version": string,
    "uuid": string,
    "cordova": string,
    "model": string,
    "manufacturer": string,
    "isVirtual": boolean, 
    "serial": string
}

export interface Config {
	"token": string,
	"authAPI": {
		"register": string,
		"login": string
	}
}