// components/sacrements/SacrementEmptyState.tsx
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SacrementEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export default function SacrementEmptyState({
  searchQuery,
  onClearSearch,
}: SacrementEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
      <Calendar className="h-12 w-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Aucun sacrement trouvé
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">
        {searchQuery
          ? "Aucun sacrement ne correspond à votre recherche."
          : "Aucun sacrement individuel n'est enregistré pour le moment."}
      </p>
      {searchQuery && (
        <Button variant="outline" onClick={onClearSearch}>
          Effacer la recherche
        </Button>
      )}
    </div>
  );
}
