// components/unions/UnionEmptyState.tsx
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnionEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export default function UnionEmptyState({
  searchQuery,
  onClearSearch,
}: UnionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
      <Users className="h-12 w-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Aucun sacrement trouvé
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">
        {searchQuery
          ? "Aucun sacrement ne correspond à votre recherche."
          : "Aucun sacrement d'union n'est enregistré pour le moment."}
      </p>
      {searchQuery && (
        <Button variant="outline" onClick={onClearSearch}>
          Effacer la recherche
        </Button>
      )}
    </div>
  );
}
