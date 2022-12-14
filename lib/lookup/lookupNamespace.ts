import { fetchContext, OptionalFetch } from './fetchContext';

/**
 * Use prefix.cc to look up the namespace associated with a given prefix.
 * Errors if one cannot be found.
 *
 * @param prefix The prefix of which to obtain the namespace
 * @param options Optional fetch function to use
 */
export async function lookupUri(prefix: string, options?: OptionalFetch): Promise<string> {
  const uri = (await fetchContext(`https://prefix.cc/${prefix}.file.jsonld`, options))[prefix];

  if (typeof uri !== 'string') {
    throw new Error(`Expected uri to be a string, received: ${uri} of type ${typeof uri}`);
  }

  return uri;
}
