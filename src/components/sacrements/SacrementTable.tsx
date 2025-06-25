/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/sacrements/SacrementTable.tsx
// import { Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { SacrementIndividuel } from "@/types/sacrement";
// import {
//   getSacrementSoustypeDetails,
//   getStatusDetails,
//   extractStatut,
//   formatDate,
// } from "@/lib/sacrement-utils";
// import { useState, useMemo } from "react";

// interface SacrementTableProps {
//   sacrements: SacrementIndividuel[];
//   onDelete: (id: number) => void;
//   itemsPerPage?: number; // Nouvelle prop pour définir le nombre d'éléments par page
// }

// export default function SacrementTable({
//   sacrements,
//   onDelete,
//   itemsPerPage = 10, // Valeur par défaut de 10 éléments par page
// }: SacrementTableProps) {
//   const [currentPage, setCurrentPage] = useState(1);

//   // Calculs de pagination
//   const totalPages = Math.ceil(sacrements.length / itemsPerPage);

//   const paginatedSacrements = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return sacrements.slice(startIndex, endIndex);
//   }, [sacrements, currentPage, itemsPerPage]);

//   // Fonctions de navigation
//   const goToPreviousPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const goToNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   // Reset de la page courante si elle dépasse le nombre total de pages
//   // (utile si les données changent)
//   useMemo(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//     }
//   }, [currentPage, totalPages]);

//   // Gestion du cas où il n'y a pas de sacrements
//   if (!sacrements.length) {
//     return (
//       <div className="text-center py-8 text-slate-500">
//         Aucun sacrement trouvé
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
//       <Table className="w-full">
//         <TableHeader className="bg-slate-50">
//           <TableRow className="hover:bg-slate-100 border-slate-200">
//             <TableHead className="font-semibold text-slate-600 py-3 px-4">
//               Date
//             </TableHead>
//             <TableHead className="font-semibold text-slate-600 py-3 px-4">
//               Type
//             </TableHead>
//             <TableHead className="font-semibold text-slate-600 py-3 px-4">
//               Description
//             </TableHead>
//             <TableHead className="font-semibold text-slate-600 py-3 px-4 text-right">
//               Détails
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {paginatedSacrements.map((sacrement) => {
//             const { label: typeLabel } = getSacrementSoustypeDetails(
//               sacrement.soustype
//             );
//             return (
//               <TableRow
//                 key={sacrement.id}
//                 className="hover:bg-slate-50/80 border-slate-200"
//               >
//                 <TableCell>
//                   <div className="flex items-center">
//                     <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
//                     {formatDate(sacrement.date)}
//                   </div>
//                 </TableCell>
//                 <TableCell className="py-3 px-4 font-medium text-slate-900">
//                   {typeLabel}
//                 </TableCell>
//                 <TableCell>
//                   <div className="text-sm text-slate-700 max-w-xs truncate">
//                     {sacrement.description}
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-right py-2 px-4">
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
//                     >
//                       <a
//                         href={`/dashboard/paroisse/sacrements/individuelle/${sacrement.id}`}
//                       >
//                         <Eye className="h-4 w-4" />
//                       </a>
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       {sacrements.length > 0 && totalPages > 1 && (
//         <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
//           <p className="text-sm text-slate-500">
//             Page {currentPage} sur {totalPages}
//           </p>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={goToPreviousPage}
//               disabled={currentPage === 1}
//               className="cursor-pointer"
//             >
//               <ChevronLeft className="h-4 w-4 mr-1" />
//               Précédent
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={goToNextPage}
//               disabled={currentPage === totalPages}
//               className="cursor-pointer"
//             >
//               Suivant
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { SacrementIndividuel } from "@/types/sacrement";
import { getSacrementSoustypeDetails, formatDate } from "@/lib/sacrement-utils";
import { useState, useMemo } from "react";

interface SacrementTableProps {
  sacrements: SacrementIndividuel[];
  onDelete: (id: number) => void;
  itemsPerPage?: number;
}

export default function SacrementTable({
  sacrements,
  onDelete,
  itemsPerPage = 10,
}: SacrementTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sacrements.length / itemsPerPage);

  const paginatedSacrements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sacrements.slice(startIndex, endIndex);
  }, [sacrements, currentPage, itemsPerPage]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Badge coloré selon le type de sacrement
  const getSacrementBadge = (soustype: string) => {
    const { label } = getSacrementSoustypeDetails(soustype);
    const badgeMap: Record<string, { className: string; emoji: string }> = {
      Baptême: {
        className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        emoji: "🕊️",
      },
      "Première Communion": {
        className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        emoji: "🍞",
      },
      "Profession de Foi": {
        className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
        emoji: "📿",
      },
      "Sacrement de Malade": {
        className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        emoji: "🙏",
      },
    };

    const badgeInfo = badgeMap[label] || {
      className: "bg-slate-50 text-slate-700 border-slate-200",
      emoji: "⛪",
    };

    return (
      <Badge
        className={`px-3 py-1 font-medium text-sm rounded-full border ${badgeInfo.className}`}
      >
        <span className="mr-1">{badgeInfo.emoji}</span>
        {label}
      </Badge>
    );
  };

  if (!sacrements.length) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucun sacrement trouvé
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200">
      {/* Header du tableau */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Sacrements Individuels
          </h3>
          <div className="text-sm text-slate-500">
            {sacrements.length} résultat{sacrements.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Type
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Célébrant
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Date
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Description
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
              Détails
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedSacrements.map((sacrement) => (
            <TableRow
              key={sacrement.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
            >
              <TableCell className="py-4 px-6">
                {getSacrementBadge(sacrement.soustype)}
              </TableCell>

              <TableCell className="py-4 px-6">
                {sacrement.celebrant ? (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-blue-600">
                        {sacrement.celebrant.prenoms.charAt(0)}
                        {sacrement.celebrant.nom.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {sacrement.celebrant.prenoms} {sacrement.celebrant.nom}
                      </div>
                      <div className="text-xs text-slate-500">Célébrant</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Non renseigné</span>
                )}
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full opacity-60" />
                  <span className="text-slate-600 font-medium">
                    {formatDate(sacrement.date)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="text-sm text-slate-700 max-w-xs truncate">
                  {sacrement.description}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  <a
                    href={`/dashboard/paroisse/sacrements/individuelle/${sacrement.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer avec pagination */}
      {sacrements.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
            {Math.min(currentPage * itemsPerPage, sacrements.length)} sur{" "}
            {sacrements.length} résultats
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="h-9 px-4 bg-white border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-9 px-4 bg-white border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
