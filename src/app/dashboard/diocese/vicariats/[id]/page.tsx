"use client";

import { useParams } from "next/navigation";

// Import des composants
// import { PageHeader } from "./components/PageHeader";
import { PageHeader } from "@/components/DioceseComponents/VicariatSecteurdetail/PageHeader";
import { StatsSection } from "@/components/DioceseComponents/VicariatSecteurdetail/StatsSection";
import { SearchBar } from "@/components/DioceseComponents/VicariatSecteurdetail/SearchBar";
import { MainTabs } from "@/components/DioceseComponents/VicariatSecteurdetail/MainTabs";
import {
  LoadingState,
  ErrorState,
} from "@/components/DioceseComponents/VicariatSecteurdetail/LoadingErrorStates";

// Import du hook personnalisé
import { useVicariatDetails } from "@/components/DioceseComponents/VicariatSecteurdetail/useVicariatDetails";

export default function VicariatDetailsPage() {
  const params = useParams();
  const vicariatId = params?.id as string;

  const {
    // États
    vicariatDetails,
    loading,
    error,
    activeTab,
    searchQuery,
    filteredDoyennes,
    filteredParoisses,
    currentPageDoyennes,
    currentPageParoisses,
    totalPagesDoyennes,
    totalPagesParoisses,
    itemsPerPage,

    // Setters
    setActiveTab,
    setSearchQuery,

    // Handlers
    goToNextPageDoyennes,
    goToPreviousPageDoyennes,
    goToNextPageParoisses,
    goToPreviousPageParoisses,
    handleClearSearch,
    handleViewDoyenneDetails,
    handleViewParoisseDetails,
    handleBack,
    handleRetry,
  } = useVicariatDetails(vicariatId);

  // États de chargement et d'erreur
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState error={error} onBack={handleBack} onRetry={handleRetry} />
    );
  }

  if (!vicariatDetails) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <PageHeader
        vicariatName={vicariatDetails.vicariat.nom}
        onBack={handleBack}
      />

      {/* Section des statistiques */}
      <StatsSection
        doyennesCount={filteredDoyennes.length}
        paroissesCount={filteredParoisses.length}
      />

      {/* Barre de recherche */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalDoyennes={vicariatDetails.doyennes.length}
        totalParoisses={vicariatDetails.paroisses.length}
        onClearSearch={handleClearSearch}
      />

      {/* Onglets principaux */}
      <MainTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        organisation={vicariatDetails.organisation}
        filteredDoyennes={filteredDoyennes}
        filteredParoisses={filteredParoisses}
        currentPageDoyennes={currentPageDoyennes}
        currentPageParoisses={currentPageParoisses}
        totalPagesDoyennes={totalPagesDoyennes}
        totalPagesParoisses={totalPagesParoisses}
        itemsPerPage={itemsPerPage}
        onPreviousPageDoyennes={goToPreviousPageDoyennes}
        onNextPageDoyennes={goToNextPageDoyennes}
        onPreviousPageParoisses={goToPreviousPageParoisses}
        onNextPageParoisses={goToNextPageParoisses}
        onViewDoyenneDetails={handleViewDoyenneDetails}
        onViewParoisseDetails={handleViewParoisseDetails}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}
