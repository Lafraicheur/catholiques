/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

// Imports des composants
import { DemandeMesseHeader } from "@/components/demande-messe/DemandeMesseHeader";
import { StatistiquesCard } from "@/components/demande-messe/StatistiquesCard";
import { FiltresSection } from "@/components/demande-messe/FiltresSection";
import { DemandesTableau } from "@/components/demande-messe/DemandesTableau";
import { PaginationControls } from "@/components/demande-messe/PaginationControls";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/demande-messe/EmptyStates";

// Imports des hooks
import { useDemandesMesse } from "@/hooks/useDemandesMesse";
import { useExport } from "@/hooks/useExportMesse";

export default function DemandeMessePage() {
  // Hook principal pour la gestion des demandes
  const {
    demandes,
    filteredDemandes,
    loading,
    error,
    searchQuery,
    filtrePayee,
    messeFilters,
    currentPage,
    totalPages,
    setSearchQuery,
    setFiltrePayee,
    setMesseFilters,
    resetAllFilters,
    getCurrentPageItems,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
  } = useDemandesMesse();

  // Hook pour l'exportation
  const { exporting, exportIndividualDemande, exportToExcel, exportToPDF } =
    useExport();

  // Calcul des statistiques
  const totalDemandes = demandes.length;
  const payees = demandes.filter((d) => d.est_payee).length;
  const nonPayees = demandes.filter((d) => !d.est_payee).length;

  // Fonctions d'export avec les données filtrées
  const handleExportExcel = () => exportToExcel(filteredDemandes);
  const handleExportPDF = () => exportToPDF(filteredDemandes);

  return (
    <div className="space-y-6">
      {/* Header */}
      <DemandeMesseHeader />

      {/* Statistiques */}
      {/* <StatistiquesCard
        totalDemandes={totalDemandes}
        payees={payees}
        nonPayees={nonPayees}
      /> */}

      {/* Filtres */}
      <FiltresSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filtrePayee={filtrePayee}
        setFiltrePayee={setFiltrePayee}
        messeFilters={messeFilters}
        setMesseFilters={setMesseFilters}
        demandes={demandes}
        exporting={exporting}
        filteredDemandes={filteredDemandes}
        onResetFilters={resetAllFilters}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* Contenu principal */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : filteredDemandes.length === 0 ? (
        <EmptyState
          hasActiveFilters={hasActiveFilters()}
          onResetFilters={resetAllFilters}
        />
      ) : (
        <>
          {/* Tableau */}
          <DemandesTableau
            demandes={getCurrentPageItems()}
            exporting={exporting}
            onExportIndividual={exportIndividualDemande}
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />

          {/* Pagination */}
          {/* <PaginationControls

            demandes,
  exporting,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onExportIndividual,
           
            hasActiveFilters={hasActiveFilters()}
            filteredCount={filteredDemandes.length}
            
          /> */}
        </>
      )}
    </div>
  );
}
