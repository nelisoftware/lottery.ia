/**
 * @example
 * formatZipCodeToScreen(68900000)
 *
 * @param zipCode {string} Zip code to be formatted
 * @returns Zip Code formated - 68900-000
 */
export function ZipCodeToScreenFormat(zipCode: string) {
  return zipCode.replace(/(\d{5})(\d{3})/, "$1-$2");
}
