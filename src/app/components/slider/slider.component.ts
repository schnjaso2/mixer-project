import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @Input() length = 200;
  @Input() maxValue = 400;
  @Input() minValue = 0;
  @Input() step = 20;
  @Input() initialValue = 50;
  @Input() vertical = false;
  @Input() twoWay = false;
  @Input() scale = false;
  @Output() value = new EventEmitter();

  @ViewChild('sliderTrack') sliderTrackRef: ElementRef;
  public sliderTrack: HTMLDivElement;

  @ViewChild('sliderValue') sliderValueRef: ElementRef;
  public sliderValue: HTMLDivElement;

  @ViewChild('sliderThumb') sliderThumbRef: ElementRef;
  public sliderThumb: HTMLDivElement;

  public isPanning: boolean;
  public singleUnitInPx: number;

  ngOnInit() {
    // Validating input values 
    if (this.minValue >= this.maxValue) {
      throw "Minimum value can not be equal to or larger than maximum value!";
    }
    if (this.initialValue > this.maxValue || this.initialValue < this.minValue) {
      throw "Slider initial value out of range!";
    }
    if (this.step < 0) {
      throw "Slider steps can not be zero or negative!";
    }

    // Setting default values
    this.sliderTrack = this.sliderTrackRef.nativeElement;
    this.sliderValue = this.sliderValueRef.nativeElement;
    this.sliderThumb = this.sliderThumbRef.nativeElement;
    this.isPanning = false;

    // Setting calculated Values
    this.singleUnitInPx = this.length / this.maxValue;
    this.sliderValue.style.height = `${this.initialValue * this.singleUnitInPx}px`;

    // Setting up Event handlers
    this.sliderThumb.addEventListener('mousedown', e => this.isPanning = true);
    document.addEventListener('mousemove', event => this.onPan(event));
    document.addEventListener('mouseup', () => this.isPanning = false);
  }

  private onPan(event: MouseEvent): void {
    if (!this.isPanning) {
      return;
    }
    const sliderTop = this.sliderTrack.getBoundingClientRect().top;
    const sliderBottom = this.sliderTrack.getBoundingClientRect().bottom;
    const currentPosition = this.vertical ? event.clientY : event.clientX;

    if (currentPosition < sliderTop || currentPosition > sliderBottom) {
      return;
    }

    const valueInPx = (sliderBottom - currentPosition);
    const valueWithSteps = Math.round(valueInPx / this.step) * this.step;
    const calculatedValue = valueInPx / this.singleUnitInPx;
    // valueInPx = Math.round(valueInPx / this.steps) * this.steps;

    this.sliderValue.style.height = `${valueInPx}px`;
    console.log(calculatedValue);
    this.value.emit(valueInPx);
  }
}
