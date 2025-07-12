"use client";

import { useParams } from "next/navigation";

// Import des composants
// import { PageHeader } from "./components/PageHeader";
import { PageHeader } from "@/components/DioceseComponents/ParoisseDetails/PageHeader";
import { StatsSection } from "@/components/DioceseComponents/ParoisseDetails/StatsSection";
import { SearchBar } from "@/components/DioceseComponents/ParoisseDetails/SearchBar";
import { MainTabs } from "@/components/DioceseComponents/ParoisseDetails/MainTabs";
import { LoadingState, ErrorState } from "@/components/DioceseComponents/ParoisseDetails/LoadingErrorStates";

// Import du hook personnalisé
import { useParishDetails } from "@/components/DioceseComponents/ParoisseDetails/useParishDetails";

export default function ParoisseDetailsPage() {
  const params = useParams();
  const paroisseId = params?.id as string;

  const {
    // États
    paroisseDetails,
    loading,
    error,
    activeTab,
    searchQuery,
    filteredParoissiens,
    currentPageParoissiens,
    totalPagesParoissiens,
    itemsPerPage,
    isNominationDialogOpen,
    serviteurId,
    isNominating,

    // Setters
    setActiveTab,
    setSearchQuery,
    setIsNominationDialogOpen,
    setServiteurId,

    // Handlers
    handleClearSearch,
    goToNextPageParoissiens,
    goToPreviousPageParoissiens,
    handleNommerCure,
    handleViewParoissienDetails,
    handleBack,
    handleRetry,
  } = useParishDetails(paroisseId);

  // États de chargement et d'erreur
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onBack={handleBack}
        onRetry={handleRetry}
      />
    );
  }

  if (!paroisseDetails) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <PageHeader
        paroisseName={paroisseDetails.paroisse.nom}
        ville={paroisseDetails.paroisse.ville}
        quartier={paroisseDetails.paroisse.quartier}
        statut={paroisseDetails.paroisse.statut}
        onBack={handleBack}
      />

      {/* Section des statistiques */}
      <StatsSection paroissiens={paroisseDetails.paroissiens} />

      {/* Barre de recherche */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalParoissiens={paroisseDetails.paroissiens.length}
        onClearSearch={handleClearSearch}
      />

      {/* Onglets principaux */}
      <MainTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredParoissiens={filteredParoissiens}
        organisation={paroisseDetails.organisation}
        isNominationDialogOpen={isNominationDialogOpen}
        setIsNominationDialogOpen={setIsNominationDialogOpen}
        serviteurId={serviteurId}
        setServiteurId={setServiteurId}
        isNominating={isNominating}
        onNommerCure={handleNommerCure}
        currentPageParoissiens={currentPageParoissiens}
        totalPagesParoissiens={totalPagesParoissiens}
        itemsPerPage={itemsPerPage}
        onPreviousPageParoissiens={goToPreviousPageParoissiens}
        onNextPageParoissiens={goToNextPageParoissiens}
        onViewParoissienDetails={handleViewParoissienDetails}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}