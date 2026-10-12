import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import type { OnChanges, OnDestroy } from '@angular/core';
import type RealtimeKitClient from '@cloudflare/realtimekit';
import type { RTKParticipant } from '@cloudflare/realtimekit';
import type { RtkSwitch } from '@cloudflare/realtimekit-angular-ui';

type SubscriptionKind = keyof RTKParticipant['manualProducerConfig'];

@Component({
  selector: 'app-manual-subscriptions-dialog',
  templateUrl: './manual-subscriptions-dialog.component.html',
  styleUrls: ['./manual-subscriptions-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualSubscriptionsDialogComponent
  implements OnChanges, OnDestroy
{
  @Input() meeting?: RealtimeKitClient;
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  readonly mediaTypes: ReadonlyArray<{
    kind: SubscriptionKind;
    label: string;
  }> = [
    { kind: 'audio', label: 'Audio' },
    { kind: 'video', label: 'Video' },
    { kind: 'screenshareAudio', label: 'Screen share audio' },
    { kind: 'screenshareVideo', label: 'Screen share video' },
  ];
  private readonly participantEvents = [
    'participantJoined',
    'participantLeft',
    'participantsCleared',
    'participantsUpdate',
  ] as const;
  private listeningMeeting: RealtimeKitClient | undefined;

  isUpdatingSubscriptions = false;
  error = '';

  constructor(
    private readonly zone: NgZone,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  get isManualMode(): boolean {
    return this.meeting?.participants.viewMode === 'MANUAL';
  }

  get joinedParticipants(): RTKParticipant[] {
    return this.meeting?.participants.joined.toArray() ?? [];
  }

  ngOnChanges(): void {
    this.removeListeners();
    const meeting = this.meeting;
    if (!meeting || !this.open) return;
    this.listeningMeeting = meeting;

    for (const participants of [
      meeting.participants.joined,
      meeting.participants.audioSubscribed,
      meeting.participants.videoSubscribed,
    ]) {
      for (const event of this.participantEvents) {
        participants.on(event, this.refreshDialog);
      }
    }
    meeting.participants.on('viewModeChanged', this.refreshDialog);
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  closeDialog(): void {
    this.zone.run(() => this.closed.emit());
  }

  // Track peer IDs to preserve participant rows and keyboard focus on refresh.
  trackByParticipantId(_index: number, participant: RTKParticipant): string {
    return participant.id;
  }

  // Maps group microphone/camera and screen-share media together; the per-kind
  // config distinguishes which individual subscriptions have been selected.
  isSubscribed(participant: RTKParticipant, kind: SubscriptionKind): boolean {
    const meeting = this.meeting;
    if (!meeting) return false;
    const subscribed =
      kind === 'audio' || kind === 'screenshareAudio'
        ? meeting.participants.audioSubscribed
        : meeting.participants.videoSubscribed;
    return (
      subscribed.has(participant.id) && participant.manualProducerConfig[kind]
    );
  }

  async handleModeChange(checked: boolean, control: RtkSwitch): Promise<void> {
    const meeting = this.meeting;
    // RtkSwitch emits changes on initialization and checked-property updates too.
    if (
      !meeting ||
      this.isUpdatingSubscriptions ||
      checked === this.isManualMode
    ) {
      return;
    }

    this.isUpdatingSubscriptions = true;
    this.error = '';
    this.refreshDialog();
    try {
      if (checked) await meeting.participants.setViewMode('MANUAL');
      const participantIds = meeting.participants.joined
        .toArray()
        .map(({ id }) => id);
      if (checked) {
        // Omitting kinds unsubscribes all media, so each activation starts fresh.
        await meeting.participants.unsubscribe(participantIds);
      } else {
        // Allow all media before returning control to automatic subscriptions.
        await meeting.participants.subscribe(participantIds);
        await meeting.participants.setViewMode('ACTIVE_GRID');
      }
    } catch (cause) {
      console.error('Unable to change subscription mode', { checked, cause });
      this.error = 'Could not change subscription mode. Please try again.';
    } finally {
      this.isUpdatingSubscriptions = false;
      // Restore the mutable switch from SDK state, including when the API rejects.
      control.checked = this.isManualMode;
      this.refreshDialog();
    }
  }

  async handleSubscriptionChange(
    participantId: string,
    kind: SubscriptionKind,
    checked: boolean,
    control: RtkSwitch
  ): Promise<void> {
    const meeting = this.meeting;
    const participant = meeting?.participants.joined.get(participantId);
    if (
      !meeting ||
      this.isUpdatingSubscriptions ||
      !this.isManualMode ||
      !participant ||
      checked === this.isSubscribed(participant, kind)
    ) {
      return;
    }

    this.isUpdatingSubscriptions = true;
    this.error = '';
    this.refreshDialog();
    try {
      // New peers allow all kinds by default. Clear those defaults before their
      // first selection so only the chosen kind is subscribed.
      if (
        checked &&
        !meeting.participants.audioSubscribed.has(participantId) &&
        !meeting.participants.videoSubscribed.has(participantId) &&
        Object.values(participant.manualProducerConfig).some(Boolean)
      ) {
        await meeting.participants.unsubscribe([participantId]);
      }

      if (checked) {
        await meeting.participants.subscribe([participantId], [kind]);
      } else {
        await meeting.participants.unsubscribe([participantId], [kind]);
      }
    } catch (cause) {
      console.error('Unable to update participant subscription', {
        participantId,
        kind,
        checked,
        cause,
      });
      this.error = 'Could not update the subscription. Please try again.';
    } finally {
      this.isUpdatingSubscriptions = false;
      control.checked = this.isSubscribed(participant, kind);
      // A media-kind change may not emit a map event, so refresh after completion.
      this.refreshDialog();
    }
  }

  private readonly refreshDialog = (): void => {
    // SDK and UI Kit callbacks can run outside Angular's change-detection zone.
    this.zone.run(() => this.changeDetector.markForCheck());
  };

  private removeListeners(): void {
    const meeting = this.listeningMeeting;
    if (!meeting) return;
    for (const participants of [
      meeting.participants.joined,
      meeting.participants.audioSubscribed,
      meeting.participants.videoSubscribed,
    ]) {
      for (const event of this.participantEvents) {
        participants.removeListener(event, this.refreshDialog);
      }
    }
    meeting.participants.removeListener('viewModeChanged', this.refreshDialog);
    this.listeningMeeting = undefined;
  }
}
