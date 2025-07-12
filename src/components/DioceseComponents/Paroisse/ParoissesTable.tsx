import { Eye, Church, User, UserCheck, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Paroisse, formatTimestamp, getFullName, formatLocalisation } from "@/services/ParoiseofDiocese";

interface ParoissesTableProps {
  paroisses: Paroisse[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onViewDetails: (id: number) => void;
}

export const ParoissesTable = ({
  paroisses,
  currentPage,
  itemsPerPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  onViewDetails,
}: ParoissesTableProps) => {
  const formatDate = (dateString: string | number | null | undefined): string => {
    return formatTimestamp(dateString);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return paroisses.slice(startIndex, endIndex);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Paroisses
          </h3>
          <div className="text-sm text-slate-500">
            {paroisses.length} résultat
            {paroisses.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Date de création
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Nom de la Paroisse
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Responsables
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Localisation
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Statut
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getCurrentPageItems().map((paroisse) => (
            <TableRow
              key={paroisse.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
            >
              <TableCell className="py-4 px-6">
                <div className="text-slate-600 font-medium">
                  {formatDate(paroisse?.created_at)}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Church className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-base">
                      {paroisse?.nom || "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="space-y-1">
                  {paroisse?.cure && (
                    <div className="flex items-center text-sm">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-900">
                          {getFullName(paroisse.cure)}
                        </span>
                        <div className="text-xs text-slate-500">Curé</div>
                      </div>
                    </div>
                  )}
                  {paroisse?.administrateur && (
                    <div className="flex items-center text-sm">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <UserCheck className="h-3 w-3 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-900">
                          {getFullName(paroisse.administrateur)}
                        </span>
                        <div className="text-xs text-slate-500">
                          Administrateur
                        </div>
                      </div>
                    </div>
                  )}
                  {!paroisse?.cure && !paroisse?.administrateur && (
                    <div className="text-sm text-slate-400">
                      Aucun responsable assigné
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="text-slate-600">
                  <div className="font-medium">{paroisse?.ville}</div>
                  {paroisse?.quartier && (
                    <div className="text-sm text-slate-500">
                      {paroisse?.quartier}
                    </div>
                  )}
                  {paroisse?.localisation && (
                    <div className="text-xs text-slate-400 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {formatLocalisation(paroisse?.localisation)}
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <Badge
                  className={
                    paroisse?.statut?.toLowerCase().includes("quasi")
                      ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                      : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  }
                >
                  {paroisse?.statut}
                </Badge>
              </TableCell>

              <TableCell className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                    onClick={() => onViewDetails(paroisse.id)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
          {Math.min(currentPage * itemsPerPage, paroisses.length)}{" "}
          sur {paroisses.length} résultats
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="h-9 px-4 bg-white border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="h-9 px-4 bg-white border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};