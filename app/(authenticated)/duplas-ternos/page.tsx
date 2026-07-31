import DefaultContent from "@/components/layout/DefaultContent";
import RankingCombinacoes from "@/components/ui/lotofacil/RankingCombinacoes";
import { Icons } from "@/libraries/icons";

export default function DuplasTernosPage() {
  return (
    <DefaultContent icon={<Icons.tabler.Grid />} title={"Duplas e Ternos"}>
      <RankingCombinacoes />
    </DefaultContent>
  );
}
