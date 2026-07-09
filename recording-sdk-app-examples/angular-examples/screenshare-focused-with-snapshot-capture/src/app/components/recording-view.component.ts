import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import RealtimeKitClient from '@cloudflare/realtimekit';
import type { RTKParticipant } from '@cloudflare/realtimekit';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recording-view',
  templateUrl: './recording-view.component.html',
  styleUrls: ['./recording-view.component.css'],
})
export class RecordingViewComponent implements OnInit, OnDestroy {
  @Input() meeting!: RealtimeKitClient;

  participants: RTKParticipant[] = [];
  screensharedParticipants: RTKParticipant[] = [];
  hasScreenshare = false;

  readonly bubbleSize = { height: '120px', width: '120px' };

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private onUpdate = () => this.updateParticipants();

  ngOnInit() {
    this.updateParticipants();
    this.meeting.participants.joined.addListener('participantJoined', this.onUpdate);
    this.meeting.participants.joined.addListener('participantLeft', this.onUpdate);
    this.meeting.participants.joined.addListener('screenShareUpdate', this.onUpdate);

    this.startSnapshotCapture();
  }

  ngOnDestroy() {
    this.meeting.participants.joined.removeListener('participantJoined', this.onUpdate);
    this.meeting.participants.joined.removeListener('participantLeft', this.onUpdate);
    this.meeting.participants.joined.removeListener('screenShareUpdate', this.onUpdate);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateParticipants() {
    const joined = this.meeting.participants.joined.toArray();
    const pinned = this.meeting.participants.pinned.toArray();
    const active = this.meeting.participants.active.toArray();

    // show pinned participants first
    this.participants = [
      ...pinned,
      ...active.filter((p) => !pinned.includes(p)),
    ];

    this.screensharedParticipants = joined.filter(
      (p) => p.screenShareEnabled
    );

    this.hasScreenshare = this.screensharedParticipants.length > 0;
  }

  private startSnapshotCapture() {
    this.intervalId = setInterval(async () => {
      await this.captureParticipantSnapshotAndPost();
    }, environment.thumbnailTimeInterval);
  }

  private async captureParticipantSnapshotAndPost() {
    const participants = this.meeting.participants.active
      .toArray()
      .filter(
        (e: any) =>
          e.videoEnabled &&
          e.presetName &&
          e.presetName.indexOf(environment.presetNameForThumbnail) > -1
      );

    const canvasElement = document.createElement('canvas');
    const videoElement = document.createElement('video');

    for (const participant of participants) {
      try {
        const track = (participant as any).videoTrack;
        const stream = new MediaStream();
        stream.addTrack(track);

        videoElement.srcObject = stream;
        videoElement.autoplay = true;
        videoElement.muted = true;

        try {
          await videoElement.play();
        } catch (ex) {
          // Ignore
        }

        const canvasCtx = canvasElement.getContext('2d');

        const trackSettings = track.getSettings();
        const width = trackSettings?.width ?? 1920;
        const height = trackSettings?.height ?? 1080;

        videoElement.height = height;
        videoElement.width = width;
        canvasElement.width = width;
        canvasElement.height = height;
        canvasCtx!.drawImage(videoElement, 0, 0, width, height);

        const dataURL = canvasElement.toDataURL('image/jpeg');

        /**
         * NOTE: alter the body params as per your need.
         * Below is just an example
         */
        await fetch(environment.thumbnailPostEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_sid: this.meeting.meta.meetingId,
            file_content: dataURL,
          }),
        });
      } catch {
        // For now, do nothing
      }
    }
  }

  trackById(_index: number, participant: RTKParticipant): string {
    return participant.id;
  }
}
