/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Building2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SafeValue } from "./SafeValue";
import { formatDate } from "./formatUtils";

interface DoyennesTabProps {
  doyennes: any[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onViewDetails: (id: number) => void;
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
          <X className="h-4 w-4 mr-2" />
          Effacer la recherche
        </Button>
      </>
    ) : (
      <>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucun {type.toLowerCase()} trouvé
        </h3>
        <p className="text-sm text-slate-500">
          Ce vicariat/secteur ne contient encore aucun {type.toLowerCase()}.
        </p>
      </>
    )}
  </div>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPreviousPage,
  onNextPage,
  type,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  type: string;
}) => {
  if (totalItems <= itemsPerPage) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200 bg-slate-50/50">
      <div className="text-sm text-slate-500">
        Affichage de {startItem} à {endItem} sur {totalItems} {type}(s)
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="h-8 px-3 cursor-pointer"
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="h-8 px-3 cursor-pointer"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export const DoyennesTab = ({
  doyennes,
  currentPage,
  totalPages,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
  onViewDetails,
  searchQuery,
  onClearSearch,
}: DoyennesTabProps) => {
  if (doyennes.length === 0) {
    return (
      <EmptyTabContent
        type="Doyenné"
        icon={Building2}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
      />
    );
  }

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return doyennes.slice(startIndex, endIndex);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 py-3 px-4">
              Nom du Doyenné
            </TableHead>
            {/* <TableHead className="font-semibold text-slate-700 py-3 px-4">
              Date de création
            </TableHead> */}
            <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentPageItems().map((doyenne) => (
            <TableRow
              key={doyenne.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-slate-900">
                    <SafeValue>{doyenne.nom}</SafeValue>
                  </span>
                </div>
              </TableCell>
              {/* <TableCell className="py-3 px-4 text-slate-600">
                {formatDate(doyenne.created_at)}
              </TableCell> */}
              <TableCell className="py-3 px-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => onViewDetails(doyenne.id)}
                  title="Voir les détails du doyenné"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={doyennes.length}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        type="doyenné"
      />
    </div>
  );
};