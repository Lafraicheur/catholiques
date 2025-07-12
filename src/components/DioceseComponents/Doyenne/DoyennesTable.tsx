import { 
  Eye, 
  Building2, 
  Church, 
  User, 
  MapPin, 
  Phone, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doyenne } from "@/services/Doyennes";

interface DoyennesTableProps {
  doyennes: Doyenne[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onViewDetails: (id: number) => void;
}

export const DoyennesTable = ({
  doyennes,
  currentPage,
  itemsPerPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  onViewDetails,
}: DoyennesTableProps) => {
  const formatDate = (dateString: string | number | null | undefined): string => {
    if (!dateString) return "Non renseignée";
    try {
      const dateToFormat = typeof dateString === "number" 
        ? new Date(dateString).toISOString() 
        : dateString;
      const date = new Date(dateToFormat);
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return String(dateString);
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return doyennes.slice(startIndex, endIndex);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Doyennés</h3>
          <div className="text-sm text-slate-500">
            {doyennes.length} résultat
            {doyennes.length > 1 ? "s" : ""}
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
              Nom du Doyenné
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Siège
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Doyen
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Localisation
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getCurrentPageItems().map((doyenne) => (
            <TableRow
              key={doyenne.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
            >
              <TableCell className="py-4 px-6">
                <div className="text-slate-600 font-medium">
                  {formatDate(doyenne?.created_at)}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-base">
                      {doyenne?.nom}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Church className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {doyenne?.siege?.nom}
                    </div>
                    <div className="text-sm text-slate-500">
                      {doyenne?.siege?.ville}, {doyenne?.siege?.quartier}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {doyenne?.doyen?.nom} {doyenne?.doyen?.prenoms}
                    </div>
                    {doyenne?.doyen?.num_de_telephone && (
                      <div className="text-sm text-slate-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {doyenne?.doyen?.num_de_telephone}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600 text-sm">
                    {doyenne?.siege?.localisation || "Non spécifiée"}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                    onClick={() => {
                      if (typeof doyenne.id === "number") {
                        onViewDetails(doyenne.id);
                      }
                    }}
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
          {Math.min(currentPage * itemsPerPage, doyennes.length)}{" "}
          sur {doyennes.length} résultats
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