import { Component } from '@angular/core';
import { InfoPage } from '../info/info';
import { GuidePage } from '../guide/guide';
import { VoteUsPage } from '../vote-us/vote-us';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
  providers: [
  	InfoPage,
    GuidePage,
    VoteUsPage
  ]
})
export class MenuPage {

  constructor() {

  }

}