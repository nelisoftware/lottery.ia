import DefaultContent from "@/components/layout/DefaultContent";
import ParesImpares from "@/components/ui/lotofacil/ParesImpares";
import { Icons } from "@/libraries/icons";

export default function ParesImparesPage() {
  return (
    <DefaultContent icon={<Icons.tabler.Scale />} title={"Pares e Ímpares"}>
      <ParesImpares />
    </DefaultContent>
  );
}
