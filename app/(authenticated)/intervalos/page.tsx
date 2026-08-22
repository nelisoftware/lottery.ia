import DefaultContent from "@/components/layout/DefaultContent";
import Intervalos from "@/components/ui/lotofacil/Intervalos";
import { Icons } from "@/libraries/icons";

export default function IntervalosPage() {
  return (
    <DefaultContent icon={<Icons.tabler.AlertTriangle />} title={"Intervalos"}>
      <Intervalos />
    </DefaultContent>
  );
}
