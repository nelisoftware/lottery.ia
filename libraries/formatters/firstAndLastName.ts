/**
 * Format a name First and Last name
 *
 * @example
 * formatNameFirstAndLast('nelis Nelson Nazaré Pereira')
 * @param name {string} - Name to be formatted.
 * @returns  formatted name - Nelis Pereira
 */
export function FirstAndLastNameFormat(name: string) {
  let firstAndLastName = name.split(" ");

  return firstAndLastName.slice(0, 1) + " " + firstAndLastName.slice(-1);
}