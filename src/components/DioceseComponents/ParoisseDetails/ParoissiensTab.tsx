/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Users, Phone, Eye, CheckCircle, X as XIcon } from "lucide-react";
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
import { PaginationControls } from "./PaginationControls";
import { formatGenre } from "@/services/ParoiseofDiocese";

interface ParoissiensTabProps {
  paroissiens: any[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  // onViewDetails: (id: number) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

const EmptyTabContent = ({
  type,
  icon: Icon,
  searchQuery,
  onClearSearch,
}: {
  type: string;
  icon: React.ComponentType<any>;
  searchQuery: string;
  onClearSearch: () => void;
}) => (
  <div className="py-12 text-center">
    <Icon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
    {searchQuery ? (
      <>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucun résultat trouvé
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Aucun {type.toLowerCase()} ne correspond à votre recherche "
          {searchQuery}".
        </p>
        <Button variant="outline" onClick={onClearSearch} className="mx-auto">
          <XIcon className="h-4 w-4 mr-2" />
          Effacer la recherche
        </Button>
      </>
    ) : (
      <>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucun {type.toLowerCase()} trouvé
        </h3>
        <p className="text-sm text-slate-500">
          Cette paroisse ne contient encore aucun {type.toLowerCase()}.
        </p>
      </>
    )}
  </div>
);

export const ParoissiensTab = ({
  paroissiens,
  currentPage,
  totalPages,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
  // onViewDetails,
  searchQuery,
  onClearSearch,
}: ParoissiensTabProps) => {
  if (paroissiens.length === 0) {
    return (
      <EmptyTabContent
        type="Paroissien"
        icon={Users}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
      />
    );
  }

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return paroissiens.slice(startIndex, endIndex);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 py-3 px-4">
              Paroissien
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-3 px-4">
              Contact
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-3 px-4">
              Genre
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-3 px-4">
              Statut
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-3 px-4">
              Abonnement
            </TableHead>
            {/* <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
              Actions
            </TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentPageItems().map((paroissien) => (
            <TableRow
              key={paroissien.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                    {paroissien.photo?.url ? (
                      <img
                        src={paroissien.photo.url}
                        alt={`${paroissien.prenoms} ${paroissien.nom}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {paroissien.prenoms?.[0]?.toUpperCase()}
                        {paroissien.nom?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">
                      {paroissien.prenoms} {paroissien.nom}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-3 px-4">
                <div className="flex items-center text-slate-600">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{paroissien.num_de_telephone || "Non renseigné"}</span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-4">
                <Badge
                  className={
                    paroissien.genre === "M"
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                  }
                >
                  {formatGenre(paroissien.genre)}
                </Badge>
              </TableCell>

              <TableCell className="py-3 px-4">
                <Badge
                  className={
                    paroissien.statut?.toLowerCase().includes("baptis")
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      : paroissien.statut === "Aucun"
                        ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  }
                >
                  {paroissien.statut || "Non défini"}
                </Badge>
              </TableCell>

              <TableCell className="py-3 px-4">
                <div className="flex items-center">
                  {paroissien.est_abonne ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <div>
                        <span className="font-medium">Abonné</span>
                        {paroissien.date_de_fin_abonnement && (
                          <div className="text-xs text-slate-500">
                            Jusqu'au{" "}
                            {new Date(
                              paroissien.date_de_fin_abonnement
                            ).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-slate-500">
                      <XIcon className="h-4 w-4 mr-2" />
                      <span>Non abonné</span>
                    </div>
                  )}
                </div>
              </TableCell>

              {/* <TableCell className="py-3 px-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => onViewDetails(paroissien.id)}
                  title="Voir les détails du paroissien"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={paroissiens.length}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        type="paroissien"
      />
    </div>
  );
};
