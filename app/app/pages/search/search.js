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
var services_1 = require("../../services");
var SearchPage = (function () {
    function SearchPage(alertCtrl, toastCtrl, data) {
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.data = data;
        this.ingredients = [];
        this.filters = {
            recipeName: null,
            mainIngredient: null,
            recipeType: []
        };
        /**
         * Loading configuration
         */
        var self = this;
        data.retrieveConfig(function (data) {
            self.config = data; //use this.config in class methods!
        });
    }
    /**
     * ingredients form input
     */
    SearchPage.prototype.pushIngredient = function (ingredient) {
        if (!ingredient)
            return;
        return this.ingredients.push(ingredient);
    };
    /**
     * method that pop an ingredient from the ingredients array,
     * called in the ingredient x html button
     */
    SearchPage.prototype.deleteIngredient = function (ingredient) {
        var index = this.ingredients.indexOf(ingredient);
        if (index > -1) {
            this.ingredients.splice(index, 1);
        }
        return;
    };
    /**
     * Filters alerts
     */
    SearchPage.prototype.recipeName = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: 'Nome ricetta',
            message: 'Inserisci il nome della ricetta',
            inputs: [
                {
                    name: 'recipeName',
                    placeholder: 'nome ricetta'
                }
            ],
            buttons: [
                {
                    text: 'Cancella',
                    handler: function (data) {
                        return;
                    }
                },
                {
                    text: 'Salva',
                    handler: function (data) {
                        _this.filters.recipeName = data.recipeName;
                    }
                }
            ]
        });
        prompt.present();
    };
    SearchPage.prototype.mainIngredient = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: 'Ingrediente principale',
            message: "Inserisci l'ingrediente principale",
            inputs: [
                {
                    name: 'mainIngredient',
                    placeholder: 'ingrediente principale'
                }
            ],
            buttons: [
                {
                    text: 'Cancella',
                    handler: function (data) {
                        return;
                    }
                },
                {
                    text: 'Salva',
                    handler: function (data) {
                        _this.filters.mainIngredient = data.mainIngredient;
                    }
                }
            ]
        });
        prompt.present();
    };
    SearchPage.prototype.recipeType = function () {
        var _this = this;
        var alert = this.alertCtrl.create();
        alert.setTitle('Tipo di piatto');
        alert.addInput({
            type: 'checkbox',
            label: 'Bevande',
            value: 'Bevande'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Antipasti',
            value: 'Antipasti'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Primi',
            value: 'Primi'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Carni',
            value: 'Carni'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Pollame',
            value: 'Pollame'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Pesce',
            value: 'Pesce'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Contorni',
            value: 'Contorni'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Salse',
            value: 'Salse'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Dolci',
            value: 'Dolci'
        });
        alert.addButton('Cancella');
        alert.addButton({
            text: 'Salva',
            handler: function (data) {
                _this.filters.recipeType = data;
            }
        });
        alert.present();
    };
    /*
    persons() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Numero di persone');

        let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        for (let num of numbers) {
            alert.addInput({
                type: 'radio',
                label: num,
                value: num
            });
        }

        alert.addButton('Cancella');
        alert.addButton({
            text: 'Salva',
            handler: data => {
            }
        });
        alert.present();
    }
    */
    /**
     * Init filters method in clear filter html button
     */
    SearchPage.prototype.clearFilters = function () {
        this.filters = {
            recipeName: null,
            mainIngredient: null,
            recipeType: []
        };
        return;
    };
    /**
     * toast message method when clear filter button is pressed
     */
    SearchPage.prototype.presentToast = function (position) {
        var toast = this.toastCtrl.create({
            message: 'Filtri resettati con successo!',
            duration: 2000,
            position: position
        });
        toast.present();
    };
    /**
     * Search method, called by the search html button
     */
    SearchPage.prototype.search = function () {
        if (!this.ingredients.length &&
            !this.filters.recipeName &&
            !this.filters.mainIngredient &&
            !this.filters.recipeType.length) {
            console.log('no data');
            return;
        }
        console.log(this.ingredients);
        console.log(this.filters);
        return;
    };
    return SearchPage;
}());
SearchPage = __decorate([
    core_1.Component({
        templateUrl: 'build/pages/search/search.html'
    }),
    __metadata("design:paramtypes", [ionic_angular_1.AlertController,
        ionic_angular_1.ToastController,
        services_1.DataService])
], SearchPage);
exports.SearchPage = SearchPage;
