// Angular imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App Component imports
import { PlaylistPageComponent } from './components/pages/playlist-page/playlist-page.component';
import { EffectsPageComponent } from './components/pages/effects-page/effects-page.component';
import { SettingsPageComponent } from './components/pages/settings-page/settings-page.component';
import { TestPageComponent } from './components/pages/test-page/test-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'playlist', component: PlaylistPageComponent },
  { path: 'effects', component: EffectsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'test', component: TestPageComponent},
  { path: '', redirectTo: '/playlist', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
