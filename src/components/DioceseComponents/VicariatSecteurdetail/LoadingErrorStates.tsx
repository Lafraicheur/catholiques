import { ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Composant de chargement
export const LoadingState = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

// Composant d'erreur
interface ErrorStateProps {
  error: string;
  onBack: () => void;
  onRetry: () => void;
}

export const ErrorState = ({ error, onBack, onRetry }: ErrorStateProps) => {
  return (
    <div className="text-center py-12">
      <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Impossible de charger les données
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button onClick={onRetry}>Réessayer</Button>
      </div>
    </div>
  );
};