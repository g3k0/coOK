import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HammerGesturesDirective} from '../../directives/hammerGesturesDirective';

@Component({
	templateUrl: 'build/pages/info/info.html',
  directives: [HammerGesturesDirective],

})

export class InfoPage {
  
	constructor(
		private nav: NavController
	) {

  }

  /**
   * gesture directive function
   * @param {string} the event catched by the div tag of the directive
   */
	doSwipe(direction: string) {
    switch (direction) {
      case 'swiperight':
        this.nav.pop();
        break;
      default:
        break;
    }
  }
}
