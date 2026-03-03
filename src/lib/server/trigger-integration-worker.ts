import { getEnv } from "@/lib/server/env";

const WORKER_TIMEOUT_MS = 3500;

export async function triggerIntegrationWorker(origin: string, limit = 10) {
  const env = getEnv();
  if (!env.INTERNAL_JOB_RUNNER_TOKEN) {
    return;
  }

  const url = new URL("/api/internal/integration-jobs/run", origin);
  url.searchParams.set("limit", String(Math.max(1, Math.min(50, limit))));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WORKER_TIMEOUT_MS);

  try {
    await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.INTERNAL_JOB_RUNNER_TOKEN}`,
      },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Auto-trigger worker request failed", error);
  } finally {
    clearTimeout(timeout);
  }
}
