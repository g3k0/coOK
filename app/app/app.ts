import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, MenuController, NavController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';

import {SearchPage} from './pages/search/search';
import {FavoritesPage} from './pages/favorites/favorites';
import {CalendarPage} from './pages/calendar/calendar';

@Component({
  templateUrl: 'build/app.html',
  providers: [NavController]
})
export class MyApp {
  @ViewChild('nav') nav : NavController;
  private rootPage: any;
  private pages: any[];

  constructor(private platform: Platform, private menu: MenuController) {
    this.menu = menu;
    this.pages = [
        { title: 'Search', component: SearchPage },
        { title: 'Favorites', component: FavoritesPage },
        { title: 'Calendar', component: CalendarPage }
    ];
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    this.menu.close()
    // Using this.nav.setRoot() causes
    // Tabs to not show!
    this.nav.push(page.component);
  };
}

ionicBootstrap(MyApp);
