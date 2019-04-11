import { Component, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { knob } from '../../settings/knob';

@Component({
  selector: 'app-eq3band',
  templateUrl: './eq3band.component.html',
  styleUrls: ['./eq3band.component.css']
})
export class Eq3bandComponent implements OnInit {
  @Output('HiBandChanged') OnHiBandChanged = new EventEmitter<number>();
  @Output('MidBandChanged') OnMidBandChanged = new EventEmitter<number>();
  @Output('LoBandChanged') OnLoBandChanged = new EventEmitter<number>();
  
  public eqKnob = knob.eq;  
  constructor() { }

  ngOnInit() {
  }

}
