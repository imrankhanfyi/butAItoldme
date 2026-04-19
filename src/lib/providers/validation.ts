export function requireApiKey(apiKey: string | undefined, envName: string): string {
  if (!apiKey || !apiKey.trim()) {
    throw new Error(`Missing required environment variable: ${envName}`);
  }
  return apiKey;
}
