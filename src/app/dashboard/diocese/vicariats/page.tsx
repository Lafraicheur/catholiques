"use client";

// Import des composants
// import { StatsSection } from "./components/StatsSection";
import { StatsSection } from "@/components/DioceseComponents/VicariatSecteur/StatsSection";
import { SearchFilters } from "@/components/DioceseComponents/VicariatSecteur/SearchFilters";
import { VicariatsTable } from "@/components/DioceseComponents/VicariatSecteur/VicariatsTable";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/DioceseComponents/VicariatSecteur/LoadingStates";

// Import des utilitaires d'exportation
import {
  exportToExcel,
  exportToPDF,
} from "@/components/DioceseComponents/VicariatSecteur/exportUtils";

// Import du hook personnalisé
import { useVicariats } from "@/components/DioceseComponents/VicariatSecteur/useVicariats";

export default function VicariatsPage() {
  const {
    // États
    vicariats,
    filteredVicariats,
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
  } = useVicariats();

  // Handlers pour l'exportation
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await exportToExcel(filteredVicariats);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF(filteredVicariats);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Vicariats et Secteurs
          </h1>
          <p className="text-slate-500">
            Gérez les vicariats et secteurs de votre diocèse
          </p>
        </div>
      </div>

      {/* Section des statistiques */}
      {!loading && !error && <StatsSection vicariats={vicariats} />}

      {/* Section filtres et recherche */}
      {!loading && !error && (
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          exporting={exporting}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          hasData={filteredVicariats.length > 0}
        />
      )}

      {/* Contenu principal */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : filteredVicariats.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          onResetSearch={handleResetSearch}
        />
      ) : (
        <VicariatsTable
          vicariats={filteredVicariats}
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
