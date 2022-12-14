import { fetchContext, OptionalFetch } from './fetchContext';

/**
 * Use prefix.cc to look up all recorded prefixes
 */
export async function lookupAllPrefixes(options?: OptionalFetch): Promise<Record<string, string>> {
  return fetchContext('https://prefix.cc/context', options);
}
