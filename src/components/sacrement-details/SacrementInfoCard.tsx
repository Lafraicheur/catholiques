/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/sacrement-details/SacrementInfoCard.tsx
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlignJustify, AlertTriangle } from "lucide-react";

interface SacrementInfoCardProps {
  sacrement: {
    type: string;
    statut: string;
    date: string;
    description: string;
    motif_de_rejet?: string;
    created_at: string;
  };
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return "Date inconnue";
  }
};

const getStatusDetails = (statut: string) => {
  const normalizedStatus = statut.toUpperCase();
  switch (normalizedStatus) {
    case "CONFIRMÉ":
    case "CONFIRME":
    case "VALIDÉ":
    case "VALIDE":
      return { label: "Validé", variant: "success" as const };
    case "EN ATTENTE":
    case "ATTENTE":
      // "warning" is not a valid variant, use "secondary" or another supported variant
      return { label: "En attente", variant: "secondary" as const };
    case "REJETÉ":
    case "REJETE":
      return { label: "Rejeté", variant: "destructive" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

export function SacrementInfoCard({ sacrement }: SacrementInfoCardProps) {
  const { label: statusLabel, variant: statusVariant } = getStatusDetails(sacrement.statut);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {sacrement.type}
            </Badge>
            <Badge variant={statusVariant} className="text-sm">
              {statusLabel}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-slate-700">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-medium">Date prévue:</span>
              <span className="ml-2">{formatDate(sacrement.date)}</span>
            </div>

            <div className="flex items-start text-slate-700">
              <AlignJustify className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
              <div>
                <span className="font-medium">Description:</span>
                <p className="mt-1">
                  {sacrement.description || "Aucune description fournie"}
                </p>
              </div>
            </div>

            {sacrement.motif_de_rejet && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  <div>
                    <h4 className="font-medium text-red-700">Motif de rejet:</h4>
                    <p className="mt-1 text-red-600">{sacrement.motif_de_rejet}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}