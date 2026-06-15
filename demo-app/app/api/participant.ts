import type { ActionFunctionArgs } from "react-router";
import { apiError, getAuthHeaders, getRealtimeKitConfig } from "./realtimekit.server";

export const action = async ({ context, request }: ActionFunctionArgs) => {
  try {
    const { name, meetingId, presetName } = await request.json() as {
      name: string;
      meetingId: string;
      presetName: string;
    };
    const { baseUrl } = getRealtimeKitConfig(context);
    const response = await fetch(`${baseUrl}/meetings/${meetingId}/participants`, {
      method: "POST",
      headers: getAuthHeaders(context),
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
