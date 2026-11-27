import './auctionControlBar.css';
import { useState } from 'react';
import Icon from '../icon/Icon';
import type { Bid } from '../../hooks/useAuction';

interface Props {
    isHost: boolean,
    item: number,
    highestBid: Bid,
    handlePrev: () => void;
    handleNext: () => void;
    placeBid: (bid: number) => void;
}

const AuctionControlBar = (props: Props) => {
    const [bid, setBid] = useState<string>('');
    const { isHost, item, highestBid, handleNext, handlePrev, placeBid } = props;
    const submitBid = () => {
        placeBid(Number(parseFloat(bid).toFixed(2)));
        setBid('');
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
                <button onClick={submitBid}>Your Bid</button>
            </div>
            }
        </div>
    )
}

export default AuctionControlBar