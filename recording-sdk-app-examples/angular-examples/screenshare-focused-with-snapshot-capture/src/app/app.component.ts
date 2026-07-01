import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { RealtimeKitRecording } from '@cloudflare/realtimekit-recording-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  meeting: RealtimeKitClient | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  async ngAfterViewInit() {
    const searchParams = new URLSearchParams(this.document.defaultView?.location.search);

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    const baseURI = searchParams.get('baseURI');

    const recordingSDK = new RealtimeKitRecording({});
    const meetingObj = await RealtimeKitClient.init({
      authToken,
      defaults: {
        video: false,
        audio: false,
      },
      baseURI: baseURI ?? 'realtime.cloudflare.com',
    });

    await recordingSDK.init(meetingObj);
    this.meeting = meetingObj;

    Object.assign(this.document.defaultView as any, { meeting: this.meeting });
  }
}
