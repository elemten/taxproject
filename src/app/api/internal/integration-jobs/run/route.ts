import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/server/env";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import { processDueIntegrationJobs } from "@/lib/server/integration-jobs";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const env = getEnv();
  const token = env.INTERNAL_JOB_RUNNER_TOKEN;

  if (!token) {
    return jsonError("INTERNAL_JOB_RUNNER_TOKEN is not configured", 503);
  }

  const authHeader = request.headers.get("authorization");
  const providedToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : request.headers.get("x-job-runner-token");

  if (!providedToken || providedToken !== token) {
    return jsonError("Unauthorized", 401);
  }

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  try {
    const summary = await processDueIntegrationJobs(Number.isFinite(limit) ? limit : 20);

    return NextResponse.json(
      {
        ok: true,
        summary,
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Worker run failed", 500);
  }
}
