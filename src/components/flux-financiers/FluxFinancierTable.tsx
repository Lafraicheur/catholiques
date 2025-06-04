/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/flux-financiers/FluxFinancierTable.tsx
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FluxFinancier {
  id: number;
  created_at: number;
  reference: string;
  type: string;
  montant: number;
  frais: number;
  montant_avec_frais: number;
  description: string;
  motif: string;
  statut: string;
  solde_avant_beneficiaire: number;
  solde_apres_beneficiaire: number;
  initiateur_id: number;
  extras: Record<string, any>;
  initiateur: {
    id: number;
    nom: string;
    prenoms: string;
  };
}

interface FluxFinancierTableProps {
  fluxFinanciers: FluxFinancier[];
  totalCount: number;
}

export default function FluxFinancierTable({
  fluxFinanciers,
  totalCount,
}: FluxFinancierTableProps) {
  const formatDate = (timestamp: number): string => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (err) {
      return "Date inconnue";
    }
  };

  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(montant);
  };

  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "SUCCÈS":
        return "bg-green-50 text-green-700 border border-green-100 hover:bg-green-50";
      case "EN ATTENTE":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100 hover:bg-yellow-50";
      case "ECHEC":
        return "bg-red-50 text-red-700 border border-red-100 hover:bg-red-50";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-50";
    }
  };

  const handleViewDetails = (flux: FluxFinancier) => {
    toast.info("Détails du flux", {
      description: `Référence: ${flux.reference}`,
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
      <Table className="w-full">
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-100 border-slate-200">
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Date
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Référence
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Initiateur
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Type
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Montant
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Statut
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fluxFinanciers.map((flux, index) => (
            <TableRow
              key={flux.id}
              className={`hover:bg-slate-50/80 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
              } border-slate-200`}
            >
              <TableCell className="text-slate-500 py-3 px-4">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full mr-2"></div>
                  {formatDate(flux.created_at)}
                </div>
              </TableCell>
              <TableCell className="py-3 px-4 font-medium text-slate-900">
                {flux.reference}
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="flex items-center">
                  <span className="font-medium">
                    {flux.initiateur.nom} {flux.initiateur.prenoms}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {flux.type}
                </Badge>
              </TableCell>
              <TableCell className="py-3 px-4 font-medium text-slate-900">
                {formatMontant(flux.montant_avec_frais)}
              </TableCell>
              <TableCell className="py-3 px-4">
                <Badge
                  className={`px-2 py-1 font-normal text-xs ${getStatusBadgeVariant(flux.statut)}`}
                >
                  {flux.statut}
                </Badge>
              </TableCell>
              <TableCell className="text-right py-2 px-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleViewDetails(flux)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
        Affichage de {fluxFinanciers.length} flux financier(s) sur {totalCount}{" "}
        au total
      </div>
    </div>
  );
}
