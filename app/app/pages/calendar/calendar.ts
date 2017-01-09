import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/calendar/calendar.html'
})
export class CalendarPage {
  flipped: boolean = false;
 
  constructor() {
 
  }
 
  flip(){
    this.flipped = !this.flipped;
  }
}
