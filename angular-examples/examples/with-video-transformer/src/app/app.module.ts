import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { RealtimeKitComponentsModule } from '@cloudflare/realtimekit-angular-ui';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RealtimeKitComponentsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
