import { uriToPrefix, prefixToUri, lookupAllPrefixes } from '../lib';

function contextResponse(pref: string, url: string): any {
  return { json: () => ({ '@context': { [pref]: url } }) };
}

const allPref = { a: 'http://example.org/a', b: 'http://example.org/b' };

async function fetchFn(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
  switch (`${args[0]}`) {
    case 'https://prefix.cc/reverse?uri=http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F&format=jsonld':
    case 'https://prefix.cc/foaf.file.jsonld':
      return contextResponse('foaf', 'http://xmlns.com/foaf/0.1/');
    case 'https://prefix.cc/reverse?uri=https%3A%2F%2Fwww.my-url%2Fetad%2F&format=jsonld':
    case 'https://prefix.cc/bs.file.jsonld':
      return { json: () => { throw new Error('cannot convert to json'); } } as any;
    case 'https://prefix.cc/reverse?uri=https%3A%2F%2Fwww.my-url%2Fno-context%2F&format=jsonld':
    case 'https://prefix.cc/empty.file.jsonld':
      return { json: () => ({ '@context': {} }) } as any;
    case 'https://prefix.cc/context':
      return { json: () => ({ '@context': allPref }) } as any;
    default:
      throw new Error(`Unexpected URL ${args[0]}`);
  }
}

jest.mock('cross-fetch', () => ({ fetch: fetchFn }));

describe('uriToPrefix', () => {
  it('should use the URI when one is available', () => {
    expect(uriToPrefix('http://xmlns.com/foaf/0.1/')).resolves.toEqual('foaf');
  });

  it('should use the URI when one is available using custom fetch', () => {
    expect(uriToPrefix('http://xmlns.com/foaf/0.1/', { fetch: fetchFn })).resolves.toEqual('foaf');
  });

  it('should use the URI with added 0 when one is available', () => {
    expect(
      uriToPrefix('http://xmlns.com/foaf/0.1/', { existingPrefixes: { foaf: '' } }),
    ).resolves.toEqual('foaf0');
  });

  it('should use the URI with added 1 when one is available', () => {
    expect(
      uriToPrefix('http://xmlns.com/foaf/0.1/', { existingPrefixes: { foaf: '', foaf0: '' } }),
    ).resolves.toEqual('foaf1');
  });

  it('should return undefined when no prefix available and website returns html', () => {
    expect(uriToPrefix('https://www.my-url/etad/')).resolves.toBeUndefined();
  });

  it('should return undefined when no prefix available and website returns empty context', () => {
    expect(uriToPrefix('https://www.my-url/no-context/')).resolves.toBeUndefined();
  });

  it('should be able to mint a new uri when no prefix available', () => {
    expect(
      uriToPrefix('https://www.my-url/etad', { mintOnUnknown: true }),
    ).resolves.toEqual('etad');
  });

  it('should be able to mint a new uri when no prefix available (with trailing fragment on namespace)', () => {
    expect(
      uriToPrefix('https://www.my-url/etad#', { mintOnUnknown: true }),
    ).resolves.toEqual('etad');
  });

  it('should be able to mint a new uri when no prefix available using component after frament', () => {
    expect(
      uriToPrefix('https://www.my-url/etad#abc', { mintOnUnknown: true }),
    ).resolves.toEqual('abc');
  });

  it('should be able to mint a new uri when no prefix available (with trailing slash on namespace)', () => {
    expect(
      uriToPrefix('https://www.my-url/etad/', { mintOnUnknown: true }),
    ).resolves.toEqual('etad');
  });

  it('should be able to mint a new uri containing dash', () => {
    expect(
      uriToPrefix('https://www.my-url/et-ad/', { mintOnUnknown: true }),
    ).resolves.toEqual('etAd');
  });

  it('should be able to mint a new uri removing characters with length greater than 4', () => {
    expect(
      uriToPrefix('https://www.my-url/et-ad-mno/', { mintOnUnknown: true }),
    ).resolves.toEqual('etAd');
  });

  it('should mint v when the url is garbage ending with trailing slash', () => {
    expect(
      uriToPrefix('https://d/-//-//', { mintOnUnknown: true }),
    ).resolves.toEqual('v');
  });

  it('should mint v when the url is garbage ending without trailing slash', () => {
    expect(
      uriToPrefix('https://-', { mintOnUnknown: true }),
    ).resolves.toEqual('v');
  });
});

describe('prefixToUri', () => {
  it('should be able to lookup the namespace commonly associated with foaf', () => {
    expect(
      prefixToUri('foaf'),
    ).resolves.toEqual('http://xmlns.com/foaf/0.1/');
  });

  it('should be able to lookup the namespace commonly associated with foaf using custom fetch', () => {
    expect(
      prefixToUri('foaf', { fetch: fetchFn }),
    ).resolves.toEqual('http://xmlns.com/foaf/0.1/');
  });

  it('should return undefined on prefixes that prefixcc does not know how to handle', () => {
    expect(
      prefixToUri('bs'),
    ).resolves.toBeUndefined();
  });

  it('should return undefined on prefixes that prefixcc does not know how to handle returning empty context', () => {
    expect(
      prefixToUri('empty'),
    ).resolves.toBeUndefined();
  });

  describe('lookupAllPrefixes', () => {
    expect(lookupAllPrefixes()).resolves.toEqual(allPref);
    expect(lookupAllPrefixes({ fetch: fetchFn })).resolves.toEqual(allPref);
  });
});
