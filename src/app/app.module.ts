// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Npm packages imports
import { ClarityModule } from '@clr/angular';
import { KnobModule } from '@xmlking/ngx-knob';

// App imports

// __Modules
import { AppRoutingModule } from './app-routing.module';

// __Components

import { PlaylistPageComponent } from './components/pages/playlist-page/playlist-page.component';
import { EffectsPageComponent } from './components/pages/effects-page/effects-page.component';
import { SettingsPageComponent } from './components/pages/settings-page/settings-page.component';
import { TestPageComponent } from './components/pages/test-page/test-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';

import { DeckCommonComponent } from './components/deck-common/deck-common.component';
import { MixerComponent } from './components/mixer/mixer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MainPageComponent } from './components/pages/main-page/main-page.component';

// __Pipes
import { TimeMmssPipe } from './pipes/time-mmss.pipe';
import { NumToPxPipe } from './pipes/num-to-px.pipe';
import { KeysPipe } from './pipes/keys.pipe';

//__ Directives
import { D3SliderDirective } from './directives/d3-slider.directive';

//_Other
import { AppComponent } from './app.component';
import { Eq3bandComponent } from './components/eq3band/eq3band.component';
import { SliderComponent } from './components/slider/slider.component';

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
    KeysPipe,
    TestPageComponent,
    Eq3bandComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    KnobModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
