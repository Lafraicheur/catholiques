"use client";

import { useParams } from "next/navigation";

// Import des composants
import { PageHeader } from "@/components/DioceseComponents/DoyenneDetails/PageHeader";
import { StatsSection } from "@/components/DioceseComponents/DoyenneDetails/StatsSection";
import { SearchBar } from "@/components/DioceseComponents/DoyenneDetails/SearchBar";
import { MainTabs } from "@/components/DioceseComponents/DoyenneDetails/MainTabs";
import {
  LoadingState,
  ErrorState,
} from "@/components/DioceseComponents/DoyenneDetails/LoadingErrorStates";

// Import du hook personnalisé
import { useDoyenneDetails } from "@/components/DioceseComponents/DoyenneDetails/useDoyenneDetails";

export default function DoyenneDetailsPage() {
  const params = useParams();
  const doyenneId = params?.id as string;

  const {
    // États
    doyenneDetails,
    loading,
    error,
    activeTab,
    searchQuery,
    filteredParoisses,
    currentPageParoisses,
    totalPagesParoisses,
    itemsPerPage,

    // Setters
    setActiveTab,
    setSearchQuery,

    // Handlers
    goToNextPageParoisses,
    goToPreviousPageParoisses,
    handleClearSearch,
    handleViewParoisseDetails,
    handleBack,
    handleRetry,
  } = useDoyenneDetails(doyenneId);

  // États de chargement et d'erreur
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState error={error} onBack={handleBack} onRetry={handleRetry} />
    );
  }

  if (!doyenneDetails) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <PageHeader
        doyenneName={doyenneDetails.doyenne.nom}
        onBack={handleBack}
      />

      {/* Section des statistiques */}
      <StatsSection
        paroissesCount={filteredParoisses.length}
        curesCount={doyenneDetails.organisation?.cures?.length || 0}
      />

      {/* Barre de recherche */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalParoisses={doyenneDetails.paroisses.length}
        onClearSearch={handleClearSearch}
      />

      {/* Onglets principaux */}
      <MainTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        organisation={doyenneDetails.organisation}
        filteredParoisses={filteredParoisses}
        currentPageParoisses={currentPageParoisses}
        totalPagesParoisses={totalPagesParoisses}
        itemsPerPage={itemsPerPage}
        onPreviousPageParoisses={goToPreviousPageParoisses}
        onNextPageParoisses={goToNextPageParoisses}
        onViewParoisseDetails={handleViewParoisseDetails}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}
