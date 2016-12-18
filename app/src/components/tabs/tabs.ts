import { Component } from '@angular/core';

import { MenuPage } from '../menu/menu';
import { HomePage } from '../home/home';
import { CalendarPage } from '../calendar/calendar';
import { FavoritesPage } from '../favorites/favorites';

@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html'
})

export class TabsPage {

	// this tells the tabs component which Pages
	// should be each tab's root Page
	tab4Root: any = MenuPage;
	tab1Root: any = HomePage;
	tab2Root: any = FavoritesPage;
	tab3Root: any = CalendarPage;

	constructor() {

	}
}
