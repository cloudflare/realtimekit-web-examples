import ChatPopup from './ChatPopup';
import WidgetLauncher from './WidgetLauncher';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { useEffect, useState } from 'react';

const Widget = () => {
	const [popupVisible, setPopupVisible] = useState(false);
	const [meeting, initMeeting] = useRealtimeKitClient();
	const [authToken] = useState(() => new URLSearchParams(window.location.search).get('authToken'));

	useEffect(() => {
		if (!authToken) return;
		initMeeting({
			authToken,
			baseURI: import.meta.env.VITE_BASE_URL,
			defaults: {
				audio: false,
				video: false,
			},
		});
	}, [authToken, initMeeting]);

	const togglePopup = () => {
		setPopupVisible(!popupVisible);
	};

	return (
		<div className="fixed bottom-10 right-6 flex flex-col items-end gap-2">
			{popupVisible && (
				<div className="max-w-md rounded-md shadow-md ring-1 ring-gray-200">
					{authToken ? (
						<ChatPopup meeting={meeting} />
					) : (
						<div className="w-96 rounded-md bg-white p-6 text-sm text-gray-700">
							Missing authToken. Generate a participant token on your server and pass it as
							 <code className="rounded bg-gray-100 px-1">?authToken=...</code>.
						</div>
					)}
				</div>
			)}
			<WidgetLauncher onClick={togglePopup} />
		</div>
	);
};
export default Widget;
