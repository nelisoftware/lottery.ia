import prisma from "@/libraries/prisma/prisma";
import { LotofacilNumeroNaoSaindo, LotofacilNumeroSaindo, LotofacilNumeros } from "@prisma/client";


export default async function maintenanceLotoFacil() {
  try {
    // preparando ambientes bancos que são necessários ter dados
    const maintenanceNumeros = await prisma.lotofacilNumeros.findFirst();
    const maintenanceNumeroSaindo = await prisma.lotofacilNumeroSaindo.findFirst();
    const maintenanceNumeroNaoSaindo = await prisma.lotofacilNumeroNaoSaindo.findFirst();

    if (!maintenanceNumeros || !maintenanceNumeroSaindo || !maintenanceNumeroNaoSaindo) {
      const dataNumeros: LotofacilNumeros[] = [];
      const dataNumerosSaindo: LotofacilNumeroSaindo[] = [];
      const dataNumerosNaoSaindo: LotofacilNumeroNaoSaindo[] = [];

      for (let i = 1; i <= 25; i++) {
        const data = {
          numero: i,
          cont: 0,
        };
        dataNumeros.push(data);
        dataNumerosSaindo.push(data);
        dataNumerosNaoSaindo.push(data);
      }
      await prisma.$transaction(async tx => {
        if (!maintenanceNumeros) {
          await tx.lotofacilNumeros.createMany({ data: dataNumeros });
        }

        if (!maintenanceNumeroSaindo) {
          await tx.lotofacilNumeroSaindo.createMany({ data: dataNumerosSaindo });
        }

        if (!maintenanceNumeroNaoSaindo) {
          await tx.lotofacilNumeroNaoSaindo.createMany({ data: dataNumerosNaoSaindo });
        }
      });
    }
    return "ok";
  } catch (error) {
    console.log(error);
    return "erro";
  }
}
