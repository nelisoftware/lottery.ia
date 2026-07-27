import CicloDuploNot from "@/components/ui/lotofacil/CicloDuploNot";
import CicloTriploNot from "@/components/ui/lotofacil/CicloTriploNot";

export default function CyclesPage() {
  return (
    <div className="flex flex-col p-2 xl:flex-row gap-2">
      <CicloDuploNot />
      <CicloTriploNot />
    </div>
  );
}