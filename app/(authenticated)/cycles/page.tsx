import Ciclo from "@/components/ui/lotofacil/Ciclo";
import CicloColuna1 from "@/components/ui/lotofacil/CicloColuna1";
import CicloColuna2 from "@/components/ui/lotofacil/CicloColuna2";
import CicloColuna3 from "@/components/ui/lotofacil/CicloColuna3";
import CicloColuna4 from "@/components/ui/lotofacil/CicloColuna4";
import CicloColuna5 from "@/components/ui/lotofacil/CicloColuna5";
import CicloDuplo from "@/components/ui/lotofacil/CicloDuplo";
import CicloImpares from "@/components/ui/lotofacil/CicloImpares";
import CicloLinha1 from "@/components/ui/lotofacil/CicloLinha1";
import CicloLinha2 from "@/components/ui/lotofacil/CicloLinha2";
import CicloLinha3 from "@/components/ui/lotofacil/CicloLinha3";
import CicloLinha4 from "@/components/ui/lotofacil/CicloLinha4";
import CicloLinha5 from "@/components/ui/lotofacil/CicloLinha5";
import CicloPares from "@/components/ui/lotofacil/CicloPares";
import CicloTriplo from "@/components/ui/lotofacil/CicloTriplo";

export default function CyclesPage() {
  return (
    <div className="flex flex-col p-2 xl:flex-row gap-2 flex-wrap">    
      <Ciclo />
      <CicloDuplo />
      <CicloTriplo />
      <CicloLinha1 />
      <CicloLinha2 />
      <CicloLinha3 />
      <CicloLinha4 />
      <CicloLinha5 />
      <CicloColuna1 />
      <CicloColuna2 />
      <CicloColuna3 />
      <CicloColuna4 />
      <CicloColuna5 />
      <CicloImpares />
      <CicloPares />
    </div>
  );
}