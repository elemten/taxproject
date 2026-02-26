export function normalizePhoneKey(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.length === 10) {
    return `1${digits}`;
  }

  if (digits.startsWith("00") && digits.length > 2) {
    return digits.slice(2);
  }

  return digits;
}

export function formatPhoneForWhatsApp(value: string): string {
  return normalizePhoneKey(value);
}
