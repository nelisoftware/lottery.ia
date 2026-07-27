import DefaultContent from "@/components/layout/DefaultContent";
import SequenciasNumeros from "@/components/ui/lotofacil/SequenciasNumeros";
import { Icons } from "@/libraries/icons";

export default function SequenciasPage() {
  return (
    <DefaultContent icon={<Icons.tabler.ChartBar />} title={"Sequências dos números"}>
      <SequenciasNumeros />
    </DefaultContent>
  );
}
