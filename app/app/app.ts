import 'es6-shim';
import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {SearchPage} from './pages/search/search';
import {CalendarPage} from './pages/calendar/calendar';
import {TabsPage} from './pages/tabs/tabs';
import {FavoritesPage} from './pages/favorites/favorites';


@App({
  templateUrl: 'build/app.html',
  config: {
    tabsPlacement: 'bottom'
  }  // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
  // make HelloIonicPage the root (or first) page
  rootPage: any = TabsPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Search', component: SearchPage },
      { title: 'Calendar', component: CalendarPage },
      { title: 'Favorites', component: FavoritesPage },
      { title: 'Tabs', component: TabsPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}