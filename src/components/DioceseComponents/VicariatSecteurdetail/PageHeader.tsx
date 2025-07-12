import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeValue } from "./SafeValue";

interface PageHeaderProps {
  vicariatName: string;
  onBack: () => void;
}

export const PageHeader = ({ vicariatName, onBack }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-10 w-20 p-0 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            <SafeValue>{vicariatName}</SafeValue>
          </h1>
          <p className="text-slate-500">
            Détails du vicariat / secteur
          </p>
        </div>
      </div>
    </div>
  );
};