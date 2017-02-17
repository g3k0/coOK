import {Component} from '@angular/core';
import {SearchPage} from '../search/search';
import {CalendarPage} from '../calendar/calendar';
import {FavoritesPage} from '../favorites/favorites';
import {InfoPage} from '../info/info';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;

  constructor () {
    
  }

  /**
   * Component life cycle methods
   */
  ngOnInit() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = SearchPage;
    this.tab2Root = FavoritesPage;
    this.tab3Root = CalendarPage;
    this.tab4Root = InfoPage
  }
}
