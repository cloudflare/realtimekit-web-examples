import type { AppLoadContext } from "react-router";

type RuntimeEnv = Record<string, string | undefined>;

const getRuntimeEnv = (context: AppLoadContext): RuntimeEnv => {
  return context.cloudflare.env as unknown as RuntimeEnv;
};

export const getRealtimeKitConfig = (context: AppLoadContext) => {
  const env = getRuntimeEnv(context);
  const buildEnv = import.meta.env as unknown as RuntimeEnv;
  const apiKey =
    env.REALTIMEKIT_API_KEY ??
    env.VITE_API_KEY ??
    buildEnv.VITE_API_KEY;
  const orgId = env.REALTIMEKIT_ORG_ID ?? env.VITE_ORG_ID ?? buildEnv.VITE_ORG_ID;
  const baseUrl =
    env.REALTIMEKIT_BASE_URL ??
    env.VITE_BASE_URL ??
    buildEnv.VITE_BASE_URL ??
    "realtime.cloudflare.com";

  if (!apiKey || !orgId) {
    throw new Error("RealtimeKit credentials are not configured");
  }

  return {
    apiKey,
    orgId,
    baseUrl: `https://api.${baseUrl}/v2`,
  };
};

export const getAuthHeaders = (context: AppLoadContext) => {
  const { apiKey, orgId } = getRealtimeKitConfig(context);
  const authHeader = btoa(`${orgId}:${apiKey}`);

  return {
    Authorization: `Basic ${authHeader}`,
    "Content-Type": "application/json",
  };
};

export const apiError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Request failed";

  return Response.json({ message }, { status: 500 });
};
