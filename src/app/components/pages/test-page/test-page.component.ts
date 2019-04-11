import { FilesService } from './../../../services/files.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {
  @ViewChild('audio') audioElement: ElementRef;
  public fileLoaded: any;
  public audio: HTMLAudioElement;
  constructor(public fileservice: FilesService) { }

  public OpenFiles(event: any)
  {
    const file = event.target.files[0];
    this.fileservice.Read(file, 'a');
  }

  public Play()
  {
    this.audio.paused ? this.audio.play() : this.audio.pause();
  }

  ngOnInit()
  {
    this.fileservice.song.subscribe(file =>
    {
      this.fileLoaded = file.data;
    });

    this.audio = this.audioElement.nativeElement;
  }

}
