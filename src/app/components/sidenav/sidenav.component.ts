import { FilesService } from './../../services/files.service';
import { Component, OnInit } from '@angular/core';
import { MediaTags } from 'jsmediatags';

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
    this.playList = event.target.files;
  }

  public LoadTrack(track: any)
  {
    this.fileHandler.Read(track);
  }
}
