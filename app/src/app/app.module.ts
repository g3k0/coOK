import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../components/tabs/tabs';
import { MenuPage } from '../components/menu/menu';
import { HomePage } from '../components/home/home';
import { FavoritesPage } from '../components/favorites/favorites';
import { CalendarPage } from '../components/calendar/calendar';
import {CalendarDetailPage} from '../components/calendar-detail/calendar-detail'
import { RecipePage } from '../components/recipe/recipe';
import { RecipesListPage } from '../components/recipes-list/recipes-list';
import { InfoPage } from '../components/info/info';
import { GuidePage } from '../components/guide/guide';
import { VoteUsPage } from '../components/vote-us/vote-us';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    MenuPage,
    HomePage,
    FavoritesPage,
    CalendarPage,
    CalendarDetailPage,
    RecipePage,
    RecipesListPage,
    InfoPage,
    GuidePage,
    VoteUsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    MenuPage,
    HomePage,
    FavoritesPage,
    CalendarPage,
    CalendarDetailPage,
    RecipePage,
    RecipesListPage,
    InfoPage,
    GuidePage,
    VoteUsPage
  ],
  providers: []
})
export class AppModule {}
