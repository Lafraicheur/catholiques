// components/sacrement-details/ActionButtons.tsx
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface ActionButtonsProps {
  canPerformActions: boolean;
  onValidate: () => void;
  onReject: () => void;
}

export function ActionButtons({ 
  canPerformActions, 
  onValidate, 
  onReject 
}: ActionButtonsProps) {
  if (!canPerformActions) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        className="bg-green-600 hover:bg-green-700"
        onClick={onValidate}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Valider
      </Button>
      <Button
        variant="destructive"
        onClick={onReject}
      >
        <XCircle className="h-4 w-4 mr-2" />
        Rejeter
      </Button>
    </div>
  );
}