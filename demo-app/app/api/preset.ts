import type { LoaderFunctionArgs } from "react-router";
import { apiError, getAuthHeaders, getRealtimeKitConfig } from "./realtimekit.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  try {
    const config = getRealtimeKitConfig(context);
    const response = await fetch(`${config.baseUrl}/presets`, {
      method: "GET",
      headers: getAuthHeaders(config),
    });
    const data = await response.json() as {
      data: {
        created_at: string;
        updated_at: string;
        name: string;
        id: string;
      }[];
    };

    return Response.json(response.ok ? data.data : data, { status: response.status });
  } catch (error) {
    return apiError(error);
  }
};
