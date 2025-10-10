/* eslint-disable @typescript-eslint/no-unused-vars */

/** NOTE: This code should be on the server side */
const ORG_ID = import.meta.env.VITE_ORG_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE = 'https://api.dyte.io';

const getAuthToken = () => {
	return `Basic ${btoa(`${ORG_ID}:${API_KEY}`)}`;
};

export const createParticipant = async (meetingId: string, name: string, email: string) => {
	const participantResponse = await fetch(`${API_BASE}/v2/meetings/${meetingId}/participants`, {
		headers: {
			accept: 'application/json',
			authorization: getAuthToken(),
			'content-type': 'application/json',
		},
		body: `{"client_specific_id":"${email}","preset_name":"chat","name":"${name}"}`,
		method: 'POST',
		mode: 'cors',
	})
		.then((res) => res.json())
		.catch((err) => {
			console.log('Error: ', err);
		});

	const participant = participantResponse.data;

	return participant.token as string;
};

export const createMeeting = async (name: string, email: string) => {
	const meetingResponse = await fetch(`${API_BASE}/v2/meetings`, {
		headers: {
			accept: 'application/json',
			authorization: getAuthToken(),
			'content-type': 'application/json',
		},
		body: `{"title":"RealtimeKit <> ${name}"}`,
		method: 'POST',
		mode: 'cors',
	})
		.then((res) => res.json())
		.catch((err) => {
			console.log('Error: ', err);
		});

	const meeting = meetingResponse.data;

	// create participant for agent and notify them that someone has initiated a chat
	const _agentToken = await createParticipant(meeting.id, 'Agent', 'support@dyte.io');
	// notify(_agentToken);

	const token = await createParticipant(meeting.id, name, email);
	return token;
};
