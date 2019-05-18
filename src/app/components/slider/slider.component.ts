import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

type PanFunction = (input: number, slider: SliderComponent) => void;

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @Input() length = 200;
  @Input() maxValue = 100;
  @Input() minValue = 0;
  @Input() step = 1;
  @Input() initialValue = 0;
  @Input() vertical = false;
  @Input() twoWay = false;
  @Input() scale = false;
  @Output() value = new EventEmitter();

  @ViewChild('track') trackRef: ElementRef;
  public track: HTMLDivElement;

  @ViewChild('fill') fillRef: ElementRef;
  public fill: HTMLDivElement;

  @ViewChild('thumb') thumbRef: ElementRef;
  public thumb: HTMLDivElement;

  public isPanning: boolean;
  private valueRange: number;
  private visualCenter: number;
  private sliderTop: number;
  private sliderBottom: number;

  ngOnInit() {
    // Validating input values
    if (this.minValue >= this.maxValue) {
      throw RangeError('Min value can not be higher or equal to Max value!');
    }
    if (this.initialValue > this.maxValue || this.initialValue < this.minValue) {
      throw RangeError('Slider initial value out of range!');
    }
    if (this.step < 0) {
      throw RangeError('Slider steps can not be zero or negative!');
    }

    // Setting default values
    this.track = this.trackRef.nativeElement;
    this.fill = this.fillRef.nativeElement;
    this.thumb = this.thumbRef.nativeElement;
    this.track.style.height = `${this.length}px`;

    this.sliderTop = this.track.getBoundingClientRect().top;
    this.sliderBottom = this.track.getBoundingClientRect().bottom;
    this.isPanning = false;

    // Setting calculated Values
    this.valueRange = this.maxValue - this.minValue;
    this.visualCenter = this.length / 2;

    let panFunction: PanFunction;
    const initialValueInPercent = this.initialValue * (100 / this.valueRange);
    const initialPosition = this.sliderBottom - initialValueInPercent * (this.length / 100);
    console.log(initialPosition);
    if (!this.twoWay) {
      panFunction = this.oneWayPan;
      this.oneWayPan(initialPosition, this);
    } else {
      panFunction = this.twoWayPan;
      // this.twoWayPan(initialPosition, this);
      // this.fill.style.transform = `translateY(-${this.visualCenter}px)`;
    }

    // Setting up Event handlers

    this.thumb.addEventListener('dblclick', () => panFunction(this.visualCenter, this));
    this.thumb.addEventListener('mousedown', () => this.isPanning = true);
    document.addEventListener('mousemove', event => this.onPan(event, panFunction));
    document.addEventListener('mouseup', () => this.isPanning = false);
  }

  private onPan(event: MouseEvent, panFunciton: PanFunction): void {
    if (!this.isPanning) {
      return;
    }

    const currentPosition = this.vertical ? event.clientY : event.clientX;
    const inputInPx = this.sliderBottom - currentPosition;
    const inputInPercent = inputInPx * (100 / this.length);
    const value = inputInPercent * (this.valueRange / 100) + this.minValue;

    if (currentPosition < this.sliderTop || currentPosition > this.sliderBottom) {
      return;
    }

    panFunciton(inputInPx, this);

    console.log(value);
    this.value.emit(value);
  }


  private oneWayPan(input: number, slider: SliderComponent) {
    slider.fill.style.height = `${input}px`;
  }

  private twoWayPan(input: number, slider: SliderComponent): void {

    const value = input - slider.visualCenter;
    const scale = value > 0 ? 1 : -1;
    const origin = scale === 1 ? 'top' : 'bottom';
    const height = Math.round(value * scale);
    const translate = Math.round(slider.visualCenter * -scale);

    slider.fill.style.transformOrigin = origin;
    slider.fill.style.transform = `scaleY(${scale}) translateY(${translate}px)`;
    slider.fill.style.height = `${height}px`;
  }
}
