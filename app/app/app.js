"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var ionic_native_1 = require("ionic-native");
var tabs_1 = require("./pages/tabs/tabs");
var info_1 = require("./pages/info/info");
var guide_1 = require("./pages/guide/guide");
var vote_1 = require("./pages/vote/vote");
var services_1 = require("./services");
var MyApp = (function () {
    function MyApp(platform, menu) {
        this.platform = platform;
        this.menu = menu;
        this.menu = menu;
        this.pages = [
            { title: 'Guida', component: guide_1.GuidePage, icon: 'help' },
            { title: 'Info', component: info_1.InfoPage, icon: 'information-circle' },
            { title: 'Votaci', component: vote_1.VotePage, icon: 'star-outline' }
        ];
        this.rootPage = tabs_1.TabsPage;
        this.loading = false; //cambia in base alle chiamate di registrazione e autenticazione
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            ionic_native_1.StatusBar.styleDefault();
        });
    }
    MyApp.prototype.openPage = function (page) {
        this.menu.close();
        // Using this.nav.setRoot() causes
        // Tabs to not show!
        this.nav.push(page.component);
    };
    ;
    return MyApp;
}());
__decorate([
    core_1.ViewChild('nav'),
    __metadata("design:type", ionic_angular_1.NavController)
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    core_1.Component({
        templateUrl: 'build/app.html',
        providers: [ionic_angular_1.NavController, services_1.DataService]
    }),
    __metadata("design:paramtypes", [ionic_angular_1.Platform, ionic_angular_1.MenuController])
], MyApp);
exports.MyApp = MyApp;
ionic_angular_1.ionicBootstrap(MyApp);
