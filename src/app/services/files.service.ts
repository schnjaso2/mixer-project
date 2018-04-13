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

  public ReadID3(file: any): string[]
  {
    const fileReader = new FileReader();
    let tagString: string;
    const tagArray = ['', '', '', ''];

    fileReader.readAsText(file);
    fileReader.onload = () =>
    {
      tagString = fileReader.result.slice(-128, fileReader.result.length);
      if (tagString.substring(0, 3) === 'TAG')
      {
        let marker = 3;
        tagArray.forEach((el, i) =>
        {
          tagArray[i] = tagString.substr(marker, 30);
          marker += 30;
        });
      }
      else
      {
        console.log('Will implement support for other fileTypes soon');
      }

    };
    return tagArray;
  }
}
