// components/sacrements/SacrementLoadingError.tsx
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SacrementLoadingProps {
  loading: boolean;
}

export function SacrementLoading({ loading }: SacrementLoadingProps) {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
    </div>
  );
}

interface SacrementErrorProps {
  error: string | null;
  onRetry: () => void;
}

export function SacrementError({ error, onRetry }: SacrementErrorProps) {
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
