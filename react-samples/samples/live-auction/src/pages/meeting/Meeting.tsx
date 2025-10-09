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
import { AuctionControlBar, Icon } from '../../components';
import { bidItems } from '../../constants';
import './meeting.css'

interface Bid {
  bid: number;
  user: string;
}

const Meeting = () => {
  const { meeting } = useRealtimeKitMeeting();

  const [item, setItem] = useState(0);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [auctionStarted, setAuctionStarted] = useState<boolean>(false);
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false);
  const [highestBid, setHighestBid] = useState<Bid>({ bid: 100, user: 'default' });

  const handlePrev = () => {
    if (item - 1 < 0) return;
    setItem(item - 1)
    meeting.participants.broadcastMessage('item-changed', { item: item - 1 })
  }
  const handleNext = () => {
    if ( item + 1 >= bidItems.length) return;
    setItem(item + 1)
    meeting.participants.broadcastMessage('item-changed', { item: item + 1 })
  }

  useEffect(() => {
    setHighestBid({
      bid: bidItems[item].startingBid,
      user: 'default'
    })
  }, [item])

  useEffect(() => {
    if (!meeting) return;

    const preset = meeting.self.presetName;
    if (preset.includes('host')) {
      setIsHost(true);
    }

    const handleBroadcastedMessage = ({ type, payload }: { type: string, payload: any }) => {
      switch(type) {
        case 'auction-toggle': {
          setAuctionStarted(payload.started);
          break;
        }
        case 'item-changed': {
          setItem(payload.item);
          break;
        }
        case 'new-bid': {
          sendNotification({
            id: 'new-bid',
            message: `${payload.user} just made a bid of $ ${payload.bid}!`,
            duration: 2000,
          })
          if (parseFloat(payload.bid) > highestBid.bid) setHighestBid(payload)
          break;
        }
        default:
          break;
      }
    }
    meeting.participants.on('broadcastedMessage', handleBroadcastedMessage);

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
      meeting.participants.removeListener('broadcastedMessage', handleBroadcastedMessage);
    };
  }, [meeting])

  useEffect(() => {
    const participantJoinedListener = () => {
      if (!auctionStarted) return;
      setTimeout(() => {
        meeting.participants.broadcastMessage('auction-toggle', {
          started: auctionStarted
        })
      }, 500)
    
    }
    meeting.participants.joined.on('participantJoined', participantJoinedListener);
    return () => {
      meeting.participants.joined.removeListener('participantJoined', participantJoinedListener);
    }
  }, [meeting, auctionStarted])

  const toggleAuction = () => {
    if (!isHost) return;
    meeting.participants.broadcastMessage('auction-toggle', {
      started: !auctionStarted
    })
    if (!auctionStarted) {
      meeting.self.pin();
    } else {
      meeting.self.unpin();
    }
    setAuctionStarted(!auctionStarted);
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
            <button className='auction-toggle-button' onClick={toggleAuction}>
              <Icon size='lg' icon='auction' />
              {auctionStarted ? 'Stop' : 'Start'} Auction
            </button>
          )
        }
      </div>
    </div>
  );
}

export default Meeting