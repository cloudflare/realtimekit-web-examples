import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import RealtimeKitClient from '@cloudflare/realtimekit';
import type { RTKParticipant } from '@cloudflare/realtimekit';

const TARGET_PRESET = 'LEAD';

@Component({
  selector: 'app-recording-view',
  templateUrl: './recording-view.component.html',
  styleUrls: ['./recording-view.component.css'],
})
export class RecordingViewComponent implements OnInit, OnDestroy {
  @Input() meeting!: RealtimeKitClient;

  targetParticipants: RTKParticipant[] = [];
  screensharedParticipants: RTKParticipant[] = [];
  hasScreenshare = false;

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

    this.targetParticipants = joined.filter(
      (p) => p.presetName === TARGET_PRESET
    );

    this.screensharedParticipants = joined.filter(
      (p) => p.screenShareEnabled
    );

    this.hasScreenshare = this.screensharedParticipants.length > 0;
  }

  trackById(_index: number, participant: RTKParticipant): string {
    return participant.id;
  }
}
