import { createMeeting } from '../server';
import ChatPopup from './ChatPopup';
import Form from './Form';
import WidgetLauncher from './WidgetLauncher';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { useState } from 'react';

const STEP = {
	FORM: 0,
	CHAT: 1,
};

const Widget = () => {
	const [step, setStep] = useState(STEP.FORM);
	const [popupVisible, setPopupVisible] = useState(false);
	const [meeting, initMeeting] = useRealtimeKitClient();

	const onSubmit = async ({ name, email }: { name: string; email: string }) => {
		setStep(STEP.CHAT);
		const authToken = await createMeeting(name, email);
		const searchParams = new URL(window.location.href).searchParams;
		const baseURI = searchParams.get('baseURI') || import.meta.env.VITE_BASE_URL;
		const logInConsole = searchParams.get('logInConsole') === 'true';

		initMeeting({
			authToken,
			baseURI,
			defaults: {
				audio: false,
				video: false,
			},
			modules: { devTools: { logs: logInConsole } },
		});
	};

	const togglePopup = () => {
		setPopupVisible(!popupVisible);
	};

	return (
		<div className="fixed bottom-10 right-6 flex flex-col items-end gap-2">
			{popupVisible && (
				<div className="max-w-md rounded-md shadow-md ring-1 ring-gray-200">
					{step === STEP.CHAT && <ChatPopup meeting={meeting} />}
					{step === STEP.FORM && <Form onSubmit={onSubmit} />}
				</div>
			)}
			<WidgetLauncher onClick={togglePopup} />
		</div>
	);
};
export default Widget;
