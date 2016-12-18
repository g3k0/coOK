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
  tab1Root: any = MenuPage;
  tab2Root: any = HomePage;
  tab3Root: any = FavoritesPage;
  tab4Root: any = CalendarPage;

  constructor() {

  }
}
