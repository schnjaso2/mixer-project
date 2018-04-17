import { FilesService } from './../../../services/files.service';
import { Component, OnInit, HostBinding } from '@angular/core';
import jsMediaTags = require('jsmediatags');
import { Band } from './../../../interfaces/band.interface';
import { Album } from './../../../interfaces/album.interface';
import { Song } from './../../../interfaces/song.interface';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})
export class PlaylistPageComponent implements OnInit
{
  @HostBinding('class') classes = 'bottom-content';

  public playList: Array<Band> = [];
  public albumsFiltered: Array<Album> = [];
  public songsFiltered: Array<Song> = [];
  public songSelected: Song = null;

  public OpenFiles(event: any): void
  {
    const filesObject = event.target.files;
    const filesArray = Object.keys(filesObject).map(key => filesObject[key]);
    for (const file of filesArray)
    {
      jsMediaTags.read(file, {
        onSuccess: metadata =>
        {
          const artistName = metadata.tags.artist || 'Unknown';
          const albumName = metadata.tags.album || 'Unknown';

          let bandObject: Band;
          let albumObject: Album;

          bandObject = this.playList.find(artist => artist.name === artistName);
          if (!bandObject)
          {
            this.playList.push({ name: artistName, albums: [] });
            bandObject = this.playList[this.playList.length - 1];
          }

          albumObject = bandObject.albums.find(album => album.name === albumName);
          if (!albumObject)
          {
            bandObject.albums.push({ name: albumName, songs: [] });
            albumObject = bandObject.albums[bandObject.albums.length - 1];
          }

          albumObject.songs.push({
            title: metadata.tags.title || file.name,
            data: file,
            duration: file.size,
            year: metadata.tags.year || 'Unknown',
            albumCover: 'string' || 'assets/img/album-art-placeholder.png'
          });
        }
      });
    }
    console.log(this.playList);
  }

  public allArtists()
  {
    this.albumsFiltered = [];
    this.albumsFiltered = this.playList
      .map(band => band.albums)
      .reduce((a, b) => a.concat(b));
  }

  public filterArtist(albums: Array<Album>) { this.albumsFiltered = albums; this.songsFiltered = []; }

  public allAlbums()
  {
    this.albumsFiltered = [];
    this.songsFiltered = this.albumsFiltered
      .map(album => album.songs)
      .reduce((a, b) => a.concat(b));
  }

  public filterAlbum(songs: Array<Song>) { this.songsFiltered = songs; }

  public SelectSong(song: Song) { this.songSelected = song; }

  public LoadInDeck(deck: string)
  {
    console.log(this.songSelected);
    if (this.songSelected !== null)
    {
      this.fileService.Read(this.songSelected.data, deck);
    }
  }
  constructor(public fileService: FilesService) { }

  ngOnInit()
  {

  }

}
