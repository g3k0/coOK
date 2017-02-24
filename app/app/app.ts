import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, NavController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {InfoPage} from './pages/info/info';
import {DataService} from './services';

@Component({
    templateUrl: 'build/app.html',
    providers: [NavController, DataService]
})

export class MyApp {
    @ViewChild('nav') nav : NavController;
    private rootPage: any;
    private loading: boolean;

    constructor (
        private platform: Platform, 
        private data: DataService
    ) {
        this.rootPage = TabsPage;
        this.loading = true;

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

            /*Authentication method call*/
            data.authentication()
            .then(() => {
                this.loading = false;
                return;
            })
            .catch((err) => {
                console.error(`There was an error during the authentication: ${JSON.stringify(err)}`)
                return;
            });
        });
    }

    openPage(page) {
        // Using this.nav.setRoot() causes
        // Tabs to not show!
        this.nav.push(page.component);
    };
}

ionicBootstrap(MyApp);
