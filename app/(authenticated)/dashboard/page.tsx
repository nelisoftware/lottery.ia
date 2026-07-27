'use client';
import Atrasado from "@/components/ui/lotofacil/Atrasados";
import Numeros from "@/components/ui/lotofacil/Numeros";
import Repetindo from "@/components/ui/lotofacil/Repetindo";
import UltimoCartao from "@/components/ui/lotofacil/UltimoCartao";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <div className="grid grid-cols-1 gap-2 2xl:flex">
        <UltimoCartao />
        <Repetindo />
        <Atrasado />
      </div>
      <Numeros />
    </div>

  );
}