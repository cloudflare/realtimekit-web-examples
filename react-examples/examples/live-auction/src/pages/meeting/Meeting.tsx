/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {
  RtkCameraToggle,
  RtkChatToggle,
  RtkDialogManager,
  RtkGrid,
  RtkHeader,
  RtkLeaveButton,
  RtkMicToggle,
  RtkNotifications,
  RtkParticipantsAudio,
  RtkSidebar,
  sendNotification,
} from '@cloudflare/realtimekit-react-ui'
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import type { LivestreamState, RTKLivestream } from '@cloudflare/realtimekit';
import { AuctionControlBar, Icon } from '../../components';
import { bidItems } from '../../constants';
import { useAuction } from '../../hooks/useAuction';
import './meeting.css'

const LIVESTREAM_TIMEOUT = 30000;

// start() and stop() resolve once the request is accepted, the state changes later
const waitForLivestreamState = (livestream: RTKLivestream, target: LivestreamState, failed?: LivestreamState) =>
  new Promise<void>((resolve, reject) => {
    if (livestream.state === target) {
      resolve();
      return;
    }
    const listener = (state: LivestreamState) => {
      if (state !== target && state !== failed) return;
      cleanup();
      if (state === target) resolve();
      else reject(new Error('Livestream failed'));
    };
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Livestream did not respond in 30 seconds'));
    }, LIVESTREAM_TIMEOUT);
    const cleanup = () => {
      clearTimeout(timeout);
      livestream.removeListener('livestreamUpdate', listener);
    };
    livestream.on('livestreamUpdate', listener);
  });

const Meeting = () => {
  const { meeting } = useRealtimeKitMeeting();

  const { ready: auctionReady, started: auctionStarted, transition: auctionTransition, item, highestBid, toggleAuction: toggleAuctionState, showItem, placeBid } = useAuction();
  const [isHost, setIsHost] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false);

  const handlePrev = () => showItem(item - 1);
  const handleNext = () => showItem(item + 1);

  useEffect(() => {
    if (!meeting) return;

    const preset = meeting.self.presetName;
    if (preset.toLowerCase().includes('host')) {
      setIsHost(true);
    }

    const handleRtkStateUpdate = ({detail}: any) => {
        if (detail.activeSidebar) {
         setActiveSidebar(true);
        } else {
          setActiveSidebar(false);
        }
    }

    document.body.addEventListener('rtkStateUpdate', handleRtkStateUpdate);

    return () => {
      document.body.removeEventListener('rtkStateUpdate', handleRtkStateUpdate);
    };
  }, [meeting])

  const toggleAuction = async () => {
    if (!isHost || !auctionReady || auctionTransition) return;
    const { livestream } = meeting;
    try {
      await toggleAuctionState(async () => {
        if (!auctionStarted) {
          if (livestream.state !== 'LIVESTREAMING') {
            if (livestream.state === 'IDLE') await livestream.start();
            await waitForLivestreamState(livestream, 'LIVESTREAMING', 'IDLE');
          }
          meeting.self.pin();
        } else {
          if (livestream.state !== 'IDLE') {
            if (livestream.state !== 'STOPPING') await livestream.stop();
            await waitForLivestreamState(livestream, 'IDLE');
          }
          meeting.self.unpin();
        }
      });
    } catch (error) {
      console.error(error);
      sendNotification({
        id: 'auction-error',
        message: `Could not ${auctionStarted ? 'stop' : 'start'} the auction: ${error instanceof Error ? error.message : error}`,
        duration: 4000,
      });
    }
  }

  return (
    <div className='meeting-container'>
      <RtkParticipantsAudio meeting={meeting} />
      <RtkNotifications meeting={meeting} />
      <RtkDialogManager meeting={meeting}/>
      <RtkHeader
        meeting={meeting}
        size='lg'
        style={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          gap: 'var(--rtk-space-2, 8px)',
          '--header-section-gap': 'var(--rtk-space-2, 8px)',
        }}
      >
        <div className="meeting-header">
          {
            auctionStarted && (
              <div className="show-auction-popup" onClick={() => setShowPopup(() => !showPopup)}>
                <Icon size='sm' icon={showPopup ? 'close' : 'next'} />
              </div>
            )
          }
        </div>
      </RtkHeader>
      <div className='meeting-grid'>
        {
          auctionStarted && (
            <div className={`auction-container ${!showPopup ? 'hide-auction-popup' : ''}`}>
              <img className='auction-img' src={bidItems[item].link} />
              <div className='auction-desc'>
                {bidItems[item].description}
              </div>
              <AuctionControlBar
                item={item}
                highestBid={highestBid}
                handleNext={handleNext}
                handlePrev={handlePrev}
                placeBid={placeBid}
                isHost={isHost}
              />
          </div>
          )
        }
        <RtkGrid layout='column' meeting={meeting} style={{ height: '100%' }}/>
        {activeSidebar && <RtkSidebar meeting={meeting} />}
      </div>
      <div className='meeting-controlbar'>
        <RtkMicToggle size='md' meeting={meeting} />
        <RtkCameraToggle size='md'  meeting={meeting} />
        <RtkLeaveButton size='md' />
        <RtkChatToggle size='md' meeting={meeting} />
        {
          isHost && (
            <button className='auction-toggle-button' onClick={toggleAuction} disabled={!auctionReady || !!auctionTransition}>
              <Icon size='lg' icon='auction' />
              {auctionTransition
                ? (auctionTransition === 'stopping' ? 'Stopping...' : 'Starting...')
                : `${auctionStarted ? 'Stop' : 'Start'} Auction`}
            </button>
          )
        }
      </div>
    </div>
  );
}

export default Meeting