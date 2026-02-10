import { z } from "zod";

const optionalString = () =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().min(1).optional(),
  );

const optionalEmail = () =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().email().optional(),
  );

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ADMIN_BASIC_AUTH_USER: z.string().min(1),
  ADMIN_BASIC_AUTH_PASS: z.string().min(1),
  RESEND_API_KEY: optionalString(),
  NOTIFICATION_EMAIL_FROM: optionalEmail(),
  NOTIFICATION_EMAIL_TO: optionalEmail(),
  WHATSAPP_ACCESS_TOKEN: optionalString(),
  WHATSAPP_PHONE_NUMBER_ID: optionalString(),
  WHATSAPP_BUSINESS_NUMBER: optionalString(),
  NEXT_PUBLIC_DEFAULT_TIMEZONE: z.string().default("America/Regina"),
});

type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | null = null;

export function getEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid server environment: ${formatted}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
