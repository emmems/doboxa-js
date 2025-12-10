/**
 * Configuration helper for reading environment variables
 */
export function getBaseURL(): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.DOBOXA_API_URL;
  }
  return undefined;
}

