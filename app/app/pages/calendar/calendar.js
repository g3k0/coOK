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
var recipe_1 = require("../recipe/recipe");
var add_recipe_1 = require("../add-recipe/add-recipe");
var CalendarPage = (function () {
    function CalendarPage(modalCtrl) {
        this.modalCtrl = modalCtrl;
        this.flipped = false;
    }
    /**
     * Flip the day detail page
     */
    CalendarPage.prototype.flip = function () {
        this.flipped = !this.flipped;
    };
    /**
     * Modal page loading method
     */
    CalendarPage.prototype.presentModalRecipe = function () {
        var modal = this.modalCtrl.create(recipe_1.RecipePage);
        modal.present();
    };
    CalendarPage.prototype.presentModalAddRecipe = function () {
        var modal = this.modalCtrl.create(add_recipe_1.AddRecipePage);
        modal.present();
    };
    return CalendarPage;
}());
__decorate([
    core_1.ViewChild(recipe_1.RecipePage),
    __metadata("design:type", recipe_1.RecipePage)
], CalendarPage.prototype, "RecipePage", void 0);
CalendarPage = __decorate([
    core_1.Component({
        templateUrl: 'build/pages/calendar/calendar.html',
        directives: [recipe_1.RecipePage, add_recipe_1.AddRecipePage]
    }),
    __metadata("design:paramtypes", [ionic_angular_1.ModalController])
], CalendarPage);
exports.CalendarPage = CalendarPage;
