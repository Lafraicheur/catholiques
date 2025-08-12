// FluxFinanciersPage.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

// Configuration de la pagination
const ITEMS_PER_PAGE = 10;

export default function FluxFinanciersPage() {
  const router = useRouter();

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculs de pagination
  const totalPages = Math.ceil(filteredFluxFinanciers.length / ITEMS_PER_PAGE);

  // Données paginées
  const paginatedFluxFinanciers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFluxFinanciers.slice(startIndex, endIndex);
  }, [filteredFluxFinanciers, currentPage]);

  // Fonctions de navigation
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Réinitialiser la page quand les filtres changent
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Navigation vers la page des moyens de paiement
  const handleNavigateToMoyensPaiement = () => {
    router.push("/dashboard/paroisse/moyens-paiement");
  };

  // Gestionnaires d'événements
  const handleRetry = () => {
    retry();
    setCurrentPage(1);
  };

  const handleRetraitSuccess = () => {
    // Recharger les données après un retrait réussi
    retry();
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  // Wrapper pour les fonctions de filtrage avec reset de page
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFilterChange();
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    handleFilterChange();
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    handleFilterChange();
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    handleFilterChange();
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    handleFilterChange();
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
          <Button
            variant="outline"
            onClick={handleNavigateToMoyensPaiement}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            Moyens de retrait
          </Button>
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
          setSearchQuery={handleSearchChange}
          typeFilter={typeFilter}
          setTypeFilter={handleTypeFilterChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
          dateFrom={dateFrom}
          setDateFrom={handleDateFromChange}
          dateTo={dateTo}
          setDateTo={handleDateToChange}
        />
      )}

      {/* Contenu principal */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : filteredFluxFinanciers.length === 0 ? (
        <EmptyState
          hasFilters={hasFilters}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <FluxFinancierTable
          fluxFinanciers={paginatedFluxFinanciers}
          totalCount={filteredFluxFinanciers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      )}
    </div>
  );
}
