import { fragment } from './fragment';
import { lookupPrefix, lookupUri } from './lookup';

/**
 * Look up the prefix for a given URI
 * @param uri The URI to lookup the prefix for
 * @param options
 *         - If mintOnUnknown is set to true then a custom prefix will
 *           be minted when prefix.cc does not return a result.
 *         - If existingPrefixes are provided then uriToPrefix will ensure
 *           that a prefix not already found in the keys of the provided record
 *           is returned.
 *         - You can optionally pass a custom fetch function.
 */
export async function uriToPrefix(uri: string, options: {
  mintOnUnknown: true;
  fetch?: typeof fetch;
  existingPrefixes?: Record<string, any>
}): Promise<string>
export async function uriToPrefix(uri: string, options?: {
  mintOnUnknown?: boolean;
  fetch?: typeof fetch;
  existingPrefixes?: Record<string, any>
}): Promise<string | undefined>
export async function uriToPrefix(uri: string, options?: {
  mintOnUnknown?: boolean;
  fetch?: typeof fetch;
  existingPrefixes?: Record<string, any>
}): Promise<string | undefined> {
  let result: string | undefined;

  // Collect the prefix
  try {
    result = await lookupPrefix(uri, options);
  } catch {
    if (options?.mintOnUnknown) {
      // Keep prefixes at most 4 characters long when minting a new one
      result = fragment(uri).slice(0, 4);
    }
  }

  // If there is a bank of existing prefixes make sure to make a unique one
  // by postfixing a number
  if (
    typeof result !== 'undefined'
    && typeof options?.existingPrefixes === 'object'
    && result in options.existingPrefixes
  ) {
    let i = 0;
    while (`${result}${i}` in options.existingPrefixes) {
      i += 1;
    }
    result = `${result}${i}`;
  }

  return result;
}

/**
 * Lookup the namespace commonly associated with a given prefix
 * @param prefix The prefix to lookup the namespace for
 * @param options You can optionally pass a custom fetch function
 */
export async function prefixToUri(prefix: string, options?: { fetch?: typeof fetch; }): Promise<string | undefined> {
  try {
    // The await needs to be here so that we can return undefined on rejection
    return await lookupUri(prefix, options);
  } catch {
    return undefined;
  }
}
