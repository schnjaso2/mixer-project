import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class AudioService
{
  private _audioElement: HTMLAudioElement;
  // _________________________________________Base Audio Elements
  private _audioContext: AudioContext;
  private _audioSource: MediaElementAudioSourceNode;
  private _decodedAudio: AudioBuffer;
  private _gainNode: GainNode;

  // ___________________________________________Equilizer Nodes
  private _eqHi: BiquadFilterNode;
  private _eqMid: BiquadFilterNode;
  private _eqLo: BiquadFilterNode;
  private _eqSweep: BiquadFilterNode;

  // ___________________________________________Effects Nodes
  private _delay: DelayNode;
  private _delayFeedback: GainNode;
  private _delayFilter: BiquadFilterNode;
  private _delayGain: GainNode;

  private _reverb: ConvolverNode;
  private _reverbFilter: BiquadFilterNode;
  private _reverbGain: GainNode;

  // ___________________________________________Event Emitters
  public decodedAudioEmitter: EventEmitter<object>;
  public timerUpdatedEmitter: EventEmitter<number>;

  private CreateContext()
  {
    this._audioContext = new AudioContext();
  }

  private async CreatePlayBuffer()
  {
    this._audioSource = this._audioContext.createMediaElementSource(this._audioElement);
  }

  private SetConnections()
  {
    if (!this._audioContext)
    {
      console.log('There is no active audio context!');
      return;
    }

    // ____________________________________________________Output Gain Connection
    this._gainNode = this._audioContext.createGain();
    this._gainNode.connect(this._audioContext.destination);

    // ____________________________________________________Equilizer HI Band Connection
    this._eqHi = this._audioContext.createBiquadFilter();
    this._eqHi.type = 'highshelf';
    this._eqHi.frequency.setValueAtTime(2400, 0);
    this._eqHi.connect(this._gainNode);
    // ____________________________________________________Equilizer MID Band Connection
    this._eqMid = this._audioContext.createBiquadFilter();
    this._eqMid.type = 'peaking';
    this._eqMid.frequency.setValueAtTime(800, 0);
    this._eqMid.connect(this._eqHi);
    // ____________________________________________________Equilizer LO Band Connection
    this._eqLo = this._audioContext.createBiquadFilter();
    this._eqLo.type = 'lowshelf';
    this._eqLo.frequency.setValueAtTime(80, 0);
    this._eqLo.connect(this._eqMid);

    // ____________________________________________________Audio Element Connection
    this._audioSource.connect(this._eqLo);

    // ____________________________________________________Delay Connection
    this._delay = this._audioContext.createDelay();
    this._delay.delayTime.setValueAtTime(0.5, 0);

    this._delayFeedback = this._audioContext.createGain();
    this._delayFeedback.gain.setValueAtTime(0.5, 0);

    this._delayFilter = this._audioContext.createBiquadFilter();
    this._delayFilter.frequency.setValueAtTime(1000, 0);

    this._delayGain = this._audioContext.createGain();
    this._delayGain.connect(this._gainNode);
    this._delayGain.gain.setValueAtTime(0.5, 0);

    this._delay.connect(this._delayFeedback);
    this._delayFeedback.connect(this._delayFilter);
    this._delayFilter.connect(this._delay);
    this._delayFilter.connect(this._delayGain);

    // ____________________________________________________Reverb Connection
    this._reverb = this._audioContext.createConvolver();

    this._reverbFilter = this._audioContext.createBiquadFilter();
    this._reverbFilter.frequency.setValueAtTime(20000, 0);

    this._reverbGain = this._audioContext.createGain();
    this._reverbGain.connect(this._gainNode);
    this._reverbGain.gain.setValueAtTime(0.5, 0);

    this._reverbFilter.connect(this._reverbGain);
    this.httpClient.get('assets/wav/Cathedral_a_mono.wav', { responseType: 'arraybuffer' })
      .subscribe(response =>
      {
        this._audioContext.decodeAudioData(response, (buffer) =>
        {
          console.log(buffer);
          this._reverb.buffer = buffer;
          this._reverb.normalize = true;
          this._reverb.connect(this._reverbFilter);
        }, (e) => { console.log('Error with decoding audio data' + e); });
      });

  }

  // ________________________________________________________Public Methods
  public LoadFile(fileUrl: any, arrayBuffer: ArrayBuffer)
  {
    this._audioElement.src = fileUrl;
    this.CreateContext();
    this.CreatePlayBuffer();
    this.SetConnections();

    this._audioContext.decodeAudioData(arrayBuffer)
      .then(decodedData => this.decodedAudioEmitter.emit(decodedData));

    this._audioElement.ontimeupdate = () =>
      this.timerUpdatedEmitter.emit(Number(this._audioElement.currentTime));
  }

  public PlayPauseAudio()
  {
    this._audioElement.paused ? this._audioElement.play() : this._audioElement.pause();
  }

  public DelayToggler(delayState: boolean)
  {
    delayState ? this._audioSource.connect(this._delay) : this._audioSource.disconnect(this._delay);
  }

  public ReverbToggler(reverbState: boolean)
  {
    reverbState ? this._audioSource.connect(this._reverb) : this._audioSource.disconnect(this._reverb);
  }

  // ________________________________________________________Public Setters
  public set gain(inputValue: number) { this._gainNode.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  // public set detune(inputValue: number) { this._audioSource.playbackRate.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set eqHi(inputValue: number) { this._eqHi.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set eqMid(inputValue: number) { this._eqMid.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set eqLo(inputValue: number) { this._eqLo.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }

  public set delayGain(inputValue: number) { this._delayGain.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set reverbGain(inputValue: number) { this._reverbGain.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }

  // ________________________________________________________Public Getters
  public get audioDuration() { return this._audioElement.duration; }

  constructor(private httpClient: HttpClient)
  {
    this._audioElement = new Audio();
    this._audioElement.crossOrigin = 'anonymous';

    this.decodedAudioEmitter = new EventEmitter();
    this.timerUpdatedEmitter = new EventEmitter();
  }
}
