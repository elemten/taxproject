import { getEnv } from "@/lib/server/env";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export function supabaseStorageConfigured() {
  const env = getEnv();
  return Boolean(env.SUPABASE_STORAGE_BUCKET);
}

export async function ensureSupabaseFolder(input: {
  folderPath: string;
  markerName?: string;
}) {
  const supabase = getSupabaseServiceClient();
  const env = getEnv();

  if (!env.SUPABASE_STORAGE_BUCKET) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not configured");
  }

  const cleanFolder = trimSlashes(input.folderPath);
  const markerName = input.markerName ?? ".keep";
  const markerPath = `${cleanFolder}/${markerName}`;

  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(markerPath, new Blob(["folder marker"]), {
      contentType: "text/plain",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to ensure Supabase folder path: ${error.message}`);
  }

  return {
    id: cleanFolder,
    name: cleanFolder.split("/").pop() ?? cleanFolder,
    webUrl: undefined,
  };
}

export async function uploadSupabaseFile(input: {
  folderPath: string;
  fileName: string;
  mimeType: string;
  data: Uint8Array;
}) {
  const supabase = getSupabaseServiceClient();
  const env = getEnv();

  if (!env.SUPABASE_STORAGE_BUCKET) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not configured");
  }

  const cleanFolder = trimSlashes(input.folderPath);
  const safeFileName = input.fileName.replace(/[\\/]/g, "-");
  const objectPath = `${cleanFolder}/${safeFileName}`;

  const { data, error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(objectPath, Buffer.from(input.data), {
      contentType: input.mimeType,
      upsert: false,
    });

  if (error || !data?.path) {
    throw new Error(`Failed to upload file to Supabase Storage: ${error?.message ?? "Unknown error"}`);
  }

  return {
    id: data.path,
    name: safeFileName,
    webUrl: undefined,
    size: input.data.byteLength,
  };
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}
