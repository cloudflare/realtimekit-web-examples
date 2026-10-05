import { useEffect, useState } from 'react';
import {
  useRealtimeKitMeeting,
  useRealtimeKitSelector,
} from '@cloudflare/realtimekit-react';
import type { RTKParticipant } from '@cloudflare/realtimekit';
import { RtkAvatar, RtkDialog, RtkSwitch } from '@cloudflare/realtimekit-react-ui';

const mediaTypes = [
  { kind: 'audio', label: 'Audio' },
  { kind: 'video', label: 'Video' },
  { kind: 'screenshareAudio', label: 'Screen share audio' },
  { kind: 'screenshareVideo', label: 'Screen share video' },
] as const;

type SubscriptionKind = keyof RTKParticipant['manualProducerConfig'];

interface ManualSubscriptionsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ManualSubscriptionsDialog({
  open,
  onClose,
}: ManualSubscriptionsDialogProps) {
  const { meeting } = useRealtimeKitMeeting();
  const isManualMode = useRealtimeKitSelector(
    (meeting) => meeting.participants.viewMode === 'MANUAL'
  );
  const [participants, setParticipants] = useState<RTKParticipant[]>([]);
  const [isUpdatingSubscriptions, setIsUpdatingSubscriptions] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    const { joined } = meeting.participants;
    const refreshParticipants = () => setParticipants(joined.toArray());

    joined.addListener('participantJoined', refreshParticipants);
    joined.addListener('participantLeft', refreshParticipants);
    joined.addListener('participantsCleared', refreshParticipants);
    refreshParticipants();

    return () => {
      joined.removeListener('participantJoined', refreshParticipants);
      joined.removeListener('participantLeft', refreshParticipants);
      joined.removeListener('participantsCleared', refreshParticipants);
    };
  }, [open, meeting]);

  // Subscription maps group microphone/camera and screen-share media together.
  // The per-kind config distinguishes the individual subscriptions.
  const isSubscribed = (participant: RTKParticipant, kind: SubscriptionKind) => {
    const subscribed =
      kind === 'audio' || kind === 'screenshareAudio'
        ? meeting.participants.audioSubscribed
        : meeting.participants.videoSubscribed;

    return (
      subscribed.has(participant.id) && participant.manualProducerConfig[kind]
    );
  };

  const handleModeChange = async (checked: boolean) => {
    // RtkSwitch emits rtkChange on initialization and checked-prop updates.
    // Ignore notifications that already match the SDK mode.
    if (
      isUpdatingSubscriptions ||
      checked === (meeting.participants.viewMode === 'MANUAL')
    ) {
      return;
    }

    setIsUpdatingSubscriptions(true);
    setError('');

    try {
      if (checked) {
        await meeting.participants.setViewMode('MANUAL');
      }

      const participantIds = meeting.participants.joined
        .toArray()
        .map(({ id }) => id);

      if (checked) {
        // Omitting kinds unsubscribes all media, so each activation starts fresh.
        await meeting.participants.unsubscribe(participantIds);
      } else {
        // Allow all media kinds before returning control to automatic subscriptions.
        await meeting.participants.subscribe(participantIds);
        await meeting.participants.setViewMode('ACTIVE_GRID');
      }
    } catch (cause) {
      console.error('Unable to change subscription mode', { checked, cause });
      setError('Could not change subscription mode. Please try again.');
    } finally {
      setParticipants(meeting.participants.joined.toArray());
      setIsUpdatingSubscriptions(false);
    }
  };

  const handleSubscriptionChange = async (
    participantId: string,
    kind: SubscriptionKind,
    checked: boolean
  ) => {
    const participant = meeting.participants.joined.get(participantId);
    if (
      isUpdatingSubscriptions ||
      meeting.participants.viewMode !== 'MANUAL' ||
      !participant ||
      checked === isSubscribed(participant, kind)
    ) {
      return;
    }

    setIsUpdatingSubscriptions(true);
    setError('');

    try {
      // New peers allow all media kinds by default. Clear those defaults before
      // selecting their first stream, so only the chosen kind is subscribed.
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
      setError('Could not update the subscription. Please try again.');
    } finally {
      // Refresh even when map membership is unchanged, or an API call fails.
      setParticipants(meeting.participants.joined.toArray());
      setIsUpdatingSubscriptions(false);
    }
  };

  return (
    <RtkDialog open={open} onRtkDialogClose={onClose}>
      <section
        className="subscriptions-dialog"
        aria-labelledby="subscriptions-title"
      >
        <header className="subscriptions-dialog__header">
          <h2 id="subscriptions-title">Manual Subscriptions</h2>
        </header>
        <div className="subscriptions-dialog__content">
          <div className="subscriptions-dialog__toggle">
            <span id="manual-subscription-label">Manual subscription mode</span>
            <RtkSwitch
              checked={isManualMode}
              disabled={isUpdatingSubscriptions}
              readonly={isUpdatingSubscriptions}
              aria-labelledby="manual-subscription-label"
              tabIndex={0}
              onRtkChange={({ detail }) => handleModeChange(detail)}
            />
          </div>
          <p>
            {isManualMode
              ? 'Choose which participant audio, video, and screen share streams you receive.'
              : 'The default grid manages subscriptions automatically.'}
          </p>
          {error && (
            <p className="subscriptions-dialog__error" role="alert">
              {error}
            </p>
          )}
          {isManualMode && (
            <section aria-labelledby="subscriptions-participants-title">
              <h3 id="subscriptions-participants-title">
                Participants ({participants.length})
              </h3>
              {participants.length === 0 ? (
                <p>No other participants have joined yet.</p>
              ) : (
                <div
                  className="subscriptions-dialog__table-scroll"
                  role="region"
                  aria-labelledby="subscriptions-participants-title"
                  tabIndex={0}
                >
                  <table
                    className="subscriptions-dialog__table"
                    aria-labelledby="subscriptions-participants-title"
                  >
                    <thead>
                      <tr>
                        <th scope="col">Participant</th>
                        {mediaTypes.map(({ kind, label }) => (
                          <th key={kind} scope="col">
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant) => {
                        const name = participant.name || 'Unnamed participant';

                        return (
                          <tr key={participant.id}>
                            <th scope="row">
                              <div className="subscriptions-dialog__identity">
                                <RtkAvatar
                                  participant={participant}
                                  size="sm"
                                  aria-hidden="true"
                                />
                                <span title={name}>{name}</span>
                              </div>
                            </th>
                            {mediaTypes.map(({ kind, label }) => (
                              <td key={kind}>
                                <RtkSwitch
                                  checked={isSubscribed(participant, kind)}
                                  disabled={isUpdatingSubscriptions}
                                  readonly={isUpdatingSubscriptions}
                                  aria-label={`${label} subscription for ${name}`}
                                  tabIndex={0}
                                  onRtkChange={({ detail }) =>
                                    handleSubscriptionChange(
                                      participant.id,
                                      kind,
                                      detail
                                    )
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </RtkDialog>
  );
}
