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
  // Set while a host is starting or stopping the auction
  transition: 'starting' | 'stopping' | null;
  item: number;
  [bidKey: `bid-${number}`]: Bid | undefined;
}

const STORE_NAME = 'auction';

// A transition is ignored after this long, in case the host who began it left midway
const TRANSITION_TIMEOUT = 60000;

const getStartingBid = (item: number): Bid => ({
  bid: bidItems[item].startingBid,
  user: 'default',
});

const initialState: AuctionState = {
  started: false,
  transition: null,
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
        if (!active) return;
        sendNotification({
          id: 'auction-error',
          message: 'Could not load the auction, please rejoin the meeting',
          duration: 4000,
        });
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [meeting]);

  // Returns false if the store isn't ready yet, in which case nothing is saved
  const update = useCallback(
    (changes: Partial<AuctionState>) => {
      if (!store) return false;
      setAuction((prev) => ({ ...prev, ...changes }));
      store.bulkSet(
        Object.entries(changes).map(([key, payload]) => ({ key, payload }))
      );
      return true;
    },
    [store]
  );

  const { started, transition } = auction;
  // The store can hold any value, fall back to the first item if it isn't a valid index
  const item = Number.isInteger(auction.item) && bidItems[auction.item] ? auction.item : 0;

  useEffect(() => {
    if (!transition) return;
    const timeout = setTimeout(() => {
      setAuction((prev) => ({ ...prev, transition: null }));
    }, TRANSITION_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [transition]);

  const highestBid = auction[`bid-${item}`] ?? getStartingBid(item);

  // Runs `action` and toggles the auction once it is done. Until then
  // everyone sees the auction as starting or stopping.
  const toggleAuction = async (action: () => Promise<void>) => {
    update({ transition: started ? 'stopping' : 'starting' });
    try {
      await action();
      update({ started: !started, transition: null });
    } catch (error) {
      update({ transition: null });
      throw error;
    }
  };

  const showItem = (newItem: number) => {
    if (newItem < 0 || newItem >= bidItems.length) return;
    update({ item: newItem });
  };

  // Returns whether the bid was accepted
  const placeBid = (bid: number) => {
    if (!(bid > highestBid.bid)) {
      sendNotification({
        id: 'invalid-bid',
        message: `Your bid must be higher than $ ${highestBid.bid}`,
        duration: 2000,
      });
      return false;
    }
    return update({ [`bid-${item}`]: { bid, user: meeting.self.name } });
  };

  // The auction can't be changed until the store is ready
  return { ready: !!store, started, transition, item, highestBid, toggleAuction, showItem, placeBid };
};
