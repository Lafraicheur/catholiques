// components/sacrements/SacrementSearchBar.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <h2 className="text-lg font-semibold">
        Sacrements Individuels ({totalSacrements})
      </h2>
      <div className="flex flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <Button
          variant="outline"
          size="icon"
          onClick={onExportCSV}
          title="Exporter en CSV"
        >
          <Download className="h-4 w-4" />
        </Button> */}
      </div>
      <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
        <NewSacrementIndividuelForm onSuccess={onSuccess} />
      </div>
    </div>
  );
}
