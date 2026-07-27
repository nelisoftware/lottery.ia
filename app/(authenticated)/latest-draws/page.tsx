import DefaultContent from "@/components/layout/DefaultContent";
import UltimosConcursos from "@/components/ui/lotofacil/UltimosConcursos";
import { Icons } from "@/libraries/icons";

export default function LatestDrawsPage() {
  return (
    <DefaultContent icon={<Icons.tabler.List />} title={"Últimos concursos"}>
      <UltimosConcursos />
    </DefaultContent>    
  );
}