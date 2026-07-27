/**
 * @example formatCPFtoScreen('12345678900')
 * @param cpf {string} - cpf number
 * @returns formatted cpf - 123.456.789-00
 */

export function CPFtoScreenFormat(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}