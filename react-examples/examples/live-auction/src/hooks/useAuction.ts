import { useCallback, useEffect, useState } from 'react';
import type RealtimeKitClient from '@cloudflare/realtimekit';
import type { RTKStore } from '@cloudflare/realtimekit';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import { sendNotification } from '@cloudflare/realtimekit-react-ui';
import { bidItems } from '../constants';

export interface Bid {
  bid: number;
  user: string;
}

// Keys of the meeting store, shared by everyone in the session.
// The highest bid of each item is kept under its own `bid-<item>` key.
interface AuctionState {
  started: boolean;
  item: number;
  [bidKey: `bid-${number}`]: Bid | undefined;
}

const STORE_NAME = 'auction';

const getStartingBid = (item: number): Bid => ({
  bid: bidItems[item].startingBid,
  user: 'default',
});

const initialState: AuctionState = {
  started: false,
  item: 0,
};

// A store must be created once per user. The promise is cached per meeting
// so that re-running the effect (React StrictMode) doesn't create it twice.
const auctionStores = new WeakMap<RealtimeKitClient, Promise<RTKStore>>();

const getAuctionStore = (meeting: RealtimeKitClient) => {
  let store = auctionStores.get(meeting);
  if (!store) {
    store = meeting.stores.create(STORE_NAME);
    store.catch(() => auctionStores.delete(meeting));
    auctionStores.set(meeting, store);
  }
  return store;
};

export const useAuction = () => {
  const { meeting } = useRealtimeKitMeeting();
  const [store, setStore] = useState<RTKStore>();
  const [auction, setAuction] = useState<AuctionState>(initialState);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    getAuctionStore(meeting)
      .then((auctionStore) => {
        if (!active) return;

        // Fires only for changes made by other participants
        const handleChange = (data: Partial<AuctionState>) => {
          setAuction((prev) => ({ ...prev, ...data }));

          Object.entries(data).forEach(([key, value]) => {
            if (!key.startsWith('bid-')) return;
            const bid = value as Bid;
            sendNotification({
              id: 'new-bid',
              message: `${bid.user} just made a bid of $ ${bid.bid}!`,
              duration: 2000,
            });
          });
        };
        auctionStore.subscribe('*', handleChange);
        unsubscribe = () => auctionStore.unsubscribe('*', handleChange);

        // The store already holds the current auction for participants who join late
        setAuction({ ...initialState, ...auctionStore.getAll() });
        setStore(auctionStore);
      })
      .catch((error) => {
        console.error('Failed to create the auction store', error);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [meeting]);

  const update = useCallback(
    (changes: Partial<AuctionState>) => {
      if (!store) return;
      setAuction((prev) => ({ ...prev, ...changes }));
      store.bulkSet(
        Object.entries(changes).map(([key, payload]) => ({ key, payload }))
      );
    },
    [store]
  );

  const { started, item } = auction;
  const highestBid = auction[`bid-${item}`] ?? getStartingBid(item);

  const toggleAuction = () => update({ started: !started });

  const showItem = (newItem: number) => {
    if (newItem < 0 || newItem >= bidItems.length) return;
    update({ item: newItem });
  };

  const placeBid = (bid: number) => {
    if (!(bid > highestBid.bid)) {
      sendNotification({
        id: 'invalid-bid',
        message: `Your bid must be higher than $ ${highestBid.bid}`,
        duration: 2000,
      });
      return;
    }
    update({ [`bid-${item}`]: { bid, user: meeting.self.name } });
  };

  return { started, item, highestBid, toggleAuction, showItem, placeBid };
};
