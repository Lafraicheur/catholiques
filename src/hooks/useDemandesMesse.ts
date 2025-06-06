// =============================================================================
// 10. HOOK PERSONNALISÉ - hooks/useDemandesMesse.ts
// =============================================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DemandeMesse, MesseFilters } from "../types/demandeMesse";
import { fetchDemandesMesse } from "@/services/emandeMesseService";
import { getUserParoisseId, formatTimestamp, formatTime } from "@/utils/emandeMesseUtils";
import { AuthenticationError, ForbiddenError, NotFoundError } from "@/services/api";

export const useDemandesMesse = () => {
    const router = useRouter();
    const [demandes, setDemandes] = useState<DemandeMesse[]>([]);
    const [filteredDemandes, setFilteredDemandes] = useState<DemandeMesse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filtrePayee, setFiltrePayee] = useState<boolean | null>(null);
    const [messeFilters, setMesseFilters] = useState<MesseFilters>({
        libelle: "",
        dateDebut: "",
        heureFin: "",
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Charger les demandes de messe
    useEffect(() => {
        const loadDemandesMesse = async () => {
            setLoading(true);
            setError(null);

            try {
                const paroisseId = getUserParoisseId();
                if (!paroisseId) {
                    throw new Error("ID de paroisse non disponible");
                }

                const data = await fetchDemandesMesse(paroisseId);
                setDemandes(data);
                setFilteredDemandes(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
            } catch (err) {
                console.error("Erreur lors du chargement des demandes de messe:", err);
                if (err instanceof AuthenticationError) {
                    toast.error("Session expirée", {
                        description: "Veuillez vous reconnecter pour continuer.",
                    });
                    router.push("/login");
                } else if (err instanceof ForbiddenError) {
                    setError("Vous n'avez pas les droits nécessaires pour accéder à cette ressource.");
                } else if (err instanceof NotFoundError) {
                    setError("Aucune demande de messe trouvée pour cette paroisse.");
                } else {
                    setError("Une erreur est survenue lors du chargement des données.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadDemandesMesse();
    }, [router, itemsPerPage]);

    // Filtrer les demandes
    useEffect(() => {
        let results = demandes;

        // Filtrer par recherche
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            results = results.filter(
                (demande) =>
                    demande.demandeur.toLowerCase().includes(query) ||
                    demande.initiateur?.nom.toLowerCase().includes(query) ||
                    demande.initiateur?.num_de_telephone.toLowerCase().includes(query) ||

                    demande.concerne.toLowerCase().includes(query) ||
                    demande.intention.includes(query) ||
                    demande.description?.toLowerCase().includes(query)
            );
        }

        // Filtrer par statut de paiement
        if (filtrePayee !== null) {
            results = results.filter((demande) => demande.est_payee === filtrePayee);
        }

        // Filtrer par libellé de messe
        if (messeFilters.libelle) {
            results = results.filter(
                (demande) => demande.messe?.libelle === messeFilters.libelle
            );
        }

        // Filtrer par date de début
        if (messeFilters.dateDebut) {
            results = results.filter((demande) => {
                if (!demande.messe?.date_de_debut) return false;
                return formatTimestamp(demande.messe.date_de_debut) === messeFilters.dateDebut;
            });
        }

        // Filtrer par heure de fin
        if (messeFilters.heureFin) {
            results = results.filter((demande) => {
                if (!demande.messe?.extras?.heure_de_fin) return false;
                return formatTime(demande.messe.extras.heure_de_fin) === messeFilters.heureFin;
            });
        }

        setFilteredDemandes(results);
        setCurrentPage(1);
        setTotalPages(Math.ceil(results.length / itemsPerPage));
    }, [searchQuery, filtrePayee, messeFilters, demandes, itemsPerPage]);

    // Réinitialiser tous les filtres
    const resetAllFilters = () => {
        setSearchQuery("");
        setFiltrePayee(null);
        setMesseFilters({
            libelle: "",
            dateDebut: "",
            heureFin: "",
        });
    };

    // Calculer les demandes à afficher pour la pagination
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDemandes.slice(startIndex, endIndex);
    };

    // Navigation de pagination
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

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = () => {
        return (
            searchQuery.trim() !== "" ||
            filtrePayee !== null ||
            messeFilters.libelle !== "" ||
            messeFilters.dateDebut !== "" ||
            messeFilters.heureFin !== ""
        );
    };

    return {
        // État
        demandes,
        filteredDemandes,
        loading,
        error,
        searchQuery,
        filtrePayee,
        messeFilters,
        currentPage,
        totalPages,

        // Actions
        setSearchQuery,
        setFiltrePayee,
        setMesseFilters,
        resetAllFilters,
        getCurrentPageItems,
        goToNextPage,
        goToPreviousPage,
        hasActiveFilters,
    };
};