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
var http_1 = require("@angular/http");
var recipe_1 = require("../recipe/recipe");
var services_1 = require("../../services");
var FavoritesPage = (function () {
    function FavoritesPage(http, modalCtrl, data) {
        this.http = http;
        this.modalCtrl = modalCtrl;
        this.data = data;
        /**
         * Get the favorites list
         */
        var self = this;
        data.retrieveFavorites(function (data) {
            self.items = data;
        });
    }
    /**
     * Search bar filter method
     */
    FavoritesPage.prototype.getItems = function (ev) {
        var _this = this;
        // set val to the value of the searchbar
        var val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.items.filter(function (item) {
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
        else {
            this.http.get('./saved_recipes.json')
                .subscribe(function (res) {
                _this.items = res.json();
            });
        }
    };
    /**
     * Modal page loading method
     */
    FavoritesPage.prototype.presentModal = function (item) {
        var modal = this.modalCtrl.create(recipe_1.RecipePage, item);
        modal.present();
    };
    return FavoritesPage;
}());
__decorate([
    core_1.ViewChild(recipe_1.RecipePage),
    __metadata("design:type", recipe_1.RecipePage)
], FavoritesPage.prototype, "RecipePage", void 0);
FavoritesPage = __decorate([
    core_1.Component({
        templateUrl: 'build/pages/favorites/favorites.html',
        directives: [recipe_1.RecipePage]
    }),
    __metadata("design:paramtypes", [http_1.Http,
        ionic_angular_1.ModalController,
        services_1.DataService])
], FavoritesPage);
exports.FavoritesPage = FavoritesPage;
