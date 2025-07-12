/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchDoyenneDetails,
  DoyenneDetails,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/Doyennes";

export const useDoyenneDetails = (doyenneId: string) => {
  const router = useRouter();

  // États principaux
  const [doyenneDetails, setDoyenneDetails] = useState<DoyenneDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("organisation");

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredParoisses, setFilteredParoisses] = useState<any[]>([]);

  // États pour la pagination
  const [currentPageParoisses, setCurrentPageParoisses] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPagesParoisses, setTotalPagesParoisses] = useState(1);

  // Charger les détails du doyenné
  useEffect(() => {
    const loadDoyenneDetails = async () => {
      if (!doyenneId) {
        setError("ID du doyenné non spécifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchDoyenneDetails(parseInt(doyenneId));
        console.log("📊 Données reçues:", data);
        setDoyenneDetails(data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
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
          setError("Doyenné non trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDoyenneDetails();
  }, [doyenneId, router]);

  // Filtrer les données selon la recherche
  useEffect(() => {
    if (!doyenneDetails) return;

    const query = searchQuery.toLowerCase().trim();

    // Filtrer les paroisses
    let paroissesResults = [...doyenneDetails.paroisses];
    if (query) {
      paroissesResults = paroissesResults.filter(
        (paroisse) =>
          paroisse.nom?.toLowerCase().includes(query) ||
          paroisse.ville?.toLowerCase().includes(query) ||
          paroisse.quartier?.toLowerCase().includes(query) ||
          paroisse.statut?.toLowerCase().includes(query)
      );
    }
    setFilteredParoisses(paroissesResults);
    setCurrentPageParoisses(1);
    setTotalPagesParoisses(Math.ceil(paroissesResults.length / itemsPerPage));
  }, [searchQuery, doyenneDetails, itemsPerPage]);

  // Handlers pour la pagination des paroisses
  const goToNextPageParoisses = () => {
    if (currentPageParoisses < totalPagesParoisses) {
      setCurrentPageParoisses(currentPageParoisses + 1);
    }
  };

  const goToPreviousPageParoisses = () => {
    if (currentPageParoisses > 1) {
      setCurrentPageParoisses(currentPageParoisses - 1);
    }
  };

  // Handlers pour les actions
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleViewParoisseDetails = (id: number) => {
    router.push(`/dashboard/diocese/paroisses/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return {
    // États
    doyenneDetails,
    loading,
    error,
    exporting,
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
  };
};