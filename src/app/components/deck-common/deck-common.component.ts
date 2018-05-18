import { FilesService } from './../../services/files.service';
import { Component, OnInit, Input, ViewContainerRef, TemplateRef, ViewChild, HostBinding, ElementRef } from '@angular/core';
import { AudioService } from './../../services/audio.service';
import { VisualsService } from '../../services/visuals.service';
import { Settings } from '../../settings';

@Component({
  selector: 'app-deck-common',
  templateUrl: './deck-common.component.html',
  styleUrls: ['./deck-common.component.css'],
  providers: [AudioService, VisualsService]
})
export class DeckCommonComponent implements OnInit
{
  @Input() deck: string;
  @Input() set volume(value: number)
  {
    this.SetValue('gain', value);
    this._lastSettings[0] = value;
    if (this._soundWaveCanvas)
    {
      this._soundWaveCanvas.style.opacity = (value + 0.4).toString();
    }
  }
  @Input() set eqHi(value: number) { this.SetValue('eqHi', value); this._lastSettings[1] = value; }
  @Input() set eqMid(value: number) { this.SetValue('eqMid', value); this._lastSettings[2] = value; }
  @Input() set eqLo(value: number) { this.SetValue('eqLo', value); this._lastSettings[3] = value; }

  @HostBinding('class') classes = 'col-xl-5 col-md-8';
  @ViewChild('canvasWindow', {read: ViewContainerRef} ) canvasWindow: ViewContainerRef;
  @ViewChild('canvasTemplate') canvasTemplate: TemplateRef<any>;
  @ViewChild('canvas') canvas: ElementRef;
  // An Array to remember last used settings, so th newly loaded song will be the same volume,
  // and have same eq settings.. order is 0: volume, 1: Eq High, 2: Eq Mid, 3: Eq Low.
  private _lastSettings: Array<number> = [0.5, 0.5, 0.5, 0.5];

  // ___________________________________________________Indicators
  private _timer: any;
  private _soundWaveCanvas: HTMLCanvasElement;
  public duration: number;
  public currentTime: number;

  public playState: boolean;
  public delayState: boolean;
  public reverbState: boolean;

  private onFileLoaded(audioData: AudioBuffer)
  {
    this.canvasWindow.clear();
    this.canvasWindow.createEmbeddedView(this.canvasTemplate);
    this._soundWaveCanvas = this.canvasWindow.element.nativeElement.nextElementSibling;
    this._visualsService.renderWaveForm(audioData, this._soundWaveCanvas);

    this.duration = this._audioService.audioDuration;
    // _________________________________Setting values from the last used settings
    this.SetValue('gain', this._lastSettings[0]);
    this.SetValue('eqHi', this._lastSettings[1]);
    this.SetValue('eqMid', this._lastSettings[2]);
    this.SetValue('eqLo', this._lastSettings[3]);
  }

  private Play(): void
  {
    this._audioService.StartAudio();
    this.StartTimer();
  }

  private Pause(): void
  {
    this._audioService.PauseAudio();
    this.StopTimer();
    if (this.delayState) { this._audioService.DelayOn(); }
    if (this.reverbState) { this._audioService.ReverbOn(); }
  }

  private StartTimer(): void
  {
    if (this.playState)
    {
      this._timer = setInterval(() =>
        this.currentTime = this._audioService.contextTimer, 500);
    }
  }

  private StopTimer(): void
  {
    clearInterval(this._timer);
    this._timer = null;
  }

  private ToggleDelay()
  {
    !this.delayState ? this._audioService.DelayOn() : this._audioService.DelayOff();
    this.delayState = !this.delayState;
  }

  public OnDelayGainChange(value: number) { this.SetValue('delayGain', value / 100); }

  private ToggleReverb()
  {
    !this.reverbState ? this._audioService.ReverbOn() : this._audioService.ReverbOff();
    this.reverbState = !this.reverbState;
  }

  private KillFx()
  {
    this._audioService.KillFx();
    this.delayState = false;
    this.reverbState = false;
  }

  private onSpeedChange(value: number)
  {
    this._audioService.detune = value;
    this.duration = this._audioService.audioDuration * ((value - 1) * -1 + 1);
  }

  private SetValue(destination: string, value: number)
  {
    try
    {
      this._audioService[destination] = value;
    } catch
    {
      console.log('No Audio Context To Connect To');
    }
  }

  constructor(
    private _audioService: AudioService,
    private _visualsService: VisualsService,
    private _filesService: FilesService,
    public settings: Settings) {}

  ngOnInit()
  {
    this._timer = null;
    this.currentTime = 0;
    this.duration = 0;
    this.delayState = false;
    this.reverbState = false;

    this._filesService.song.subscribe(song =>
    {
      if (song.deck === this.deck)
      {
        this._audioService.LoadFile(song.data);
      }
    });

    this._audioService.decodedAudioEmitter
      .subscribe(audioData => this.onFileLoaded(audioData));
    this._audioService.playStateEmitter.subscribe(state => this.playState = state);
  }
}
