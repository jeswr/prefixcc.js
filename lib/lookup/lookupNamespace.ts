// TODO: Use universal fetch here
import { fetch } from 'cross-fetch';

/**
 * Use prefix.cc to look up the namespace associated with a given prefix.
 * Errors if one cannot be found.
 *
 * @param prefix The prefix of which to obtain the namespace
 * @param options Optional fetch function to use
 */
export async function lookupUri(prefix: string, options?: { fetch?: typeof fetch }): Promise<string> {
  // Select the correct fetch function
  const fetchFn = options?.fetch ?? fetch;

  const res = await (await fetchFn(`https://prefix.cc/${prefix}.file.jsonld`)).json();

  const uri = res['@context'][prefix];

  if (typeof uri !== 'string') {
    throw new Error(`Expected uri to be a string, received: ${uri} of type ${typeof uri}`);
  }

  return uri;
}
