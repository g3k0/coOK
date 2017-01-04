import {Component} from '@angular/core';
import { Http } from '@angular/http';

@Component({
  templateUrl: 'build/pages/favorites/favorites.html'
})
export class FavoritesPage {
	searchQuery: string = '';
	items: any[];

	constructor(public http: Http) {
		this.http.get('./recipes_mock.json')
		.subscribe(res => {
			this.items = res.json();
		});
  	}

  	getItems(ev: any) {
    	
    	// set val to the value of the searchbar
    	let val = ev.target.value;

    	// if the value is an empty string don't filter the items
    	if (val && val.trim() != '') {
      		this.items = this.items.filter((item) => {
      			return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      		})
    	} else {
    		this.http.get('./recipes_mock.json')
			.subscribe(res => {
				this.items = res.json();
			});
    	}
  	}
}
