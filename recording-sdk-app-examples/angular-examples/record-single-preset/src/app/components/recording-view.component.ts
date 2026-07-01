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

  private participantListener: (() => void) | null = null;

  ngOnInit() {
    this.updateParticipants();
    this.meeting.participants.joined.addListener('participantJoined', () => this.updateParticipants());
    this.meeting.participants.joined.addListener('participantLeft', () => this.updateParticipants());
    this.meeting.participants.joined.addListener('screenShareUpdate', () => this.updateParticipants());
  }

  ngOnDestroy() {
    this.meeting.participants.joined.removeAllListeners('participantJoined');
    this.meeting.participants.joined.removeAllListeners('participantLeft');
    this.meeting.participants.joined.removeAllListeners('screenShareUpdate');
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
