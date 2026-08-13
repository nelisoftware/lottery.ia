import DefaultContent from "@/components/layout/DefaultContent";
import Linhas from "@/components/ui/lotofacil/Linhas";
import { Icons } from "@/libraries/icons";

export default function LinhasPage() {
  return (
    <DefaultContent icon={<Icons.tabler.Rows />} title={"Linhas"}>
      <Linhas />
    </DefaultContent>
  );
}
