import { RtkChat, RtkMeeting, RtkSpinner } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { useEffect } from 'react';

type RtkMeeting = Awaited<ReturnType<typeof useRealtimeKitClient>>[0];

const ChatPopup = ({ meeting }: { meeting: RtkMeeting }) => {

	useEffect(() => {
		if (!meeting) return;
	}, [meeting]);

	if (meeting) {
		return (
            <main className="flex h-96 w-96 flex-col rounded-md p-2">
                <RtkChat meeting={meeting} />
            </main>
        );
	}

	// loader
	return (
        <main className="flex w-96 justify-center rounded-md p-2">
            <RtkSpinner size="xl" />
        </main>
    );
};
export default ChatPopup;
