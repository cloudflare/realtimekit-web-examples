import type { ActionFunctionArgs } from "react-router";
import { apiError, getAuthHeaders, getRealtimeKitConfig } from "./realtimekit.server";

export const action = async ({ context, request }: ActionFunctionArgs) => {
  try {
    const { meetingName, recordOnStart, aiSummary } = await request.json() as {
      meetingName: string;
      recordOnStart: boolean;
      aiSummary: boolean;
    };
    const config = getRealtimeKitConfig(context);
    const response = await fetch(`${config.baseUrl}/meetings`, {
      method: "POST",
      headers: getAuthHeaders(config),
      body: JSON.stringify({
        title: meetingName ?? "RealtimeKit Meeting",
        record_on_start: recordOnStart,
        summarize_on_end: aiSummary,
      }),
    });
    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    return apiError(error);
  }
};
