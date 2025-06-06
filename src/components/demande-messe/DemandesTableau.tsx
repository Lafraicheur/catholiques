// =============================================================================
// 7. COMPOSANT TABLEAU - components/DemandesTableau.tsx
// =============================================================================

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, FileDown, FileSpreadsheet, CheckCircle, Clock, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DemandeMesse } from "../../types/demandeMesse";
import { formatDate, getIntentionLabel } from "@/utils/emandeMesseUtils";

interface DemandesTableauProps {
  demandes: DemandeMesse[];
  exporting: boolean;
  onExportIndividual: (demande: DemandeMesse, format: "excel" | "pdf") => void;
}

export const DemandesTableau: React.FC<DemandesTableauProps> = ({
  demandes,
  exporting,
  onExportIndividual,
}) => {
  const router = useRouter();

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
      <Table className="w-full">
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-100 border-slate-200">
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Date de demande
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Initiateur
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Demandeur
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Intention
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Concerne
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Statut
            </TableHead>
            <TableHead className="font-semibold text-slate-600 py-3 px-4">
              Messe
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandes.map((demande) => (
            <TableRow
              key={demande.id}
              className="hover:bg-slate-50 border-slate-100"
            >
              <TableCell className="text-slate-500 py-3 px-4">
                <div className="flex items-center">
                  {formatDate(demande?.created_at)}
                </div>
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="font-medium text-slate-900">
                  {demande?.initiateur?.prenoms} {demande?.initiateur?.nom}
                </div>
                <div className="text-xs text-slate-500">
                  {demande?.initiateur?.num_de_telephone}
                </div>
              </TableCell>
              <TableCell className="py-3 px-4 font-medium text-slate-900">
                {demande?.demandeur}
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="text-sm text-slate-700">
                  {getIntentionLabel(demande?.intention)}
                </div>
              </TableCell>
              <TableCell className="py-3 px-4 font-medium text-slate-900">
                {demande?.concerne}
              </TableCell>
              <TableCell>
                {demande?.est_payee ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-200 text-xs py-0.5 px-1.5"
                  >
                    <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                    Payée
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs py-0.5 px-1.5"
                  >
                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                    Non Payée
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="space-y-1">
                  <div className="font-medium text-slate-700">
                    {demande.messe?.libelle}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {demande.messe?.extras?.type_messe}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right py-2 px-4">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/paroisse/demandemesse/${demande.id}`)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer text-green-600 hover:bg-green-50"
                        disabled={exporting}
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onExportIndividual(demande, "excel")}
                        className="cursor-pointer"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                        Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onExportIndividual(demande, "pdf")}
                        className="cursor-pointer"
                      >
                        <FileDown className="h-4 w-4 mr-2 text-red-600" />
                        PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};