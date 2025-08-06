/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Eye,
  Building2,
  Church,
  Crown,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
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
import { VicariatSecteur } from "@/services/VicariatSecteur";

interface VicariatsTableProps {
  vicariats: VicariatSecteur[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onViewDetails: (id: number) => void;
}

export const VicariatsTable = ({
  vicariats,
  currentPage,
  itemsPerPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  onViewDetails,
}: VicariatsTableProps) => {
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Non renseignée";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return dateString;
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return vicariats.slice(startIndex, endIndex);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header du tableau moderne */}
      <div className="px-6 py-4 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            Vicariats et Secteurs
          </h3>
          <div className="text-sm text-muted-foreground">
            {vicariats.length} résultat
            {vicariats.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {/* <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-left">
              Date de création
            </TableHead> */}
            <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-left">
              Nom du Vicariat/Secteur
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-left">
              Siège
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-left">
              Vicaire Episcopal
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-left">
              Localisation
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getCurrentPageItems().map((vicariat) => (
            <TableRow
              key={vicariat.id}
              className="border-border hover:bg-muted/50 transition-colors duration-150"
            >
              {/* <TableCell className="py-4 px-6">
                <div className="text-muted-foreground font-medium">
                  {formatDate(vicariat?.created_at)}
                </div>
              </TableCell> */}

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground text-base">
                      {vicariat?.nom}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-3">
                    <Church className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">
                      {vicariat?.siege?.nom}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {vicariat?.siege?.ville}, {vicariat?.siege?.quartier}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {vicariat?.vicaire_episcopal?.nom}
                      {vicariat?.vicaire_episcopal?.prenoms}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600 text-sm">
                    {vicariat?.siege?.localisation || "Non spécifiée"}
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
                      if (typeof vicariat.id === "number") {
                        onViewDetails(vicariat.id);
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
          {Math.min(currentPage * itemsPerPage, vicariats.length)} sur{" "}
          {vicariats.length} résultats
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
