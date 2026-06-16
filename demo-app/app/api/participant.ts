import type { ActionFunctionArgs } from "react-router";
import { apiError, getAuthHeaders, getRealtimeKitConfig } from "./realtimekit.server";

export const action = async ({ context, request }: ActionFunctionArgs) => {
  try {
    const { name, meetingId, presetName } = await request.json() as {
      name: string;
      meetingId: string;
      presetName: string;
    };
    const normalizedMeetingId = meetingId?.trim();
    if (!normalizedMeetingId || !/^[A-Za-z0-9_-]+$/.test(normalizedMeetingId)) {
      return Response.json({ message: "Invalid meetingId" }, { status: 400 });
    }

    const config = getRealtimeKitConfig(context);
    const response = await fetch(`${config.baseUrl}/meetings/${encodeURIComponent(normalizedMeetingId)}/participants`, {
      method: "POST",
      headers: getAuthHeaders(config),
      body: JSON.stringify({
        name,
        preset_name: presetName,
        custom_participant_id: `${(Math.random() * 1000).toString()}-${name}`,
      }),
    });
    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    return apiError(error);
  }
};
