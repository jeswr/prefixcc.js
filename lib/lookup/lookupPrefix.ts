// TODO: Use universal fetch here
import { fetch } from 'cross-fetch';

/**
 * Use prefix.cc to look up the prefix for a URI namespace, rejects if there is an error in
 * looking up the prefix, or if no prefixes are returned
 *
 * @param uri The URI to obtain a prefix for
 * @param options Optional fetch function to use
 */
export async function lookupPrefix(uri: string, options?: { fetch?: typeof fetch }): Promise<string> {
  // Select the correct fetch function
  const fetchFn = options?.fetch ?? fetch;

  // Create the correct url to lookup including search parameters
  const url = new URL('https://prefix.cc/reverse');
  url.searchParams.append('uri', uri);
  url.searchParams.append('format', 'jsonld');

  const res = await (await fetchFn(url)).json();

  const prefixes = Object.keys(res['@context']);

  if (prefixes.length === 0) {
    throw new Error('No prefixes returned');
  }

  return prefixes[0];
}
