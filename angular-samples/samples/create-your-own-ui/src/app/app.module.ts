import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomRtkMeetingComponent } from './components/custom-rtk-meeting.component';
import { SetupScreenComponent } from './components/setup-screen.component';
import { InMeetingComponent } from './components/in-meeting.component';
import { MeetingHeaderComponent } from './components/meeting-header.component';
import { MeetingControlBarComponent } from './components/meeting-control-bar.component';
import { MeetingSidebarComponent } from './components/meeting-sidebar.component';
import { MediaPreviewModalComponent } from './components/media-preview-modal.component';
import { AudioPreviewComponent } from './components/audio-preview.component';
import { VideoPreviewComponent } from './components/video-preview.component';

import { RealtimeKitComponentsModule } from '@cloudflare/realtimekit-angular-ui';

@NgModule({
  declarations: [
    AppComponent,
    CustomRtkMeetingComponent,
    SetupScreenComponent,
    InMeetingComponent,
    MeetingHeaderComponent,
    MeetingControlBarComponent,
    MeetingSidebarComponent,
    MediaPreviewModalComponent,
    AudioPreviewComponent,
    VideoPreviewComponent
  ],
  imports: [BrowserModule, FormsModule, RealtimeKitComponentsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
