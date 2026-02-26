const MAX_DELAY_SECONDS = 60 * 60;

export function getRetryDelaySeconds(attempts: number): number {
  const safeAttempts = Math.max(0, attempts);
  const exponential = 2 ** safeAttempts;
  return Math.min(MAX_DELAY_SECONDS, exponential * 30);
}
