/**
 * Format string to just number
 *
 * @example
 * formatNumberOnly('68.900-074')
 * @param str {string} - String with number and others caracteres.
 * @returns only numbers -  68900074
 */
export function OnlyNumberFormat(str: string) {
  return str.replace(/[^0-9]/g, "");
}