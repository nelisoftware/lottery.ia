/**
 * Remove text accent
 *
 * @example
 * formatWithoutAccent('Macapá')
 * @param str {any} - text.
 * @returns text without accent
 */
export function WithoutAccentFormat(str: string) {
  return str
    .replace(/[aáã]/gi, "[aáã]")
    .replace(/[eé]/gi, "[eé]")
    .replace(/[ií]/gi, "[ií]")
    .replace(/[oóõ]/gi, "[oóõ]")
    .replace(/[uú]/gi, "[uú]")
    .replace(/[cç]/gi, "[cç]");
}