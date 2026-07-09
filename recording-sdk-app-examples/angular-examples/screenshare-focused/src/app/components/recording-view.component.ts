import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import RealtimeKitClient from '@cloudflare/realtimekit';
import type { RTKParticipant } from '@cloudflare/realtimekit';

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

  private onUpdate = () => this.updateParticipants();

  ngOnInit() {
    this.updateParticipants();
    this.meeting.participants.joined.addListener('participantJoined', this.onUpdate);
    this.meeting.participants.joined.addListener('participantLeft', this.onUpdate);
    this.meeting.participants.joined.addListener('screenShareUpdate', this.onUpdate);
  }

  ngOnDestroy() {
    this.meeting.participants.joined.removeListener('participantJoined', this.onUpdate);
    this.meeting.participants.joined.removeListener('participantLeft', this.onUpdate);
    this.meeting.participants.joined.removeListener('screenShareUpdate', this.onUpdate);
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

  trackById(_index: number, participant: RTKParticipant): string {
    return participant.id;
  }
}
