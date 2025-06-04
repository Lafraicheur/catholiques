/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/unions/UnionSearchBar.tsx
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NewSacrementUnionForm from "@/components/forms/NewSacrementUnionForm";

interface UnionSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalUnions: number;
  onExportCSV: () => void;
  onSuccess: () => void;
}

export default function UnionSearchBar({
  searchQuery,
  setSearchQuery,
  totalUnions,
  onSuccess,
}: UnionSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <h2 className="text-lg font-semibold">
        Sacrements d'Union ({totalUnions})
      </h2>

      <div className="flex flex-wrap gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
        <NewSacrementUnionForm onSuccess={onSuccess} />
      </div>
    </div>
  );
}
