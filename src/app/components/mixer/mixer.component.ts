import { Component, OnInit, HostBinding, EventEmitter, Output } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-mixer',
  templateUrl: './mixer.component.html',
  styleUrls: ['./mixer.component.css']
})

export class MixerComponent implements OnInit
{
  @HostBinding('class') classes = 'col-xl-2 col-md-4';
  @Output() OnVolumeAChanged = new EventEmitter<number>();
  @Output() OnVolumeBChanged = new EventEmitter<number>();
  @Output() OnHiBandAChanged = new EventEmitter<number>();
  @Output() OnHiBandBChanged = new EventEmitter<number>();

  private _knobSize: number;

  public knobOptions: any;

  public deckASliderColor: string;
  public deckBSliderColor: string;

  public volumeAValue: number;
  public volumeBValue: number;

  public hiBandAValue: number;
  public midBandAValue: number;
  public loBandAValue: number;

  public hiBandBValue: number;
  public midBandBValue: number;
  public loBandBValue: number;

  private _crossFadeAValue: number;
  private _crossFadeBValue: number;

  public OnVolumeAChange(value: number) { this.volumeAValue = value; }
  public OnVolumeBChange(value: number) { this.volumeBValue = value; }

  public OnHiBandAChange(value: number) { this.hiBandAValue = value; }
  public OnMidBandAChange(value: number) { this.midBandAValue = value; }
  public OnLoBandAChange(value: number) { this.loBandAValue = value; }

  public OnHiBandBChange(value: number) { this.hiBandBValue = value; }
  public OnMidBandBChange(value: number) { this.midBandBValue = value; }
  public OnLoBandBChange(value: number) { this.loBandBValue = value; }

  private onCrossFade(value: any)
  {
    this._crossFadeBValue = value;
    this._crossFadeAValue = ((value - 1) * -1 + 1);

    this.deckASliderColor = this.ChangeSliderFillColor(this._crossFadeAValue + 0.1);
    this.deckBSliderColor = this.ChangeSliderFillColor(this._crossFadeBValue + 0.1);

    this.OnVolumeAChange(this.volumeAValue);
    this.OnVolumeBChange(this.volumeBValue);
  }

  private ChangeSliderFillColor(value: number): string
  {
    const r = 49;
    const g = 176;
    const b = 213;
    return `rgb(${r * value}, ${g * value}, ${b * value})`;
  }

  constructor()
  {
    this._crossFadeAValue = this._crossFadeBValue = this.volumeAValue = this.volumeBValue = 0.5;
  }

  ngOnInit()
  {
    this.deckASliderColor = this.ChangeSliderFillColor(1);
    this.deckBSliderColor = this.ChangeSliderFillColor(1);

    // if(screen.width == )
    this.knobOptions = {
      readOnly: false,
      displayInput: false,
      size: 45,
      startAngle: -160,
      endAngle: 160,
      unit: '%',
      min: -35,
      max: 35,
      trackWidth: 5,
      barWidth: 5,
      trackColor: '#000',
      barColor: '#49afd9',
      bgColor: '#0F171C',
      bgFull: true,
      scale: {
        enabled: true,
        type: 'dots',
        color: '#49afd9',
        width: 1,
        quantity: 20,
        height: 2,
        spaceWidth: 5
      },
      animate: {
        enabled: true,
        duration: 1000,
        ease: 'linear'
      },
    };


  }
}
