/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Dialog from './Dialog';
import type RealtimeKitClient from '@cloudflare/realtimekit';

const ReactionsManager = ({
  meeting,
  isOpen,
  onClose,
}: {
  meeting: RealtimeKitClient;
  onClose: () => void;
  isOpen: boolean;
}) => {
    const [currentReaction, setCurrentReaction] = useState('');
    useEffect(() => {
        if(!meeting){
            return;
        }
        meeting.participants.joined.addListener('participantJoined', () => {
            // Hack - Re broadcast the message when a new participant joins
            setTimeout(() => {
                meeting.participants.broadcastMessage("reactions", {
                    reaction: currentReaction,
                    peerId: meeting.self.id,
                });
            }, 1000);
        });
    }, [meeting]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} header={'Effects'}>
      <div
        className="relative flex overflow-hidden rounded-lg w-full h-full"
        style={{ backgroundColor: '' }}
      >
        <main className="">
          <div className='reactions-holder'>
            {
                ['🔄', '😊', '🤔', '👀', '😎', '💗', '🔥', '👍🏼', '🚀', '💪'].map((reaction, index) => {
                    return (
                    <div
                     key={index}
                     className={`${index >= 1 ? 'inline-block': ''} m-5 text-3xl cursor-pointer`}
                     onClick={async () => {
                        setCurrentReaction(index === 0 ? '': reaction);
                        await meeting.participants.broadcastMessage("reactions", {
                            reaction: index === 0 ? '': reaction,
                            peerId: meeting.self.id,
                        });
                     }}
                    >{reaction}</div>)
                })
            }
          </div>
        </main>
      </div>
    </Dialog>
  );
};

export default ReactionsManager;
