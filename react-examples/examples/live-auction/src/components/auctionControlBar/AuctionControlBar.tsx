import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import './auctionControlBar.css';
import { useState } from 'react';
import Icon from '../icon/Icon';

interface Bid {
    bid: number;
    user: string;
}

  
interface Props {
    isHost: boolean,
    item: number,
    highestBid: Bid,
    handlePrev: () => void;
    handleNext: () => void;
}

const AuctionControlBar = (props: Props) => {
    const { meeting } = useRealtimeKitMeeting();
    const [bid, setBid] = useState<string>('');
    const { isHost, item, highestBid, handleNext, handlePrev } = props;
    const placeBid = () => {
        const parsedBid = parseFloat(bid).toFixed(2);
        meeting.participants.broadcastMessage('new-bid', {
            bid: parsedBid,
            user: meeting.self.name,
        });
    }

    return (
        <div className="bidding-component">
            <div className="display-bid">
                <span>{highestBid.user === 'default' ? 'Starting' : 'Highest'} Bid: </span>$ {highestBid.bid}
            </div>
            
            {
                isHost && (
                    <div className="pagination">
                        <button onClick={handlePrev}><Icon size='sm' icon='prev' /></button>
                        <span>{item + 1}</span>
                        <button onClick={handleNext}><Icon size='sm' icon='next' /></button>
                    </div>
                )
            }
            {
                !isHost && <div className="bid-collector">
                <input onChange={(e) => {
                    setBid(e.target.value);
                }} placeholder='$ 345' value={bid} />
                <button onClick={placeBid}>Your Bid</button>
            </div>
            }
        </div>
    )
}

export default AuctionControlBar