// ################## Default & 3rd party code imports #########################
// ____________________________________________________Default imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, Route } from '@angular/router';
import { AppComponent } from './app.component';

// ________________________________________________NPM packages imports
import { environment } from '../environments/environment';
import { ClarityModule } from '@clr/angular';
import { KnobModule } from 'angular2-knob';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';

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
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { SettingsPageComponent } from './components/pages/settings-page/settings-page.component';
import { PlaylistPageComponent } from './components/pages/playlist-page/playlist-page.component';
import { EffectsPageComponent } from './components/pages/effects-page/effects-page.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';

// ________________________________________________Pipes imports
import { TimeMmssPipe } from './pipes/time-mmss.pipe';
import { NumToPxPipe } from './pipes/num-to-px.pipe';

// _______________________________________________Directives imports
import { D3SliderDirective } from './directives/d3-slider.directive';
import { KeysPipe } from './pipes/keys.pipe';

// _______________________________________________Other imports
import { Settings } from './settings';

const routes: Routes = [
  { path: 'playlist', component: PlaylistPageComponent },
  { path: 'effects', component: EffectsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '', redirectTo: '/playlist', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DeckCommonComponent,
    MixerComponent,
    SidenavComponent,
    TimeMmssPipe,
    NumToPxPipe,
    D3SliderDirective,
    SettingsPageComponent,
    PageNotFoundComponent,
    MainPageComponent,
    PlaylistPageComponent,
    EffectsPageComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    KnobModule,
    RouterModule.forRoot(
      routes
      // { enableTracing: true }
    ),
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireDatabaseModule,
    // AngularFireAuthModule
  ],
  providers: [
    FilesService,
    AudioService,
    VisualsService,
    Settings
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
