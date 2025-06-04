// components/unions/UnionLoadingError.tsx
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnionLoadingProps {
  loading: boolean;
}

export function UnionLoading({ loading }: UnionLoadingProps) {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      <span className="ml-3 text-slate-500">Chargement des sacrements...</span>
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
      <Button onClick={onRetry}>Réessayer</Button>
    </div>
  );
}
