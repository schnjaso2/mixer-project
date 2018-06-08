// import { Track } from './../track.interface';
import { Injectable, EventEmitter } from '@angular/core';


@Injectable()

export class FilesService
{
  public song = new EventEmitter();

  public Read(file: any, deck: string): void
  {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => this.song.emit(
      {
        deck: deck,
        dataURL: URL.createObjectURL(file),
        arrayBuffer: fileReader.result
      });
  }

  constructor()
  {
  }
}
