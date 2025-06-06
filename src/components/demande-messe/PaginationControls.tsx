// =============================================================================
// 8. COMPOSANT PAGINATION - components/PaginationControls.tsx
// =============================================================================

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasActiveFilters,
  filteredCount,
  totalCount,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-500">
          Page {currentPage} sur {totalPages}
        </p>
        {hasActiveFilters && (
          <div className="text-xs text-slate-400">
            {filteredCount} résultat(s) sur {totalCount}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};