// FluxFinanciersPage.tsx
"use client";

import { useFluxFinanciers } from "@/hooks/useFluxFinanciers";
import { useFluxFiltering } from "@/hooks/useFluxFiltering";
import FluxFinancierStats from "@/components/flux-financiers/FluxFinancierStats";
import FluxFinancierFilters from "@/components/flux-financiers/FluxFinancierFilters";
import FluxFinancierTable from "@/components/flux-financiers/FluxFinancierTable";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/flux-financiers/FluxFinancierEmptyStates";
import RetraitButton from "@/components/retrait/RetraitButton";

export default function FluxFinanciersPage() {
  // Hook pour charger les données
  const { fluxFinanciers, stats, loading, error, retry } = useFluxFinanciers();

  // Hook pour le filtrage
  const {
    filteredFluxFinanciers,
    hasFilters,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    resetFilters,
  } = useFluxFiltering(fluxFinanciers);

  const handleRetry = () => {
    retry();
  };

  const handleRetraitSuccess = () => {
    // Recharger les données après un retrait réussi
    retry();
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Flux Financiers
          </h1>
          <p className="text-slate-500">
            Gérez et suivez les transactions financières de la paroisse
          </p>
        </div>
        <div className="flex gap-3">
          <RetraitButton
            onSuccess={handleRetraitSuccess}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          />
        </div>
      </div>

      {/* Statistiques */}
      {!loading && !error && <FluxFinancierStats stats={stats} />}

      {/* Filtres */}
      {!loading && !error && (
        <FluxFinancierFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />
      )}

      {/* Contenu principal */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : filteredFluxFinanciers.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onResetFilters={resetFilters} />
      ) : (
        <FluxFinancierTable
          fluxFinanciers={filteredFluxFinanciers}
          totalCount={fluxFinanciers.length}
        />
      )}
    </div>
  );
}