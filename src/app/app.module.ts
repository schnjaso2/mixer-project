// ################## Default & 3rd party code imports #########################
// ____________________________________________________Default imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

// ________________________________________________NPM packages imports
import { ClarityModule } from '@clr/angular';
import { KnobModule } from 'angular2-knob';

// ###################### Program code imports #############################
// _______________________________________________Services imports
import { AudioService } from './services/audio.service';
import { FilesService } from './services/files.service';
import { VisualsService } from './services/visuals.service';

// _______________________________________________Components imports
import { NavbarComponent } from './components/navbar/navbar.component';
import { DeckCommonComponent } from './components/deck-common/deck-common.component';
import { MixerComponent } from './components/mixer/mixer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

// ________________________________________________Pipes imports
import { TimeMmssPipe } from './pipes/time-mmss.pipe';
import { NumToPxPipe } from './pipes/num-to-px.pipe';

// _______________________________________________Directives imports
import { D3SliderDirective } from './directives/d3-slider.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DeckCommonComponent,
    MixerComponent,
    SidenavComponent,
    TimeMmssPipe,
    NumToPxPipe,
    D3SliderDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    KnobModule
  ],
  providers: [
    FilesService,
    AudioService,
    VisualsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
