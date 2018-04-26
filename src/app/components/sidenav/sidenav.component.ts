import { FilesService } from './../../services/files.service';
import { Component, OnInit } from '@angular/core';
import * as mm from 'music-metadata';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit
{
  public playList = [];
  public collapsed = true;
  constructor(public fileHandler: FilesService) { }

  ngOnInit()
  {

  }

  public OpenFiles(event: any)
  {
    const filesObject = event.target.files;
    const filesArray = Object.keys(filesObject).map(key => filesObject[key]);

    // this.playList = filesArray.map(file => this.fileHandler.ReadID3(file));
    console.log(this.playList);
  }

  public LoadTrack(track: any)
  {
    // this.fileHandler.Read(track);
    // this.fileHandler.ReadID3(track);
  }
}
