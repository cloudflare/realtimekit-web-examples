import type { AppLoadContext } from "react-router";

type RuntimeEnv = Record<string, string | undefined>;

type RealtimeKitConfig = {
  apiKey: string;
  orgId: string;
  baseUrl: string;
};

const getRuntimeEnv = (context: AppLoadContext): RuntimeEnv => {
  return context.cloudflare.env as unknown as RuntimeEnv;
};

export const getRealtimeKitConfig = (context: AppLoadContext) => {
  const env = getRuntimeEnv(context);
  const apiKey = env.REALTIMEKIT_API_KEY;
  const orgId = env.REALTIMEKIT_ORG_ID;
  const baseUrl = env.REALTIMEKIT_BASE_URL ?? "realtime.cloudflare.com";

  if (!apiKey || !orgId) {
    throw new Error("RealtimeKit credentials are not configured");
  }

  return {
    apiKey,
    orgId,
    baseUrl: `https://api.${baseUrl}/v2`,
  };
};

export const getAuthHeaders = ({ apiKey, orgId }: RealtimeKitConfig) => {
  const authHeader = btoa(`${orgId}:${apiKey}`);

  return {
    Authorization: `Basic ${authHeader}`,
    "Content-Type": "application/json",
  };
};

export const apiError = (error: unknown) => {
  console.error("RealtimeKit API route failed", error);

  return Response.json({ message: "Request failed" }, { status: 500 });
};
