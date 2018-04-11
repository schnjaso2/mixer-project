import { Injectable, EventEmitter } from '@angular/core';

@Injectable()

export class FilesService
{
  public song = new EventEmitter<ArrayBuffer>();

  public Read(file: any)
  {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = () => this.song.emit(fileReader.result);
  }

}
