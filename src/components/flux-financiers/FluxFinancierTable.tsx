/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/flux-financiers/FluxFinancierTable.tsx
import { Eye, User, Calendar, TrendingUp, TrendingDown } from "lucide-react";
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
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export default function FluxFinancierTable({
  fluxFinanciers,
  totalCount,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
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
    if (isNaN(montant) || montant === null || montant === undefined) {
      return "0 F CFA";
    }
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XOF",
      useGrouping: true,
      minimumFractionDigits: 0,
    }).format(montant);
    const withoutCurrency = formatted
      .replace(/XOF\s?/, "")
      .replace(/F\s?CFA\s?/, "")
      .replace(/CFA\s?/, "")
      .trim();
    return `${withoutCurrency} F CFA`;
  };

  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "SUCCÈS":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
      case "EN ATTENTE":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
      case "ECHEC":
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200";
    }
  };

  const getTypeIcon = (type: string) => {
    if (
      type.toLowerCase().includes("crédit") ||
      type.toLowerCase().includes("entrée")
    ) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (
      type.toLowerCase().includes("débit") ||
      type.toLowerCase().includes("sortie")
    ) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <TrendingUp className="h-4 w-4 text-blue-600" />;
  };

  const handleViewDetails = (flux: FluxFinancier) => {
    toast.info("Détails du flux", {
      description: `Référence: ${flux.reference}`,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Flux financiers
          </h3>
          <div className="text-sm text-slate-500">
            {totalCount} flux financier{totalCount > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Date
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Référence
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Initiateur
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Type
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-center">
              Montant
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-center">
              Statut
            </TableHead>
            {/* <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
              Actions
            </TableHead> */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {fluxFinanciers.map((flux) => (
            <TableRow
              key={flux.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
            >
              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full opacity-60" />
                  <span className="text-slate-600 font-medium">
                    {formatDate(flux?.created_at)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="font-medium text-slate-900 text-sm">
                  {flux?.reference}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      {flux?.initiateur?.nom} {flux?.initiateur?.prenoms}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2">
                  {getTypeIcon(flux.type)}
                  <span className="text-sm text-slate-700 font-medium">
                    {flux.type}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6 text-center">
                <div className="font-semibold text-slate-900 text-base">
                  {formatMontant(flux?.montant_avec_frais)}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6 text-center">
                <Badge
                  className={`text-xs py-1 px-3 font-medium ${getStatusBadgeVariant(flux?.statut)}`}
                >
                  {flux?.statut}
                </Badge>
              </TableCell>

              {/* <TableCell className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleViewDetails(flux)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {totalCount === 0
            ? "Aucun flux financier trouvé"
            : `Affichage de ${fluxFinanciers.length} flux financier${fluxFinanciers.length > 1 ? "s" : ""}`}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
