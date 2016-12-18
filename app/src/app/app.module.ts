import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../components/tabs/tabs';
import { MenuPage } from '../components/menu/menu';
import { HomePage } from '../components/home/home';
import { FavoritesPage } from '../components/favorites/favorites';
import { CalendarPage } from '../components/calendar/calendar';

@NgModule({
    declarations: [
        MyApp,
        TabsPage,
        MenuPage,
        HomePage,
        FavoritesPage,
        CalendarPage
    ],
    imports: [
        IonicModule.forRoot(MyApp,{
            tabsPlacement: 'top'
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        TabsPage,
        MenuPage,
        HomePage,
        FavoritesPage,
        CalendarPage
    ],
    providers: []
})

export class AppModule {}
