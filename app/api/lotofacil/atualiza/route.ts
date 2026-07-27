import { helper } from "@/libraries/helper";
import {
  calcularCicloConjunto,
  calcularCicloDuplo,
  calcularCicloTriplo,
  calcularCicloDuploNaoSaindo,
  calcularCicloTriploNaoSaindo,
  SIMPLES,
  LINHA1,
  LINHA2,
  LINHA3,
  LINHA4,
  LINHA5,
  COLUNA1,
  COLUNA2,
  COLUNA3,
  COLUNA4,
  COLUNA5,
  PARES,
  IMPARES,
} from "@/libraries/lotofacil/ciclos";
import prisma from "@/libraries/prisma/prisma";
import { CreateLotofacil, CreateLotofacilLinha, LotofacilCaixa } from "@/types/types";
import {
  LotofacilCiclo,
  LotofacilCicloColuna1,
  LotofacilCicloColuna2,
  LotofacilCicloColuna3,
  LotofacilCicloColuna4,
  LotofacilCicloColuna5,
  LotofacilCicloDuplo,
  LotofacilCicloDuploNaoSaindo,
  LotofacilCicloImpares,
  LotofacilCicloLinha1,
  LotofacilCicloLinha2,
  LotofacilCicloLinha3,
  LotofacilCicloLinha4,
  LotofacilCicloLinha5,
  LotofacilCicloPares,
  LotofacilCicloTriplo,
  LotofacilCicloTriploNaoSaindo,
  LotofacilImpares,
  LotofacilPares,
} from "@prisma/client";
import axios from "axios";
import https from "https";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";
import maintenanceLotoFacil from "./maintenance";

