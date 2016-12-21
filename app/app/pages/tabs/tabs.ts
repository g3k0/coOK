import {Page} from 'ionic-angular';
import {SearchPage} from '../search/search';
import {FavoritesPage} from '../favorites/favorites';
import {CalendarPage} from '../calendar/calendar';

import {Type} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  tab1Root: any = SearchPage;
  tab2Root: any = FavoritesPage;
  tab3Root: Type = CalendarPage;

  constructor() {

  }
}
