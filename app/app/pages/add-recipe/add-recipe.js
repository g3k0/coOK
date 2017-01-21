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
var ionic_angular_2 = require("ionic-angular");
var recipe_1 = require("../recipe/recipe");
var AddRecipePage = (function () {
    function AddRecipePage(viewCtrl, http, modalCtrl) {
        var _this = this;
        this.viewCtrl = viewCtrl;
        this.http = http;
        this.modalCtrl = modalCtrl;
        this.http.get('./saved_recipes.json')
            .subscribe(function (res) {
            _this.items = res.json();
        });
    }
    /**
     * Modal partial view closing method
     */
    AddRecipePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    /**
     * Modal page loading method
     */
    AddRecipePage.prototype.presentModal = function () {
        var modal = this.modalCtrl.create(recipe_1.RecipePage);
        modal.present();
    };
    return AddRecipePage;
}());
__decorate([
    core_1.ViewChild(recipe_1.RecipePage),
    __metadata("design:type", recipe_1.RecipePage)
], AddRecipePage.prototype, "RecipePage", void 0);
AddRecipePage = __decorate([
    core_1.Component({
        templateUrl: 'build/pages/add-recipe/add-recipe.html',
        selector: 'add-recipe',
        directives: [recipe_1.RecipePage]
    }),
    __metadata("design:paramtypes", [ionic_angular_1.ViewController,
        http_1.Http,
        ionic_angular_2.ModalController])
], AddRecipePage);
exports.AddRecipePage = AddRecipePage;
