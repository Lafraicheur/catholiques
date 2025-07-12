/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafeValue } from "./SafeValue";

interface PageHeaderProps {
  paroisseName: string;
  ville: string;
  quartier: string;
  statut: string;
  onBack: () => void;
}

export const PageHeader = ({ 
  paroisseName, 
  ville, 
  quartier, 
  statut, 
  onBack 
}: PageHeaderProps) => {
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
            <SafeValue>{paroisseName}</SafeValue> ({ville} {quartier})
          </h1>
          <p className="text-slate-500">
            Détails de la{" "}
            <Badge
              className={
                statut?.toLowerCase().includes("quasi")
                  ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
                  : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
              }
            >
              {statut}
            </Badge>
          </p>
        </div>
      </div>
    </div>
  );
};