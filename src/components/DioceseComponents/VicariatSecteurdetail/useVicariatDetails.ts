import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchVicariatDetails,
  VicariatDetails,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/VicariatSecteur";

export const useVicariatDetails = (vicariatId: string) => {
  const router = useRouter();

  // États principaux
  const [vicariatDetails, setVicariatDetails] = useState<VicariatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("organisation");

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoyennes, setFilteredDoyennes] = useState<any[]>([]);
  const [filteredParoisses, setFilteredParoisses] = useState<any[]>([]);

  // États pour la pagination
  const [currentPageDoyennes, setCurrentPageDoyennes] = useState(1);
  const [currentPageParoisses, setCurrentPageParoisses] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPagesDoyennes, setTotalPagesDoyennes] = useState(1);
  const [totalPagesParoisses, setTotalPagesParoisses] = useState(1);

  // Charger les détails du vicariat
  useEffect(() => {
    const loadVicariatDetails = async () => {
      if (!vicariatId) {
        setError("ID du vicariat non spécifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchVicariatDetails(parseInt(vicariatId));
        console.log("📊 Données reçues:", data);
        setVicariatDetails(data);
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
          setError("Vicariat/secteur non trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVicariatDetails();
  }, [vicariatId, router]);

  // Filtrer les données selon la recherche
  useEffect(() => {
    if (!vicariatDetails) return;

    const query = searchQuery.toLowerCase().trim();

    // Filtrer les doyennés
    let doyennesResults = [...vicariatDetails.doyennes];
    if (query) {
      doyennesResults = doyennesResults.filter((doyenne) =>
        doyenne.nom.toLowerCase().includes(query)
      );
    }
    setFilteredDoyennes(doyennesResults);
    setCurrentPageDoyennes(1);
    setTotalPagesDoyennes(Math.ceil(doyennesResults.length / itemsPerPage));

    // Filtrer les paroisses
    let paroissesResults = [...vicariatDetails.paroisses];
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
  }, [searchQuery, vicariatDetails, itemsPerPage]);

  // Handlers pour la pagination des doyennés
  const goToNextPageDoyennes = () => {
    if (currentPageDoyennes < totalPagesDoyennes) {
      setCurrentPageDoyennes(currentPageDoyennes + 1);
    }
  };

  const goToPreviousPageDoyennes = () => {
    if (currentPageDoyennes > 1) {
      setCurrentPageDoyennes(currentPageDoyennes - 1);
    }
  };

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

  const handleViewDoyenneDetails = (id: number) => {
    router.push(`/dashboard/diocese/doyennes/${id}`);
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
    vicariatDetails,
    loading,
    error,
    exporting,
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
  };
};