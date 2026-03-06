const SESSION_COOKIE_NAME = "trustedge_admin_session";

function toBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toBase64Url(new Uint8Array(digest));
}

export function getAdminCredentials() {
  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASS;

  if (!user || !pass) {
    return null;
  }

  return { user, pass };
}

export async function createAdminSessionToken() {
  const credentials = getAdminCredentials();

  if (!credentials) {
    return null;
  }

  return sha256(`${credentials.user}:${credentials.pass}`);
}

export async function adminSessionIsValid(sessionToken: string | undefined) {
  if (!sessionToken) {
    return false;
  }

  const expected = await createAdminSessionToken();
  return Boolean(expected) && sessionToken === expected;
}

export function getAdminSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
