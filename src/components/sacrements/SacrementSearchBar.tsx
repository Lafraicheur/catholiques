// // components/sacrements/SacrementSearchBar.tsx
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Search, Download } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import NewSacrementIndividuelForm from "@/components/forms/NewSacrementIndividuelForm";

// interface SacrementSearchBarProps {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   totalSacrements: number;
//   onExportCSV: () => void;
//   onSuccess: () => void;
// }

// export default function SacrementSearchBar({
//   searchQuery,
//   setSearchQuery,
//   totalSacrements,
//   onExportCSV,
//   onSuccess,
// }: SacrementSearchBarProps) {
//   return (
//     <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
//       <h2 className="text-lg font-semibold">
//         Sacrements Individuels ({totalSacrements})
//       </h2>
//       <div className="flex flex-wrap">
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
//           <Input
//             placeholder="Rechercher..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         {/* <Button
//           variant="outline"
//           size="icon"
//           onClick={onExportCSV}
//           title="Exporter en CSV"
//         >
//           <Download className="h-4 w-4" />
//         </Button> */}
//       </div>
//       <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
//         <NewSacrementIndividuelForm onSuccess={onSuccess} />
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */

import { Search, Download, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewSacrementIndividuelForm from "@/components/forms/NewSacrementIndividuelForm";

interface SacrementSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalSacrements: number;
  onExportCSV: () => void;
  onSuccess: () => void;
}

export default function SacrementSearchBar({
  searchQuery,
  setSearchQuery,
  totalSacrements,
  onExportCSV,
  onSuccess,
}: SacrementSearchBarProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Section recherche */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            placeholder="Rechercher un sacrement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 rounded-xl transition-all duration-200"
          />
        </div>

        {/* Section actions */}
        <div className="flex gap-3">
          {/* Filtre par date */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 px-4 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtre
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border-slate-200 shadow-lg rounded-xl"
            >
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3">
                <Calendar className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">Cette semaine</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3">
                <Calendar className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">Ce mois</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3">
                <Calendar className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">Cette année</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Export */}
          <Button
            variant="outline"
            onClick={onExportCSV}
            className="h-12 px-4 bg-white border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>

          {/* Nouveau sacrement */}
          <NewSacrementIndividuelForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
