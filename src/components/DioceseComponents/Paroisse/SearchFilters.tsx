/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Search, Download, FileSpreadsheet, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  exporting: boolean;
  onExportExcel: () => void;
  onExportPDF: () => void;
  hasData: boolean;
}

export const SearchFilters = ({
  searchQuery,
  onSearchChange,
  exporting,
  onExportExcel,
  onExportPDF,
  hasData,
}: SearchFiltersProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Section recherche */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            placeholder="Rechercher une paroisse..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-9 bg-white border-slate-200 rounded-xl transition-all duration-200"
          />
        </div>

        {/* Bouton d'exportation */}
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-6 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                disabled={exporting || !hasData}
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Exportation..." : "Exporter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border-slate-200 shadow-lg rounded-xl"
            >
              <DropdownMenuItem
                onClick={onExportExcel}
                className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 mr-3 text-green-600" />
                <span className="font-medium">Exporter en Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onExportPDF}
                className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3 transition-colors"
              >
                <FileDown className="h-4 w-4 mr-3 text-red-600" />
                <span className="font-medium">Exporter en PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};