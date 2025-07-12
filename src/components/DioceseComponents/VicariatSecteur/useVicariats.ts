/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchVicariats,
  VicariatSecteur,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/VicariatSecteur";

export const useVicariats = () => {
  const router = useRouter();

  // États principaux
  const [vicariats, setVicariats] = useState<VicariatSecteur[]>([]);
  const [filteredVicariats, setFilteredVicariats] = useState<VicariatSecteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  // Charger les vicariats au montage du composant
  useEffect(() => {
    const loadVicariats = async () => {
      setLoading(true);
      setError(null);

      try {
        const dioceseId = getUserDioceseId();
        if (!dioceseId) {
          throw new Error("ID de diocèse non disponible");
        }

        const data = await fetchVicariats(dioceseId);
        setVicariats(data);
        setFilteredVicariats(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des vicariats:", err);
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
          setError("Aucun vicariat/secteur trouvé pour ce diocèse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVicariats();
  }, [router, itemsPerPage]);

  // Filtrer les vicariats selon la recherche
  useEffect(() => {
    let results = vicariats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (vicariat) =>
          vicariat?.nom?.toLowerCase().includes(query) ||
          vicariat?.siege?.nom?.toLowerCase().includes(query) ||
          vicariat?.vicaire_episcopal?.nom?.toLowerCase().includes(query) ||
          vicariat?.vicaire_episcopal?.prenoms?.toLowerCase().includes(query)
      );
    }

    setFilteredVicariats(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, vicariats, itemsPerPage]);

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
    router.push(`/dashboard/diocese/vicariats/${id}`);
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

  return {
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
  };
};