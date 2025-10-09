import { RtkAvatar, RtkAudioVisualizer } from '@cloudflare/realtimekit-react-ui';
import type { RTKParticipant, RTKSelf } from '@cloudflare/realtimekit';
import { StarIcon } from './icons';
import clsx from 'clsx';

export default function User({
  participant,
  size,
}: {
  participant: RTKParticipant | RTKSelf;
  size?: 'sm';
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <RtkAvatar
          participant={participant}
          size="sm"
          className={clsx(
            'rounded-none squircle',
            size === 'sm' ? 'h-14 w-14' : 'h-16 w-16'
          )}
        />
        <div className="absolute -bottom-2 -right-1 bg-white rounded-full p-1 scale-[80%]">
          <RtkAudioVisualizer participant={participant} size="sm" />
        </div>
      </div>
      <div className="text-xs font-medium flex items-center gap-0.5 flex-wrap">
        {participant.presetName === 'webinar_presenter' &&
          participant.stageStatus === 'ON_STAGE' && (
            <StarIcon className="h-4 w-4 text-green-600" />
          )}
        {participant.name}
      </div>
    </div>
  );
}
