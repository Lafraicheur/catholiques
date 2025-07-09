// =============================================================================
// 7. COMPOSANT TABLEAU - components/DemandesTableau.tsx
// =============================================================================
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  FileDown,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DemandeMesse } from "../../types/demandeMesse";
import { formatDate, getIntentionLabel,formatTime } from "@/utils/emandeMesseUtils";

interface DemandesTableauProps {
  demandes: DemandeMesse[];
  exporting: boolean;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onExportIndividual: (demande: DemandeMesse, format: "excel" | "pdf") => void;
}

export const DemandesTableau: React.FC<DemandesTableauProps> = ({
  demandes,
  exporting,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onExportIndividual,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Demandes de messe
          </h3>
          <div className="text-sm text-slate-500">
            {demandes.length} demande{demandes.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Date de demande
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Intention
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Demandeur
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Concerne
            </TableHead>
             <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Messe
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Initiateur
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {demandes.map((demande) => (
            <TableRow
              key={demande.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
            >
              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full opacity-60" />
                  <span className="text-slate-600 font-medium">
                    {formatDate(demande?.created_at)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="text-sm text-slate-700 font-medium">
                  {getIntentionLabel(demande?.intention)}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="font-semibold text-slate-900 text-base">
                  {demande?.demandeur}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="font-medium text-slate-900">
                  {demande?.concerne}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                {demande.messe ? (
                  <div className="space-y-2">
                    {demande.messe.extras?.type_messe && (
                      <div className="font-medium text-slate-900 text-sm">
                        {demande.messe.extras.type_messe}
                      </div>
                    )}
                    <div className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      <Calendar className="h-4 w-3"/>
                      {formatTime(demande.messe.extras.heure_de_debut)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">
                    Aucune messe assignée
                  </div>
                )}
              </TableCell>

               <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      {demande?.initiateur?.prenoms} {demande?.initiateur?.nom}
                    </div>
                    {demande?.initiateur?.num_de_telephone && (
                      <div className="text-xs text-slate-500">
                        {demande?.initiateur?.num_de_telephone}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/dashboard/paroisse/demandemesse/${demande.id}`
                      )
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 cursor-pointer"
                        disabled={exporting}
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border-slate-200 shadow-lg rounded-xl"
                    >
                      <DropdownMenuItem
                        onClick={() => onExportIndividual(demande, "excel")}
                        className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-3 text-green-600" />
                        <span className="font-medium">Exporter en Excel</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onExportIndividual(demande, "pdf")}
                        className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3"
                      >
                        <FileDown className="h-4 w-4 mr-3 text-red-600" />
                        <span className="font-medium">Exporter en PDF</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {demandes.length === 0
            ? "Aucune demande trouvée"
            : `Affichage de ${demandes.length} demande${demandes.length > 1 ? "s" : ""}`}
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
};
