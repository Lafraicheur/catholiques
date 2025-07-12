/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { XCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Composant de chargement
export const LoadingState = () => {
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

// Composant d'erreur
interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="text-center py-12">
      <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Impossible de charger les données
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
        {error}
      </p>
      <Button variant="outline" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  );
};

// Composant pour état vide
interface EmptyStateProps {
  searchQuery: string;
  onResetSearch: () => void;
}

export const EmptyState = ({ searchQuery, onResetSearch }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Aucun vicariat ou secteur trouvé
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
        {searchQuery
          ? "Aucun vicariat ou secteur ne correspond à vos critères de recherche."
          : "Aucun vicariat ou secteur n'est enregistré pour ce diocèse."}
      </p>
      {searchQuery && (
        <Button onClick={onResetSearch} className="cursor-pointer">
          Réinitialiser la recherche
        </Button>
      )}
    </div>
  );
};