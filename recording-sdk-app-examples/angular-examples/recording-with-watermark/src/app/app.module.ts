import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RealtimeKitComponentsModule } from '@cloudflare/realtimekit-angular-ui';

import { AppComponent } from './app.component';
import { RecordingViewComponent } from './components/recording-view.component';
import { WatermarkComponent } from './components/watermark.component';

@NgModule({
  declarations: [AppComponent, RecordingViewComponent, WatermarkComponent],
  imports: [BrowserModule, RealtimeKitComponentsModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
