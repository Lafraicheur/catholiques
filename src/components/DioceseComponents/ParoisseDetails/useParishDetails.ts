/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchParoisseDetails,
  ParoisseDetails,
  nommerCure,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/ParoiseofDiocese";

export const useParishDetails = (paroisseId: string) => {
  const router = useRouter();
  
  // États principaux
  const [paroisseDetails, setParoisseDetails] = useState<ParoisseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("organisation");

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredParoissiens, setFilteredParoissiens] = useState<any[]>([]);

  // États pour la pagination
  const [currentPageParoissiens, setCurrentPageParoissiens] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPagesParoissiens, setTotalPagesParoissiens] = useState(1);

  // États pour la nomination
  const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
  const [serviteurId, setServiteurId] = useState("");
  const [isNominating, setIsNominating] = useState(false);

  // Charger les détails de la paroisse
  useEffect(() => {
    const loadParoisseDetails = async () => {
      if (!paroisseId) {
        setError("ID de la paroisse non spécifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchParoisseDetails(parseInt(paroisseId));
        console.log("📊 Données reçues:", data);
        setParoisseDetails(data);
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
          setError("Paroisse non trouvée.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadParoisseDetails();
  }, [paroisseId, router]);

  // Filtrer les données selon la recherche
  useEffect(() => {
    if (!paroisseDetails) return;

    const query = searchQuery.toLowerCase().trim();

    let paroissensResults = [...paroisseDetails.paroissiens];
    if (query) {
      paroissensResults = paroissensResults.filter(
        (paroissien) =>
          paroissien.nom?.toLowerCase().includes(query) ||
          paroissien.prenoms?.toLowerCase().includes(query) ||
          paroissien.num_de_telephone?.toLowerCase().includes(query) ||
          paroissien.statut?.toLowerCase().includes(query)
      );
    }
    setFilteredParoissiens(paroissensResults);
    setCurrentPageParoissiens(1);
    setTotalPagesParoissiens(
      Math.ceil(paroissensResults.length / itemsPerPage)
    );
  }, [searchQuery, paroisseDetails, itemsPerPage]);

  // Handlers
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const goToNextPageParoissiens = () => {
    if (currentPageParoissiens < totalPagesParoissiens) {
      setCurrentPageParoissiens(currentPageParoissiens + 1);
    }
  };

  const goToPreviousPageParoissiens = () => {
    if (currentPageParoissiens > 1) {
      setCurrentPageParoissiens(currentPageParoissiens - 1);
    }
  };

  const handleNommerCure = async () => {
    if (!serviteurId || !paroisseId) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner un serviteur valide.",
      });
      return;
    }

    try {
      setIsNominating(true);

      const paroisseUpdated = await nommerCure(
        parseInt(paroisseId),
        parseInt(serviteurId)
      );

      // Recharger les détails de la paroisse pour voir les changements
      const updatedDetails = await fetchParoisseDetails(parseInt(paroisseId));
      setParoisseDetails(updatedDetails);

      toast.success("Nomination réussie", {
        description: "Le curé a été nommé avec succès pour cette paroisse.",
      });

      // Fermer le dialog et réinitialiser
      setIsNominationDialogOpen(false);
      setServiteurId("");
    } catch (err) {
      console.error("Erreur lors de la nomination:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        toast.error("Accès refusé", {
          description:
            "Vous n'avez pas les droits pour effectuer cette nomination.",
        });
      } else {
        toast.error("Erreur de nomination", {
          description: "Une erreur est survenue lors de la nomination du curé.",
        });
      }
    } finally {
      setIsNominating(false);
    }
  };

  const handleViewParoissienDetails = (id: number) => {
    router.push(`/dashboard/diocese/paroisses/paroissiens/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return {
    // États
    paroisseDetails,
    loading,
    error,
    exporting,
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
  };
};