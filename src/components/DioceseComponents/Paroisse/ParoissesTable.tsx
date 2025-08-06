/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Eye,
  Church,
  User,
  UserCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Paroisse,
  formatTimestamp,
  getFullName,
  formatLocalisation,
} from "@/services/ParoiseofDiocese";

interface ParoissesTableProps {
  paroisses: Paroisse[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onViewDetails: (id: number) => void;
  isLoading?: boolean;
}

export const ParoissesTable = ({
  paroisses,
  currentPage,
  itemsPerPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  onViewDetails,
  isLoading = false,
}: ParoissesTableProps) => {
  const formatDate = (
    dateString: string | number | null | undefined
  ): string => {
    return formatTimestamp(dateString);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return paroisses.slice(startIndex, endIndex);
  };

  // Fonction pour afficher les responsables avec gestion des cas où ils ne sont pas dans l'objet paroisse
  const renderResponsables = (paroisse: Paroisse) => {
    const responsables = [];

    // Note: Les détails des responsables (cure, administrateur) ne sont pas dans l'objet paroisse
    // de la route /obtenir-tous, seulement leurs IDs. Il faudrait une requête séparée pour les obtenir.

    if (paroisse.cure_id && paroisse.cure_id > 0) {
      responsables.push(
        <div key="cure" className="flex items-center text-sm">
          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
            <User className="h-3 w-3 text-green-600" />
          </div>
          <div>
            <span className="font-medium text-slate-900">
              {paroisse.cure
                ? getFullName(paroisse.cure)
                : `Curé (ID: ${paroisse.cure_id})`}
            </span>
            <div className="text-xs text-slate-500">Curé</div>
          </div>
        </div>
      );
    }

    // if (paroisse.administrateur_id && paroisse.administrateur_id > 0) {
    //   responsables.push(
    //     <div key="admin" className="flex items-center text-sm">
    //       <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
    //         <UserCheck className="h-3 w-3 text-purple-600" />
    //       </div>
    //       <div>
    //         <span className="font-medium text-slate-900">
    //           {paroisse.administrateur
    //             ? getFullName(paroisse.administrateur)
    //             : `Admin (ID: ${paroisse.administrateur_id})`}
    //         </span>
    //         <div className="text-xs text-slate-500">Administrateur</div>
    //       </div>
    //     </div>
    //   );
    // }

    // // Affichage des vicaires s'il y en a
    // if (paroisse.vicaires_id && paroisse.vicaires_id.length > 0) {
    //   responsables.push(
    //     <div key="vicaires" className="flex items-center text-sm">
    //       <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
    //         <User className="h-3 w-3 text-indigo-600" />
    //       </div>
    //       <div>
    //         <span className="font-medium text-slate-900">
    //           {paroisse.vicaires_id.length} vicaire
    //           {paroisse.vicaires_id.length > 1 ? "s" : ""}
    //         </span>
    //         <div className="text-xs text-slate-500">Vicaires</div>
    //       </div>
    //     </div>
    //   );
    // }

    if (responsables.length === 0) {
      return (
        <div className="text-sm text-slate-400">Aucun responsable assigné</div>
      );
    }

    return <div className="space-y-1">{responsables}</div>;
  };

  // Fonction pour formater la localisation avec tooltip
  const renderLocalisation = (paroisse: Paroisse) => {
    // Vérifier si la localisation existe et est une chaîne non vide
    const hasCoordinates =
      paroisse.localisation &&
      typeof paroisse.localisation === "string" &&
      paroisse.localisation !== "";

    return (
      <div className="text-slate-600">
        <div className="font-medium">{paroisse.ville || "N/A"}</div>
        {paroisse.quartier && (
          <div className="text-sm text-slate-500">{paroisse.quartier}</div>
        )}
        {hasCoordinates && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-slate-400 flex items-center mt-1 cursor-help hover:text-slate-600 transition-colors duration-150">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[100px]">
                    Coordonnées GPS
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-slate-900 text-white p-3 rounded-lg shadow-lg max-w-xs"
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm">Localisation GPS</div>
                  <div className="text-xs text-slate-300">
                    {formatLocalisation(paroisse.localisation)}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Cliquez pour copier les coordonnées
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  // Fonction pour copier les coordonnées dans le presse-papiers
  const handleCopyCoordinates = async (coordinates: string) => {
    try {
      await navigator.clipboard.writeText(coordinates);
      // Vous pouvez ajouter ici une notification de succès
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  // Fonction pour formater la localisation avec tooltip et copie
  const renderLocalisationWithCopy = (paroisse: Paroisse) => {
    // Vérifier si la localisation existe et est une chaîne non vide
    const hasCoordinates =
      paroisse.localisation &&
      typeof paroisse.localisation === "string" &&
      paroisse.localisation.trim() !== "";

    return (
      <div className="text-slate-600">
        <div className="font-medium">{paroisse.ville || "N/A"}</div>
        {paroisse.quartier && (
          <div className="text-sm text-slate-500">{paroisse.quartier}</div>
        )}
        {hasCoordinates && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="text-xs text-slate-400 flex items-center mt-1 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                  onClick={() =>
                    handleCopyCoordinates(
                      formatLocalisation(paroisse.localisation)
                    )
                  }
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[100px]">
                    Coordonnées GPS
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-slate-900 text-white p-3 rounded-lg shadow-lg max-w-xs"
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm">Localisation GPS</div>
                  <div className="text-xs text-slate-300 font-mono">
                    {formatLocalisation(paroisse.localisation)}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Cliquez pour copier les coordonnées
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Paroisses</h3>
            <div className="text-sm text-slate-500">Chargement...</div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Chargement des paroisses...</p>
        </div>
      </div>
    );
  }

  // État vide
  if (!paroisses || paroisses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Paroisses</h3>
            <div className="text-sm text-slate-500">0 résultat</div>
          </div>
        </div>
        <div className="p-8 text-center">
          <Church className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Aucune paroisse trouvée</p>
        </div>
      </div>
    );
  }

  const currentItems = getCurrentPageItems();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header du tableau moderne */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Paroisses</h3>
          <div className="text-sm text-slate-500">
            {paroisses.length} résultat
            {paroisses.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            {/* <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Date de création
            </TableHead> */}
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
          {currentItems.map((paroisse) => (
            <TableRow
              key={paroisse.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
            >
              {/* <TableCell className="py-4 px-6">
                <div className="text-slate-600 font-medium">
                  {formatDate(paroisse.created_at)}
                </div>
              </TableCell> */}

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    {paroisse.photo?.url ? (
                      <img
                        src={paroisse.photo.url}
                        alt={paroisse.nom}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <Church className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-base">
                      {paroisse.nom || "N/A"}
                    </div>
                    <div className="text-sm text-slate-500">
                      {paroisse.pays}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                {renderResponsables(paroisse)}
              </TableCell>

              <TableCell className="py-4 px-6">
                {renderLocalisationWithCopy(paroisse)}
              </TableCell>

              <TableCell className="py-4 px-6">
                <Badge
                  className={
                    paroisse.statut?.toLowerCase().includes("quasi")
                      ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                      : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  }
                >
                  {paroisse.statut}
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
          {Math.min(currentPage * itemsPerPage, paroisses.length)} sur{" "}
          {paroisses.length} résultats
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
