import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-effects-page',
  templateUrl: './effects-page.component.html',
  styleUrls: ['./effects-page.component.css']
})
export class EffectsPageComponent implements OnInit {
  @HostBinding('class') classes = 'bottom-content';
  constructor(private httpClient: HttpClient) { }

  ngOnInit()
  {

    // this.httpClient.get('assets/wav/Cathedral_a_mono.wav', {responseType: 'arraybuffer'})
    //   .subscribe(response => console.log(response));
  }

}
