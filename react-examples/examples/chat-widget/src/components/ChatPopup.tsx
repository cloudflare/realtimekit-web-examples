import { RtkChat, RtkMeeting, RtkSpinner } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { ChatChannel } from '@cloudflare/realtimekit';
import { useEffect, useState } from 'react';

type RtkMeeting = Awaited<ReturnType<typeof useRealtimeKitClient>>[0];

const ChatPopup = ({ meeting }: { meeting: RtkMeeting }) => {
	const [channel, setChannel] = useState<ChatChannel | null>(null);

	useEffect(() => {
		if (!meeting) return;
		if (channel) return;
		const createChannel = async () => {
			if (!meeting.self.roomJoined) {
				await meeting.joinRoom();
			}
			const memberIds = meeting.participants.all.toArray().map((p) => p.userId);
			const createdChannel = await meeting.chat.createChannel(meeting.meta.meetingTitle, memberIds);
			setChannel(createdChannel);
		};
		createChannel();
	}, [channel, meeting]);

	if (meeting && channel) {
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
