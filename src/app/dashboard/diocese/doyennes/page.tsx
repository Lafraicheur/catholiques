"use client";

// Import des composants
// import { StatsSection } from "./components/StatsSection";
import { StatsSection } from "@/components/DioceseComponents/Doyenne/StatsSection";
import { SearchFilters } from "@/components/DioceseComponents/Doyenne/SearchFilters";
import { DoyennesTable } from "@/components/DioceseComponents/Doyenne/DoyennesTable";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/DioceseComponents/Doyenne/LoadingStates";

// Import des utilitaires d'exportation
import {
  exportToExcel,
  exportToPDF,
} from "@/components/DioceseComponents/Doyenne/exportUtils";

// Import du hook personnalisé
import { useDoyennes } from "@/components/DioceseComponents/Doyenne/useDoyennes";

export default function DoyennesPage() {
  const {
    // États
    doyennes,
    filteredDoyennes,
    loading,
    error,
    searchQuery,
    currentPage,
    totalPages,
    itemsPerPage,
    exporting,

    // Setters
    setExporting,

    // Handlers
    goToNextPage,
    goToPreviousPage,
    handleViewDetails,
    handleSearchChange,
    handleResetSearch,
    handleRetry,
  } = useDoyennes();

  // Handlers pour l'exportation
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await exportToExcel(filteredDoyennes);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF(filteredDoyennes);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Doyennés</h1>
          <p className="text-slate-500">Gérez les doyennés de votre diocèse</p>
        </div>
      </div>

      {/* Section des statistiques */}
      {!loading && !error && <StatsSection doyennes={doyennes} />}

      {/* Section filtres et recherche */}
      {!loading && !error && (
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          exporting={exporting}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          hasData={filteredDoyennes.length > 0}
        />
      )}

      {/* Contenu principal */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : filteredDoyennes.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          onResetSearch={handleResetSearch}
        />
      ) : (
        <DoyennesTable
          doyennes={filteredDoyennes}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}
