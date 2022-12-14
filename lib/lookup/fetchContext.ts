// TODO: Use universal fetch here
import { fetch } from 'cross-fetch';

export interface OptionalFetch { fetch?: typeof fetch }

export async function fetchJson(url: string | URL, options?: OptionalFetch) {
  // Select the correct fetch function
  const fetchFn = options?.fetch ?? fetch;
  return (await fetchFn(url)).json();
}

export async function fetchContext(url: string | URL, options?: OptionalFetch): Promise<Record<string, string>> {
  return (await fetchJson(url, options))['@context'];
}
