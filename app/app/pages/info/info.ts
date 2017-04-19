import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CalendarPage} from '../calendar/calendar';
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

    if (direction === 'swiperight') {
      //this.nav.parent.select(2);
      //this.nav.parent.previousTab(true);
      this.nav.setRoot(CalendarPage);
    }

  }
}
