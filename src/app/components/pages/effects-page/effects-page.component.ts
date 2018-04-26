import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-effects-page',
  templateUrl: './effects-page.component.html',
  styleUrls: ['./effects-page.component.css']
})
export class EffectsPageComponent implements OnInit {
  @HostBinding('class') classes = 'bottom-content';
  constructor() { }

  ngOnInit() {
  }

}
