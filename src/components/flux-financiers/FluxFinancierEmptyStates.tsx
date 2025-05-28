// components/flux-financiers/FluxFinancierEmptyStates.tsx
import { XCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export function LoadingState({}: LoadingStateProps) {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
      <XCircle className="h-12 w-12 text-slate-300 mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Impossible de charger les données
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
      <Button variant="outline" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  );
}

export function EmptyState({ hasFilters, onResetFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
      <DollarSign className="h-12 w-12 text-slate-300 mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Aucun flux financier trouvé
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">
        {hasFilters
          ? "Aucun flux financier ne correspond à vos critères de recherche."
          : "Aucun flux financier n'est enregistré."}
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={onResetFilters}>
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}