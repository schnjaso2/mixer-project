import { Injectable, EventEmitter } from '@angular/core';

@Injectable()

export class AudioService
{
  // _________________________________________Base Audio Elements
  private _audioContext: AudioContext;
  private _decodedAudio: AudioBuffer;
  private _audioSource: AudioBufferSourceNode;
  private _gainNode: GainNode;

  private _fxContext: AudioContext;
  private _fxGainNode: GainNode;
  private _fxSource: AudioBufferSourceNode;

  // ___________________________________________Equilizer Nodes
  private _eqHi: BiquadFilterNode;
  private _eqMid: BiquadFilterNode;
  private _eqLo: BiquadFilterNode;
  private _eqSweep: BiquadFilterNode;

  // ___________________________________________Effects
  private _delay: DelayNode;
  private _delayFeedback: GainNode;
  private _delayFilter: BiquadFilterNode;
  private _delayGain: GainNode;

  private _reverb: ConvolverNode;
  private _reverbFilter: BiquadFilterNode;
  private _reverbGain: GainNode;

  public decodedAudioEmitter: EventEmitter<object>;
  public playStateEmitter: EventEmitter<boolean>;

  private CreateContext()
  {
    this._audioContext = new AudioContext();
    this._fxContext = new AudioContext();
    this._audioContext.suspend();
  }

  private CreatePlayBuffer()
  {
    this._audioSource = this._audioContext.createBufferSource();
    this._audioSource.buffer = this._decodedAudio;
    this._audioSource.connect(this._eqLo);
  }

  private CreateFxBuffer()
  {
    this._fxSource = this._fxContext.createBufferSource();
    this._fxSource.buffer = this._decodedAudio;
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
    // ____________________________________________________Equilizer BAND PASS Connection
    this._eqSweep = this._audioContext.createBiquadFilter();
    this._eqSweep.type = 'bandpass';
    this._eqSweep.frequency.setValueAtTime(1000, 0);
    this._eqSweep.Q.setValueAtTime(0, 0);
    this._eqSweep.connect(this._eqLo);
  }

  private SetFxConnections()
  {
    if (!this._fxContext)
    {
      console.log('There is no active effects context!');
      return;
    }
    // ____________________________________________________Output Gain Connection
    this._fxGainNode = this._fxContext.createGain();
    this._fxGainNode.connect(this._fxContext.destination);

    // ____________________________________________________Delay Connection
    this._delay = this._fxContext.createDelay();
    this._delay.delayTime.setValueAtTime(0.5, 0);

    this._delayFeedback = this._fxContext.createGain();
    this._delayFeedback.gain.setValueAtTime(0.5, 0);

    this._delayFilter = this._fxContext.createBiquadFilter();
    this._delayFilter.frequency.setValueAtTime(1000, 0);

    this._delayGain = this._fxContext.createGain();
    this._delayGain.connect(this._fxGainNode);
    this._delayGain.gain.setValueAtTime(0.5, 0);

    this._delay.connect(this._delayFeedback);
    this._delayFeedback.connect(this._delayFilter);
    this._delayFilter.connect(this._delay);
    this._delayFilter.connect(this._delayGain);

    // ____________________________________________________Reverb Connection
    this._reverb = this._fxContext.createConvolver();

    this._reverbFilter = this._fxContext.createBiquadFilter();
    this._reverbFilter.frequency.setValueAtTime(20000, 0);

    this._reverbGain = this._fxContext.createGain();
    this._reverbGain.connect(this._fxGainNode);
    this._reverbGain.gain.setValueAtTime(0.5, 0);

    this._reverbFilter.connect(this._reverbGain);
    // console.log('hola');
    // // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---Test Only
    // const request = new XMLHttpRequest();
    // const _this = this;
    // request.open('GET', 'assets/wav/Cathedral_a_mono.wav');
    // request.responseType = 'arraybuffer';

    // request.onload = () =>
    // {
    //   const impulseData = request.response;

    //   _this._fxContext.decodeAudioData(impulseData, (buffer) =>
    //   {
    //     console.log(buffer);
    //     _this._reverb.buffer = buffer;
    //     _this._reverb.normalize = true;
    //     _this._reverb.connect(_this._reverbFilter);
    //   }, (e) => { console.log('Error with decoding audio data' + e); });
    // };

  }
  // ________________________________________________________Public Methods
  public LoadFile(file: ArrayBuffer)
  {
    if (this._audioContext)
    {
      this.StopAudio();
    }

    this.CreateContext();
    this._audioContext.decodeAudioData(file)
      .then(decodedData =>
      {
        this._decodedAudio = decodedData;

        this.SetConnections();
        this.SetFxConnections();

        this.CreatePlayBuffer();
        this.CreateFxBuffer();

        this.decodedAudioEmitter.emit(this._decodedAudio);
      });
  }

  public StartAudio()
  {
    if (this._audioContext)
    {
      this._audioContext.resume();

      this._audioSource.start(0, this._audioContext.currentTime);
      this._fxSource.start(0, this._audioContext.currentTime);

      this.playStateEmitter.emit(true);
    }
  }

  public PauseAudio()
  {
    this._audioContext.suspend();

    this._audioSource.stop();
    this._fxSource.stop();

    this.CreatePlayBuffer();
    this.CreateFxBuffer();

    this.playStateEmitter.emit(false);
  }

  public StopAudio()
  {
    this._audioContext.close();
    this._fxContext.close();

    this.playStateEmitter.emit(false);
  }

  // ________________________________________________________Connection Togglers
  public DelayOn() { this._delay ? this._fxSource.connect(this._delay) : console.log('No Fx Context'); }
  public DelayOff() { this._delay ? this._fxSource.disconnect(this._delay) : console.log('No Fx Context'); }

  public ReverbOn() { this._reverb ? this._fxSource.connect(this._reverb) : console.log('No Fx Context'); }
  public ReverbOff() { this._reverb ? this._fxSource.disconnect(this._reverb) : console.log('No Fx Context'); }

  public KillFx()
  {
    this._fxContext.close();
    this._fxContext = new AudioContext();
    this.SetFxConnections();
  }

  // ________________________________________________________Public Setters
  public set gain(inputValue: number) { this._gainNode.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set detune(inputValue: number) { this._audioSource.playbackRate.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set eqHi(inputValue: number) { this._eqHi.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set eqMid(inputValue: number) { this._eqMid.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set eqLo(inputValue: number) { this._eqLo.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }

  public set delayTime(inputValue: number) { this._delay.delayTime.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set delayFeedback(inputValue: number) { this._delayFeedback.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set delayFilter(inputValue: number) { this._delayFilter.frequency.setValueAtTime(inputValue, this._audioContext.currentTime); }
  public set delayGain(inputValue: number) { this._delayGain.gain.setValueAtTime(inputValue, this._audioContext.currentTime); }

  // ________________________________________________________Public Getters
  public get audioDuration() { return this._decodedAudio.duration; }
  public get contextTimer() { return this._audioContext.currentTime; }

  constructor()
  {
    // this._audioSource = null;
    // this._audioContext = null;
    // this._decodedAudio = null;
    // this._gainNode = null;

    // this._eqHi = null;
    // this._eqMid = null;
    // this._eqLo = null;
    // this._eqSweep = null;

    // this._delay = null;
    // this._delayFeedback = null;
    // this._delayFilter = null;
    // this._delayGain = null;
    // this._reverb = null;
    // this._reverbFilter = null;
    // this._reverbGain = null;

    this.decodedAudioEmitter = new EventEmitter();
    this.playStateEmitter = new EventEmitter();
  }
}
