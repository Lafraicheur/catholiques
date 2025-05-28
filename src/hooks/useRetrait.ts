// hooks/useRetrait.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RetraitRequest, RetraitResponse } from "@/types/retrait";
import {
    AuthenticationError,
    ForbiddenError,
    NotFoundError,
    ApiError,
} from "@/services/api";

interface CompteStatistiques {
    id: number;
    abonnement: number;
    demande_de_messe: number;
    denier_de_culte: number;
    quete: number;
    don: number;
}

export function useRetrait() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [soldes, setSoldes] = useState<CompteStatistiques | null>(null);
    const [loadingSoldes, setLoadingSoldes] = useState(false);

    const getUserParoisseId = (): number => {
        try {
            const userProfileStr = localStorage.getItem("user_profile");
            if (userProfileStr) {
                const userProfile = JSON.parse(userProfileStr);
                return userProfile.paroisse_id || 0;
            }
        } catch (err) {
            console.error("Erreur lors de la récupération du profil:", err);
        }
        return 0;
    };

    const getAuthToken = (): string | null => {
        return localStorage.getItem("auth_token");
    };

    const handleApiError = (err: unknown): string => {
        console.error("Erreur API:", err);

        if (err instanceof AuthenticationError) {
            return "Session expirée. Veuillez vous reconnecter.";
        } else if (err instanceof ForbiddenError) {
            return "Vous n'avez pas les droits nécessaires pour effectuer cette opération.";
        } else if (err instanceof NotFoundError) {
            return "Ressource non trouvée.";
        } else if (err instanceof ApiError) {
            if (err.status === 400) {
                return "Données invalides. Veuillez vérifier les informations saisies.";
            } else if (err.status === 429) {
                return "Trop de requêtes. Veuillez réessayer plus tard.";
            }
            return err.message;
        } else {
            return "Une erreur inattendue s'est produite.";
        }
    };

    const loadSoldes = async () => {
        setLoadingSoldes(true);
        try {
            const token = getAuthToken();
            if (!token) {
                throw new AuthenticationError("Token d'authentification non trouvé");
            }

            const paroisseId = getUserParoisseId();
            if (!paroisseId) {
                throw new AuthenticationError("ID de paroisse non trouvé");
            }

            const response = await fetch(
                `https://api.cathoconnect.ci/api:HzF8fFua/finances/obtenir-comptes?paroisse_id=${paroisseId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des soldes");
            }

            const data = await response.json();
            setSoldes(data.item);
        } catch (err) {
            console.error("Erreur lors du chargement des soldes:", err);
            setSoldes(null);
        } finally {
            setLoadingSoldes(false);
        }
    };

    // Charger les soldes au montage du hook
    useEffect(() => {
        loadSoldes();
    }, []);

    const getSoldeForCompte = (idSousCompte: string): number => {
        if (!soldes) return 0;

        switch (idSousCompte) {
            case "1": return soldes.abonnement;
            case "2": return soldes.demande_de_messe;
            case "3": return soldes.denier_de_culte;
            case "4": return soldes.quete;
            case "5": return soldes.don;
            default: return 0;
        }
    };
    const faireRetrait = async (data: Omit<RetraitRequest, 'compte_id'>): Promise<RetraitResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            if (!token) {
                throw new AuthenticationError("Token d'authentification non trouvé");
            }

            const compteId = getUserParoisseId();
            if (!compteId) {
                throw new AuthenticationError("ID de paroisse non trouvé");
            }

            // Vérifier si le solde est suffisant
            const soldeDisponible = getSoldeForCompte(data.id_sous_compte);
            if (data.montant > soldeDisponible) {
                throw new Error(`Solde insuffisant. Solde disponible: ${soldeDisponible} FCFA`);
            }

            const requestData: RetraitRequest = {
                ...data,
                compte_id: compteId,
            };

            // 🔍 LOGS DE DÉBOGAGE - Ajoutez ces lignes
            console.log("=== DÉBOGAGE RETRAIT ===");
            console.log("1. Données reçues du formulaire:", data);
            console.log("2. ID Paroisse (compte_id):", compteId);
            console.log("3. Données finales envoyées à l'API:", requestData);
            console.log("4. JSON stringifié:", JSON.stringify(requestData, null, 2));

            const response = await fetch(
                "https://api.cathoconnect.ci/api:HzF8fFua/finances/faire-un-retrait",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                }
            );

            // 🔍 LOG DE LA RÉPONSE
            const responseText = await response.text();
            console.log("5. Statut de la réponse:", response.status);
            console.log("6. Réponse brute de l'API:", responseText);

            if (!response.ok) {
                if (response.status === 400) {
                    // Afficher plus de détails sur l'erreur 400
                    console.error("❌ Erreur 400 - Détails:", responseText);
                    throw new ApiError(
                        `Données invalides. Détails: ${responseText}`,
                        400
                    );
                } else if (response.status === 401) {
                    throw new AuthenticationError("Session expirée");
                } else if (response.status === 403) {
                    throw new ForbiddenError("Accès refusé");
                } else if (response.status === 404) {
                    throw new NotFoundError("Ressource non trouvée");
                } else if (response.status === 429) {
                    throw new ApiError(
                        "Trop de requêtes, veuillez réessayer plus tard",
                        429
                    );
                } else {
                    throw new ApiError(
                        "Erreur lors du traitement de la demande de retrait",
                        response.status
                    );
                }
            }

            const result: RetraitResponse = JSON.parse(responseText);
            console.log("✅ Retrait réussi:", result);

            // Recharger les soldes après un retrait réussi
            await loadSoldes();

            return result;
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            toast.error("Erreur lors du retrait", {
                description: errorMessage,
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        faireRetrait,
        loading,
        error,
        setError,
        soldes,
        loadingSoldes,
        getSoldeForCompte,
        loadSoldes,
    };
}