export async function GET() {  
  const url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil";
  axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  // preparando ambientes bancos que são necessários ter dados perfeitos
  const maintenance = await maintenanceLotoFacil();
  if (maintenance === "erro") {
    return NextResponse.json({ messsage: "erro manutenção", status: 400 });
  }

  try {
    const data = await axios.get<LotofacilCaixa>(url).then(response => response.data);
    const lastConcurso = await prisma.lotofacil.findFirst({
      orderBy: {
        numero: "desc",
      },
    });
    if (lastConcurso?.numero === data.numero) {
      console.log("Sistema atualizado");
      return await NextResponse.json(lastConcurso);
    }

    // atualizar o sistema
    const dataLotofacil: CreateLotofacil[] = [];
    const dataImpares: LotofacilImpares[] = [];
    const dataPares: LotofacilPares[] = [];
    const dataLinhas: CreateLotofacilLinha[] = [];
    const dataCiclo: LotofacilCiclo[] = [];
    const dataCicloLinha1: LotofacilCicloLinha1[] = [];
    const dataCicloLinha2: LotofacilCicloLinha2[] = [];
    const dataCicloLinha3: LotofacilCicloLinha3[] = [];
    const dataCicloLinha4: LotofacilCicloLinha4[] = [];
    const dataCicloLinha5: LotofacilCicloLinha5[] = [];
    const dataCicloCol1: LotofacilCicloColuna1[] = [];
    const dataCicloCol2: LotofacilCicloColuna2[] = [];
    const dataCicloCol3: LotofacilCicloColuna3[] = [];
    const dataCicloCol4: LotofacilCicloColuna4[] = [];
    const dataCicloCol5: LotofacilCicloColuna5[] = [];
    const dataCicloPar: LotofacilCicloPares[] = [];
    const dataCicloImpar: LotofacilCicloImpares[] = [];
    const dataCicloDuplo: LotofacilCicloDuplo[] = [];
    const dataCicloTriplo: LotofacilCicloTriplo[] = [];
    const dataCicloDuploNaoSaindo: LotofacilCicloDuploNaoSaindo[] = [];
    const dataCicloTriploNaoSaindo: LotofacilCicloTriploNaoSaindo[] = [];

    let dataNumeros = await prisma.lotofacilNumeros.findMany({ orderBy: { numero: "asc" } });
    let dataNumerosSaindo = await prisma.lotofacilNumeroSaindo.findMany({ orderBy: { numero: "asc" } });
    let dataNumerosNaoSaindo = await prisma.lotofacilNumeroNaoSaindo.findMany({ orderBy: { numero: "asc" } });

    console.log("Atualizando até o concurso:", data.numero);

    let storeCycle = "";
    let storeCycleDuo = "";
    let storeCycleDuoWithout = "";
    let storeCycleTriple = "";
    let storeCycleTripleWithout = "";
    let storeCycleLine1 = "";
    let storeCycleLine2 = "";
    let storeCycleLine3 = "";
    let storeCycleLine4 = "";
    let storeCycleLine5 = "";
    let storeCycleCol1 = "";
    let storeCycleCol2 = "";
    let storeCycleCol3 = "";
    let storeCycleCol4 = "";
    let storeCycleCol5 = "";
    let storeCyclePar = "";
    let storeCycleImpar = "";
    
    if (lastConcurso?.numero) {
      if (lastConcurso.numero > 0) {
        const dataStoreCycle = await prisma.lotofacilCiclo.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycle = dataStoreCycle?.numeros ?? "";

        const dataStoreCycleLine1 = await prisma.lotofacilCicloLinha1.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleLine1 = dataStoreCycleLine1?.numeros ?? "";

        const dataStoreCycleLine2 = await prisma.lotofacilCicloLinha2.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleLine2 = dataStoreCycleLine2?.numeros ?? "";

        const dataStoreCycleLine3 = await prisma.lotofacilCicloLinha3.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleLine3 = dataStoreCycleLine3?.numeros ?? "";

        const dataStoreCycleLine4 = await prisma.lotofacilCicloLinha4.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleLine4 = dataStoreCycleLine4?.numeros ?? "";

        const dataStoreCycleLine5 = await prisma.lotofacilCicloLinha5.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleLine5 = dataStoreCycleLine5?.numeros ?? "";

        const dataStoreCycleCol1 = await prisma.lotofacilCicloColuna1.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleCol1 = dataStoreCycleCol1?.numeros ?? "";

        const dataStoreCycleCol2 = await prisma.lotofacilCicloColuna2.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleCol2 = dataStoreCycleCol2?.numeros ?? "";

        const dataStoreCycleCol3 = await prisma.lotofacilCicloColuna3.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleCol3 = dataStoreCycleCol3?.numeros ?? "";

        const dataStoreCycleCol4 = await prisma.lotofacilCicloColuna4.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleCol4 = dataStoreCycleCol4?.numeros ?? "";

        const dataStoreCycleCol5 = await prisma.lotofacilCicloColuna5.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleCol5 = dataStoreCycleCol5?.numeros ?? "";

        const dataStoreCyclePar = await prisma.lotofacilCicloPares.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCyclePar = dataStoreCyclePar?.numeros ?? "";

        const dataStoreCycleImpar = await prisma.lotofacilCicloImpares.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleImpar = dataStoreCycleImpar?.numeros ?? "";

        const dataStoreCycleDuo = await prisma.lotofacilCicloDuplo.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleDuo = dataStoreCycleDuo?.numeros ?? "";

        const dataStoreCycleTriple = await prisma.lotofacilCicloTriplo.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleTriple = dataStoreCycleTriple?.numeros ?? "";

        const dataStoreCycleTripleWithout = await prisma.lotofacilCicloTriploNaoSaindo.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleTripleWithout = dataStoreCycleTripleWithout?.numeros ?? "";

        const dataStoreCycleDuoWithout = await prisma.lotofacilCicloDuploNaoSaindo.findFirst({
          orderBy: {
            concurso: "desc",
          },
        });
        storeCycleDuoWithout = dataStoreCycleDuoWithout?.numeros ?? "";
      }
    }
    for (let i = (lastConcurso?.numero ?? 0) + 1; i <= data.numero; i++) {
      console.log("concurso:", i);
      let tries = 0;
      while (tries <= 5) {
        try {
          const { data } = await axios<LotofacilCaixa>(url + "/" + i, { timeout: 30000 });
          tries = 6;
          const dezenas = data.listaDezenas.map(dezena => +dezena);
          const dataConvertida = DateTime.fromFormat(data.dataApuracao, "dd/MM/yyyy").toISO();
          const createLotofacil: CreateLotofacil = {
            dataApuracao: new Date(dataConvertida ?? "01/01/1980"),
            numero: data.numero,
            bola01: dezenas[0],
            bola02: dezenas[1],
            bola03: dezenas[2],
            bola04: dezenas[3],
            bola05: dezenas[4],
            bola06: dezenas[5],
            bola07: dezenas[6],
            bola08: dezenas[7],
            bola09: dezenas[8],
            bola10: dezenas[9],
            bola11: dezenas[10],
            bola12: dezenas[11],
            bola13: dezenas[12],
            bola14: dezenas[13],
            bola15: dezenas[14],
            ganhadores: data.listaRateioPremio[0].numeroDeGanhadores,
          };
          dataLotofacil.push(createLotofacil);

          dataNumeros = dataNumeros.map(numero => (dezenas.includes(numero.numero) ? { ...numero, cont: numero.cont + 1 } : { ...numero }));
          dataNumerosSaindo = dataNumerosSaindo.map(numero =>
            dezenas.includes(numero.numero) ? { ...numero, cont: numero.cont + 1 } : { ...numero, cont: 0 }
          );
          dataNumerosNaoSaindo = dataNumerosNaoSaindo.map(numero =>
            !dezenas.includes(numero.numero) ? { ...numero, cont: numero.cont + 1 } : { ...numero, cont: 0 }
          );

          let impares: number[] = [];
          let pares: number[] = [];
          let linha1: number[] = [];
          let linha2: number[] = [];
          let linha3: number[] = [];
          let linha4: number[] = [];
          let linha5: number[] = [];
          dezenas.forEach(dezena => {
            if (dezena % 2 === 0) {
              pares.push(dezena);
            } else {
              impares.push(dezena);
            }

            if (dezena <= 5) {
              linha1.push(dezena);
            } else if (dezena <= 10) {
              linha2.push(dezena);
            } else if (dezena <= 15) {
              linha3.push(dezena);
            } else if (dezena <= 20) {
              linha4.push(dezena);
            } else {
              linha5.push(dezena);
            }
          });

          dataImpares.push({
            concurso: data.numero,
            total: impares.length,
            n01: impares[0],
            n02: impares[1],
            n03: impares[2],
            n04: impares[3],
            n05: impares[4],
            n06: impares[5],
            n07: impares[6],
            n08: impares[7],
            n09: impares[8],
            n10: impares[9],
            n11: impares[10],
            n12: impares[11],
            n13: impares[12],
          });

          dataPares.push({
            concurso: data.numero,
            total: pares.length,
            n01: pares[0],
            n02: pares[1],
            n03: pares[2],
            n04: pares[3],
            n05: pares[4],
            n06: pares[5],
            n07: pares[6],
            n08: pares[7],
            n09: pares[8],
            n10: pares[9],
            n11: pares[10],
            n12: pares[11],
          });

          dataLinhas.push({
            concurso: data.numero,
            linha: 1,
            n01: linha1[0],
            n02: linha1[1],
            n03: linha1[2],
            n04: linha1[3],
            n05: linha1[4],
            total: linha1.length,
          });

          dataLinhas.push({
            concurso: data.numero,
            linha: 2,
            n01: linha2[0],
            n02: linha2[1],
            n03: linha2[2],
            n04: linha2[3],
            n05: linha2[4],
            total: linha2.length,
          });

          dataLinhas.push({
            concurso: data.numero,
            linha: 3,
            n01: linha3[0],
            n02: linha3[1],
            n03: linha3[2],
            n04: linha3[3],
            n05: linha3[4],
            total: linha3.length,
          });

          dataLinhas.push({
            concurso: data.numero,
            linha: 4,
            n01: linha4[0],
            n02: linha4[1],
            n03: linha4[2],
            n04: linha4[3],
            n05: linha4[4],
            total: linha1.length,
          });

          dataLinhas.push({
            concurso: data.numero,
            linha: 5,
            n01: linha5[0],
            n02: linha5[1],
            n03: linha5[2],
            n04: linha5[3],
            n05: linha5[4],
            total: linha5.length,
          });

          // # ciclos por conjunto fixo (simples, linhas, colunas, pares/ímpares)
          const resultadoCiclo = calcularCicloConjunto(SIMPLES, storeCycle, dezenas);
          dataCiclo.push({ concurso: data.numero, completo: resultadoCiclo.completo, numeros: resultadoCiclo.numeros });
          storeCycle = resultadoCiclo.numeros;

          const resultadoLinha1 = calcularCicloConjunto(LINHA1, storeCycleLine1, dezenas);
          dataCicloLinha1.push({ concurso: data.numero, completo: resultadoLinha1.completo, numeros: resultadoLinha1.numeros });
          storeCycleLine1 = resultadoLinha1.numeros;

          const resultadoLinha2 = calcularCicloConjunto(LINHA2, storeCycleLine2, dezenas);
          dataCicloLinha2.push({ concurso: data.numero, completo: resultadoLinha2.completo, numeros: resultadoLinha2.numeros });
          storeCycleLine2 = resultadoLinha2.numeros;

          const resultadoLinha3 = calcularCicloConjunto(LINHA3, storeCycleLine3, dezenas);
          dataCicloLinha3.push({ concurso: data.numero, completo: resultadoLinha3.completo, numeros: resultadoLinha3.numeros });
          storeCycleLine3 = resultadoLinha3.numeros;

          const resultadoLinha4 = calcularCicloConjunto(LINHA4, storeCycleLine4, dezenas);
          dataCicloLinha4.push({ concurso: data.numero, completo: resultadoLinha4.completo, numeros: resultadoLinha4.numeros });
          storeCycleLine4 = resultadoLinha4.numeros;

          const resultadoLinha5 = calcularCicloConjunto(LINHA5, storeCycleLine5, dezenas);
          dataCicloLinha5.push({ concurso: data.numero, completo: resultadoLinha5.completo, numeros: resultadoLinha5.numeros });
          storeCycleLine5 = resultadoLinha5.numeros;

          const resultadoCol1 = calcularCicloConjunto(COLUNA1, storeCycleCol1, dezenas);
          dataCicloCol1.push({ concurso: data.numero, completo: resultadoCol1.completo, numeros: resultadoCol1.numeros });
          storeCycleCol1 = resultadoCol1.numeros;

          const resultadoCol2 = calcularCicloConjunto(COLUNA2, storeCycleCol2, dezenas);
          dataCicloCol2.push({ concurso: data.numero, completo: resultadoCol2.completo, numeros: resultadoCol2.numeros });
          storeCycleCol2 = resultadoCol2.numeros;

          const resultadoCol3 = calcularCicloConjunto(COLUNA3, storeCycleCol3, dezenas);
          dataCicloCol3.push({ concurso: data.numero, completo: resultadoCol3.completo, numeros: resultadoCol3.numeros });
          storeCycleCol3 = resultadoCol3.numeros;

          const resultadoCol4 = calcularCicloConjunto(COLUNA4, storeCycleCol4, dezenas);
          dataCicloCol4.push({ concurso: data.numero, completo: resultadoCol4.completo, numeros: resultadoCol4.numeros });
          storeCycleCol4 = resultadoCol4.numeros;

          const resultadoCol5 = calcularCicloConjunto(COLUNA5, storeCycleCol5, dezenas);
          dataCicloCol5.push({ concurso: data.numero, completo: resultadoCol5.completo, numeros: resultadoCol5.numeros });
          storeCycleCol5 = resultadoCol5.numeros;

          const resultadoPar = calcularCicloConjunto(PARES, storeCyclePar, dezenas);
          dataCicloPar.push({ concurso: data.numero, completo: resultadoPar.completo, numeros: resultadoPar.numeros });
          storeCyclePar = resultadoPar.numeros;

          const resultadoImpar = calcularCicloConjunto(IMPARES, storeCycleImpar, dezenas);
          dataCicloImpar.push({ concurso: data.numero, completo: resultadoImpar.completo, numeros: resultadoImpar.numeros });
          storeCycleImpar = resultadoImpar.numeros;

          // ## ciclos de duplas/triplas adjacentes (e suas variantes "não saindo")
          const resultadoDuplo = calcularCicloDuplo(storeCycleDuo, dezenas);
          dataCicloDuplo.push({ concurso: data.numero, completo: resultadoDuplo.completo, numeros: resultadoDuplo.numeros });
          storeCycleDuo = resultadoDuplo.numeros;

          const resultadoTriplo = calcularCicloTriplo(storeCycleTriple, dezenas);
          dataCicloTriplo.push({ concurso: data.numero, completo: resultadoTriplo.completo, numeros: resultadoTriplo.numeros });
          storeCycleTriple = resultadoTriplo.numeros;

          const resultadoDuploNaoSaindo = calcularCicloDuploNaoSaindo(storeCycleDuoWithout, dezenas);
          dataCicloDuploNaoSaindo.push({
            concurso: data.numero,
            completo: resultadoDuploNaoSaindo.completo,
            numeros: resultadoDuploNaoSaindo.numeros,
          });
          storeCycleDuoWithout = resultadoDuploNaoSaindo.numeros;

          const resultadoTriploNaoSaindo = calcularCicloTriploNaoSaindo(storeCycleTripleWithout, dezenas);
          dataCicloTriploNaoSaindo.push({
            concurso: data.numero,
            completo: resultadoTriploNaoSaindo.completo,
            numeros: resultadoTriploNaoSaindo.numeros,
          });
          storeCycleTripleWithout = resultadoTriploNaoSaindo.numeros;
        } catch (error) {
          tries++;
          console.log("deu erro... tentativa:", tries);
        }
      }
    } // for

    console.log("gravando no banco");
    await prisma.$transaction(
      async tx => {
        await tx.lotofacil.createMany({ data: dataLotofacil });
        await tx.lotofacilNumeros.deleteMany({});
        await tx.lotofacilNumeros.createMany({ data: dataNumeros });
        await tx.lotofacilNumeroSaindo.deleteMany({});
        await tx.lotofacilNumeroSaindo.createMany({ data: dataNumerosSaindo });
        await tx.lotofacilNumeroNaoSaindo.deleteMany({});
        await tx.lotofacilNumeroNaoSaindo.createMany({ data: dataNumerosNaoSaindo });
        await tx.lotofacilImpares.createMany({ data: dataImpares });
        await tx.lotofacilPares.createMany({ data: dataPares });
        await tx.lotofacilLinhas.createMany({ data: dataLinhas });
        await tx.lotofacilCiclo.createMany({ data: dataCiclo });
        await tx.lotofacilCicloDuplo.createMany({ data: dataCicloDuplo });
        await tx.lotofacilCicloTriplo.createMany({ data: dataCicloTriplo });
        await tx.lotofacilCicloDuploNaoSaindo.createMany({ data: dataCicloDuploNaoSaindo });
        await tx.lotofacilCicloTriploNaoSaindo.createMany({ data: dataCicloTriploNaoSaindo });
        await tx.lotofacilCicloLinha1.createMany({ data: dataCicloLinha1 });
        await tx.lotofacilCicloLinha2.createMany({ data: dataCicloLinha2 });
        await tx.lotofacilCicloLinha3.createMany({ data: dataCicloLinha3 });
        await tx.lotofacilCicloLinha4.createMany({ data: dataCicloLinha4 });
        await tx.lotofacilCicloLinha5.createMany({ data: dataCicloLinha5 });
        await tx.lotofacilCicloColuna1.createMany({ data: dataCicloCol1 });
        await tx.lotofacilCicloColuna2.createMany({ data: dataCicloCol2 });
        await tx.lotofacilCicloColuna3.createMany({ data: dataCicloCol3 });
        await tx.lotofacilCicloColuna4.createMany({ data: dataCicloCol4 });
        await tx.lotofacilCicloColuna5.createMany({ data: dataCicloCol5 });
        await tx.lotofacilCicloPares.createMany({ data: dataCicloPar });
        await tx.lotofacilCicloImpares.createMany({ data: dataCicloImpar });
      },
      {
        maxWait: 20000, // default: 2000
        timeout: 40000, // default: 5000
      }
    );
    console.log("Sistema atualizado");

    // console.log('atualizando os ciclos');
    // console.log("concursos", dataLotofacil);

    return NextResponse.json(lastConcurso);
  } catch (error) {
    return helper.handleError(error);
  }
}
