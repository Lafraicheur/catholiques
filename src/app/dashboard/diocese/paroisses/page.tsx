/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchParoisses,
  Paroisse,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/ParoiseofDiocese";

// Import des composants
import { StatsSection } from "@/components/DioceseComponents/Paroisse/StatsSection";
import { SearchFilters } from "@/components/DioceseComponents/Paroisse/SearchFilters";
import { ParoissesTable } from "@/components/DioceseComponents/Paroisse/ParoissesTable";
import { LoadingState, ErrorState, EmptyState } from "@/components/DioceseComponents/Paroisse/LoadingStates";
import { exportToExcel, exportToPDF } from "@/components/DioceseComponents/Paroisse/exportUtils";

export default function ParoissesPage() {
  const router = useRouter();
  const [paroisses, setParoisses] = useState<Paroisse[]>([]);
  const [filteredParoisses, setFilteredParoisses] = useState<Paroisse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour l'exportation
  const [exporting, setExporting] = useState(false);

  // Récupérer l'ID du diocèse à partir du localStorage
  const getUserDioceseId = (): number => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.diocese_id || 0;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
    }
    return 0;
  };

  // Charger les paroisses au montage du composant
  useEffect(() => {
    const loadParoisses = async () => {
      setLoading(true);
      setError(null);

      try {
        const dioceseId = getUserDioceseId();
        if (!dioceseId) {
          throw new Error("ID de diocèse non disponible");
        }

        const data = await fetchParoisses(dioceseId);
        setParoisses(data);
        setFilteredParoisses(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des paroisses:", err);
        if (err instanceof AuthenticationError) {
          toast.error("Session expirée", {
            description: "Veuillez vous reconnecter pour continuer.",
          });
          router.push("/login");
        } else if (err instanceof ForbiddenError) {
          setError(
            "Vous n'avez pas les droits nécessaires pour accéder à cette ressource."
          );
        } else if (err instanceof NotFoundError) {
          setError("Aucune paroisse trouvée pour ce diocèse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadParoisses();
  }, [router, itemsPerPage]);

  // Filtrer les paroisses selon la recherche
  useEffect(() => {
    let results = paroisses;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (paroisse) =>
          paroisse?.nom?.toLowerCase().includes(query) ||
          paroisse?.ville?.toLowerCase().includes(query) ||
          paroisse?.quartier?.toLowerCase().includes(query) ||
          paroisse?.statut?.toLowerCase().includes(query)
      );
    }

    setFilteredParoisses(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, paroisses, itemsPerPage]);

  // Handlers pour la pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handlers pour les actions
  const handleViewDetails = (id: number) => {
    router.push(`/dashboard/diocese/paroisses/${id}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Handlers pour l'exportation
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await exportToExcel(filteredParoisses);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF(filteredParoisses);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Paroisses</h1>
          <p className="text-slate-500">Gérez les paroisses de votre diocèse</p>
        </div>
      </div>

      {/* Section des statistiques */}
      {!loading && !error && <StatsSection paroisses={paroisses} />}

      {/* Section filtres et recherche */}
      {!loading && !error && (
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          exporting={exporting}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          hasData={filteredParoisses.length > 0}
        />
      )}

      {/* Contenu principal */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : filteredParoisses.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          onResetSearch={handleResetSearch}
        />
      ) : (
        <ParoissesTable
          paroisses={filteredParoisses}
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