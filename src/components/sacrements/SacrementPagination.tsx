// // components/sacrements/SacrementPagination.tsx
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface SacrementPaginationProps {
//   currentPage: number;
//   totalPages: number;
//   itemsPerPage: number;
//   totalItems: number;
//   onPreviousPage: () => void;
//   onNextPage: () => void;
// }

// export default function SacrementPagination({
//   currentPage,
//   totalPages,
//   itemsPerPage,
//   totalItems,
//   onPreviousPage,
//   onNextPage,
// }: SacrementPaginationProps) {
//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="mt-6 flex items-center justify-between">
//       <div className="text-sm text-slate-500">
//         Affichage de {startItem} à {endItem} sur {totalItems} sacrements
//       </div>
//       <div className="flex gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onPreviousPage}
//           disabled={currentPage === 1}
//         >
//           <ChevronLeft className="h-4 w-4 mr-1" />
//           Précédent
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onNextPage}
//           disabled={currentPage === totalPages}
//         >
//           Suivant
//           <ChevronRight className="h-4 w-4 ml-1" />
//         </Button>
//       </div>
//     </div>
//   );
// }

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SacrementPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export default function SacrementPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPreviousPage,
  onNextPage,
}: SacrementPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Affichage de {startItem} à {endItem} sur {totalItems} sacrements
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
  );
}