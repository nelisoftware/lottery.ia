'use client';
import Atrasado from "@/components/ui/lotofacil/Atrasados";
import Numeros from "@/components/ui/lotofacil/Numeros";
import ParametrosConcurso from "@/components/ui/lotofacil/ParametrosConcurso";
import Repetindo from "@/components/ui/lotofacil/Repetindo";
import ResultadoConcurso from "@/components/ui/lotofacil/ResultadoConcurso";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <div className="grid grid-cols-1 gap-2 2xl:flex">
        <ResultadoConcurso />
        <ParametrosConcurso />
      </div>
      <div className="grid grid-cols-1 gap-2 2xl:flex">
        <Repetindo />
        <Atrasado />
      </div>
      <Numeros />
    </div>

  );
}