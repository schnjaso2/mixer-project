import { FilesService } from './../../services/files.service';
import { Component, OnInit, Input, ViewContainerRef, TemplateRef, ViewChild, HostBinding, ElementRef } from '@angular/core';
import { AudioService } from './../../services/audio.service';
import { VisualsService } from '../../services/visuals.service';
import { knob } from '../../settings/knob';

@Component({
	selector: 'app-deck-common',
	templateUrl: './deck-common.component.html',
	styleUrls: ['./deck-common.component.css'],
})
export class DeckCommonComponent implements OnInit
{
	@Input() deck: string;
	@Input() set volume(value: number) {
		this.SetValue(this._audioService.gain, value);
		this._lastSettings[0] = value;
		if (this._soundWaveCanvas)
		{
			this._soundWaveCanvas.style.opacity = (value + 0.4).toString();
		}
	}
	@Input() set eqHi(value: number) {
		this.SetValue(this._audioService.eqHi, value); this._lastSettings[1] = value; 
	}
	@Input() set eqMid(value: number) {
		this.SetValue(this._audioService.eqMid, value); this._lastSettings[2] = value; 
	}
	@Input() set eqLo(value: number) {
		this.SetValue(this._audioService.eqLo, value); this._lastSettings[3] = value; 
	}
	
	@ViewChild('canvasWindow', { read: ViewContainerRef }) canvasWindow: ViewContainerRef;
	@ViewChild('canvasTemplate') canvasTemplate: TemplateRef<any>;
	@ViewChild('canvas') canvas: ElementRef;
	@ViewChild('audio') audioRef: ElementRef;
	// An Array to remember last used settings, so th newly loaded song will be the same volume,
	// and have same eq settings.. order is 0: volume, 1: Eq High, 2: Eq Mid, 3: Eq Low.
	private _lastSettings: Array<number> = [0.5, 0.5, 0.5, 0.5];
	
	public effectsKnob = knob.regular;
	// ___________________________________________________Indicators
	private _timer = null;
	private _soundWaveCanvas: HTMLCanvasElement;
	public duration = 0;
	public currentTime = 0;

	public playState = false;
	public delayState = false;
	public reverbState = false;

	private onFileLoaded(audioData: AudioBuffer)
	{
		this.canvasWindow.clear();
		this.canvasWindow.createEmbeddedView(this.canvasTemplate);
		this._soundWaveCanvas = this.canvasWindow.element.nativeElement.nextElementSibling;
		this._visualsService.renderWaveForm(audioData, this._soundWaveCanvas);

		this.duration = this._audioService.audioDuration;
		this._audioService.timerUpdatedEmitter.subscribe((t: number) => this.currentTime = t);

		// _________________________________Setting values from the last used settings
		this.SetValue(this._audioService.gain, this._lastSettings[0]);
		this.SetValue(this._audioService.eqHi, this._lastSettings[1]);
		this.SetValue(this._audioService.eqMid, this._lastSettings[2]);
		this.SetValue(this._audioService.eqLo, this._lastSettings[3]);
	}

	private PlayPause(): void
	{
		this._audioService.PlayPauseAudio();
		this.playState = !this.playState;
	}

	private ToggleDelay()
	{
		this.delayState = !this.delayState;
		this._audioService.DelayToggler(this.delayState);
	}

	public OnDelayGainChange(value: number)
	{
		this.SetValue(this._audioService.delayGain, value / 100); }

	private ToggleReverb()
	{
		this.reverbState = !this.reverbState;
		this._audioService.ReverbToggler(this.reverbState);
	}

	public OnReverbGainChange(value: number)
	{
		this.SetValue(this._audioService.reverbGain, value / 100); }

	private KillFx()
	{
		// this._audioService.KillFx();
		this.delayState = false;
		this.reverbState = false;
	}

	private onSpeedChange(value: number)
	{
		// this._audioService.detune = value;
		// this.duration = this._audioService.audioDuration * ((value - 1) * -1 + 1);
	}

	private SetValue(destination: number, value: number)
	{
		try
		{
			destination = value;

		} catch
		{
			console.log('No Audio Context To Connect To');
		}
	}

	constructor(
		private _audioService: AudioService,
		private _visualsService: VisualsService,
		private _filesService: FilesService) {}

	ngOnInit()
	{
		this._filesService.song.subscribe((song: any) =>
		{
			if (song.deck === this.deck)
			{
				this._audioService.LoadFile(song.dataURL, song.arrayBuffer);
			}
		});

		this._audioService.decodedAudioEmitter
			.subscribe((audioData: AudioBuffer) => this.onFileLoaded(audioData));
	}
}
