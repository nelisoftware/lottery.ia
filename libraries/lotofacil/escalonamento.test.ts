import { describe, expect, it } from "vitest";
import { gerarEscalonamento } from "./escalonamento";

describe("gerarEscalonamento", () => {
  it("gera 21 intervalos quando há 3 números fixos", () => {
    const resultado = gerarEscalonamento([1, 2, 3], 15, 5);
    expect(resultado.fixos).toEqual([1, 2, 3]);
    expect(resultado.intervalos).toHaveLength(21);
  });

  it("cada intervalo tem pool de 20 números, sem fixos nem escalonados", () => {
    const resultado = gerarEscalonamento([1, 2, 3], 15, 3);
    resultado.intervalos.forEach(intervalo => {
      expect(intervalo.pool).toHaveLength(20);
      expect(new Set(intervalo.pool).size).toBe(20);
      resultado.fixos.forEach(f => expect(intervalo.pool).not.toContain(f));
      intervalo.escalonados.forEach(e => expect(intervalo.pool).not.toContain(e));
    });
  });

  it("o par escalonado avança 1 a 1, com sobreposição entre intervalos consecutivos", () => {
    const resultado = gerarEscalonamento([1, 2, 3], 15, 1);
    expect(resultado.intervalos[0].escalonados).toEqual([4, 5]);
    expect(resultado.intervalos[1].escalonados).toEqual([5, 6]);
    expect(resultado.intervalos[resultado.intervalos.length - 1].escalonados).toEqual([24, 25]);

    for (let i = 1; i < resultado.intervalos.length; i++) {
      const anterior = resultado.intervalos[i - 1].escalonados;
      const atual = resultado.intervalos[i].escalonados;
      expect(atual[0]).toBe(anterior[1]);
    }
  });

  it("gera cartelas únicas, do tamanho pedido, dentro do pool do intervalo", () => {
    const resultado = gerarEscalonamento([1, 2, 3], 15, 5);
    resultado.intervalos.forEach(intervalo => {
      expect(intervalo.cartelas).toHaveLength(5);
      const chaves = new Set(intervalo.cartelas.map(c => c.join(',')));
      expect(chaves.size).toBe(intervalo.cartelas.length);
      intervalo.cartelas.forEach(cartela => {
        expect(cartela).toHaveLength(15);
        cartela.forEach(n => expect(intervalo.pool).toContain(n));
      });
    });
  });

  it("lança erro se não forem informados exatamente 3 fixos", () => {
    expect(() => gerarEscalonamento([1, 2], 15, 5)).toThrow();
    expect(() => gerarEscalonamento([1, 2, 3, 4], 15, 5)).toThrow();
  });

  it("lança erro se o tamanho da cartela estiver fora de 15-20", () => {
    expect(() => gerarEscalonamento([1, 2, 3], 14, 5)).toThrow();
    expect(() => gerarEscalonamento([1, 2, 3], 21, 5)).toThrow();
  });

  it("com tamanhoCartela 20, cada intervalo tem no máximo 1 cartela possível (o próprio pool)", () => {
    const resultado = gerarEscalonamento([1, 2, 3], 20, 5);
    resultado.intervalos.forEach(intervalo => {
      expect(intervalo.cartelas.length).toBeLessThanOrEqual(1);
      if (intervalo.cartelas.length === 1) {
        expect(intervalo.cartelas[0]).toEqual(intervalo.pool);
      }
    });
  });
});
