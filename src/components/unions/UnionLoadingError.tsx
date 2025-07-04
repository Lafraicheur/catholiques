// components/unions/UnionLoadingError.tsx
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UnionLoadingProps {
  loading: boolean;
}

export function UnionLoading({ loading }: UnionLoadingProps) {
  if (!loading) return null;

  return (
    <div className="space-y-4">
      {/* Skeleton pour les statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ))}
      </div>

      {/* Skeleton pour le tableau */}
      <div className="space-y-3">
        {/* En-tête du tableau */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-slate-50 rounded-lg">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>

        {/* Lignes du tableau */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-white border border-slate-100 rounded-lg"
          >
            {/* Photo de profil */}
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Nom du marié */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>

            {/* Nom de la mariée */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>

            {/* Date */}
            <Skeleton className="h-4 w-20" />

            {/* Statut */}
            <Skeleton className="h-6 w-16 rounded-full" />

            {/* Actions */}
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton pour la pagination */}
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Version plus simple et compacte
export function UnionLoadingCompact({ loading }: UnionLoadingProps) {
  if (!loading) return null;

  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg"
        >
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface UnionErrorProps {
  error: string | null;
  onRetry: () => void;
}

export function UnionError({ error, onRetry }: UnionErrorProps) {
  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <XCircle className="h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Une erreur est survenue
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
      <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
        Réessayer
      </Button>
    </div>
  );
}
