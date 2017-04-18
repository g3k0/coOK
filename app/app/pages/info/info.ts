import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CalendarPage} from '../calendar/calendar';
import {HammerGesturesDirective} from '../../directives/hammerGesturesDirective';

@Component({
	templateUrl: 'build/pages/info/info.html',

})

export class InfoPage {
  
	constructor(
		private nav: NavController
	) {

		this.nav = nav;
		
  	}

  	doSwipe(direction: string) {

      console.log("Direction: ", direction);
      switch (direction) {
        case 'swiperight':
          this.nav.push(CalendarPage);
          break;
        default:
          break;
      }
        
    }
}
