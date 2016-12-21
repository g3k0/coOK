import {Page, Platform} from 'ionic-angular';


@Page({
	templateUrl: './build/pages/favorites/favorites.html'
})
export class FavoritesPage {
	user: string = "login";
	isAndroid: boolean = false;

	constructor(platform: Platform) {
		this.isAndroid = platform.is('android');
	}
}