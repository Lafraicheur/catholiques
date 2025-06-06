// =============================================================================
// 9. COMPOSANT ÉTATS VIDES - components/EmptyStates.tsx
// =============================================================================
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
import React from "react";
import { XCircle, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";


export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-10" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="text-center py-12">
      <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Impossible de charger les données
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Réessayer
      </Button>
    </div>
  );
};

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div className="text-center py-12">
      <Hand className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Aucune demande de messe trouvée
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
        {hasActiveFilters
          ? "Aucune demande ne correspond à vos critères de recherche."
          : "Aucune demande n'est enregistrée pour cette paroisse."}
      </p>
      {hasActiveFilters ? (
        <Button variant="outline" onClick={onResetFilters}>
          Réinitialiser les filtres
        </Button>
      ) : null}
    </div>
  );
};