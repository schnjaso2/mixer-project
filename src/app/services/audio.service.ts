import { Injectable, EventEmitter } from '@angular/core';
import { FilesService } from './files.service';

@Injectable()

export class AudioService
{
  // _________________________________________Base Audio Elements
  private _context: AudioContext;
  private _decodedAudio: AudioBuffer;
  private _audioSource: AudioBufferSourceNode;
  private _gainNode: GainNode;

  // ___________________________________________Equilizer Nodes
  private _eqHi: BiquadFilterNode;
  private _eqMid: BiquadFilterNode;
  private _eqLo: BiquadFilterNode;
  private _eqSweep: BiquadFilterNode;

  public decodedAudioEmitter: EventEmitter<object>;

  constructor(private filesService: FilesService)
  {
    this._audioSource = null;
    this._context = null;
    this._decodedAudio = null;
    this._gainNode = null;

    this._eqHi = null;
    this._eqMid = null;
    this._eqLo = null;
    this._eqSweep = null;

    this.decodedAudioEmitter = new EventEmitter();
    this.filesService.song.subscribe(song => this.LoadFile(song));
  }

  private CreateContext()
  {
    if (this._context !== null)
    {
      this._context.close();
    }

    this._context = new AudioContext();
    this._context.suspend();
  }

  private CreatePlayBuffer()
  {
    this._audioSource = this._context.createBufferSource();
    this._audioSource.connect(this._eqSweep);
    this._audioSource.buffer = this._decodedAudio;
  }

  private SetConnections()
  {
    if (this._context === null)
    {
      console.log('There is no active audio context!');
      return;
    }
    // ____________________________________________________Output Gain Connection
    this._gainNode = this._context.createGain();
    this._gainNode.connect(this._context.destination);
    this._gainNode.gain.value = 0.5;
    // ____________________________________________________Equilizer HI Band Connection
    this._eqHi = this._context.createBiquadFilter();
    this._eqHi.type = 'highshelf';
    this._eqHi.frequency.value = 2400;
    this._eqHi.connect(this._gainNode);
    // ____________________________________________________Equilizer MID Band Connection
    this._eqMid = this._context.createBiquadFilter();
    this._eqMid.type = 'peaking';
    this._eqMid.frequency.value = 600;
    this._eqMid.connect(this._eqHi);
    // ____________________________________________________Equilizer LO Band Connection
    this._eqLo = this._context.createBiquadFilter();
    this._eqLo.type = 'lowshelf';
    this._eqLo.frequency.value = 60;
    this._eqLo.connect(this._eqMid);
    // ____________________________________________________Equilizer BAND PASS Connection
    this._eqSweep = this._context.createBiquadFilter();
    this._eqSweep.type = 'bandpass';
    this._eqSweep.frequency.value = 1000;
    this._eqSweep.Q.value = 0;
    this._eqSweep.connect(this._eqLo);
  }
  // ________________________________________________________Public Methods
  private LoadFile(file: ArrayBuffer)
  {
    if (this._context !== null && this._context.state === 'running')
    {
      return;
    }
    this.CreateContext();
    this.SetConnections();

    this._context.decodeAudioData(file)
      .then(decodedData =>
      {
        this._decodedAudio = decodedData;
        this.CreatePlayBuffer();
        this.decodedAudioEmitter.emit(this._decodedAudio);
      });
  }

  public StartAudio()
  {
    if (this._context === null)
    {
      console.log('There is no active audio context!');
      return;
    }
    this._context.resume();
    this._audioSource.start(0, this.contextTimer);
  }

  public StopAudio()
  {
    this._audioSource.stop();
    this._context.suspend();
    this.CreatePlayBuffer();
  }
  // ________________________________________________________Public Setters
  public set gain(inputValue: number) { this._gainNode.gain.value = inputValue; }
  public set detune(inputValue: number) { this._audioSource.playbackRate.value = inputValue; }
  public set eqHi(inputValue: number) { this._eqHi.gain.value = inputValue; }
  public set eqMid(inputValue: number) { this._eqMid.gain.value = inputValue; }
  public set eqLo(inputValue: number) { this._eqLo.gain.value = inputValue; }
  public set eqSweep(inputValue: number)
  {

  }
  // ________________________________________________________Public Getters
  public get audioDuration() { return this._decodedAudio.duration; }
  public get contextTimer() { return this._context.currentTime; }
}
