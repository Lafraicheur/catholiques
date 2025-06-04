// components/unions/UnionTableContainer.tsx
import { useRouter } from "next/navigation";
import { SacrementUnion } from "@/types/union";
import UnionTable from "./UnionCard";

interface UnionTableContainerProps {
  sacrements: SacrementUnion[];
  onDelete: (id: number) => void;
}

export default function UnionTableContainer({
  sacrements,
  onDelete,
}: UnionTableContainerProps) {
  const router = useRouter();

  const handleView = (id: number) => {
    router.push(`/dashboard/paroisse/sacrements/unions/${id}`);
  };

  return (
    <UnionTable
      sacrements={sacrements}
      onDelete={onDelete}
      onView={handleView}
    />
  );
}
