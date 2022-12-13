function getFragment(inputStr: string) {
  let str = inputStr;

  if (str.endsWith('/') || str.endsWith('#')) {
    str = str.slice(0, str.length - 1);
  }

  const args: number[] = [];

  if (str.lastIndexOf('/') > 0) {
    args.push(str.lastIndexOf('/'));
  }

  if (str.lastIndexOf('#') > 0) {
    args.push(str.lastIndexOf('#'));
  }

  const i = Math.max(...args);

  return str.slice(i + 1);
}

function camelize(str: string): string | undefined {
  const res = str
    .split(/[^a-z0-9]+/ig)
    .filter((s) => s !== '')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('')
    // Make sure the prefix does not start with a number
    .match(/[a-z][a-z0-9]+/ig)?.[0];

  // Include 'v' so we always return something matching the pattern
  // [a-z][a-z0-9]+
  return typeof res === 'undefined' ? undefined : res[0].toLowerCase() + res.slice(1);
}

export function fragment(str: string): string {
  let value: string | undefined = getFragment(str);
  value = value ? camelize(value) : undefined;
  return value || 'v';
}
