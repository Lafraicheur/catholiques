// // hooks/useRetrait.ts
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { RetraitRequest, RetraitResponse } from "@/types/retrait";
// import {
//     AuthenticationError,
//     ForbiddenError,
//     NotFoundError,
//     ApiError,
// } from "@/services/api";

// interface CompteStatistiques {
//     id: number;
//     abonnement: number;
//     demande_de_messe: number;
//     denier_de_culte: number;
//     quete: number;
//     don: number;
// }

// export function useRetrait() {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [soldes, setSoldes] = useState<CompteStatistiques | null>(null);
//     const [loadingSoldes, setLoadingSoldes] = useState(false);

//     const getUserParoisseId = (): number => {
//         try {
//             const userProfileStr = localStorage.getItem("user_profile");
//             if (userProfileStr) {
//                 const userProfile = JSON.parse(userProfileStr);
//                 return userProfile.paroisse_id || 0;
//             }
//         } catch (err) {
//             console.error("Erreur lors de la récupération du profil:", err);
//         }
//         return 0;
//     };

//     const getAuthToken = (): string | null => {
//         return localStorage.getItem("auth_token");
//     };

//     const handleApiError = (err: unknown): string => {
//         console.error("Erreur API:", err);

//         if (err instanceof AuthenticationError) {
//             return "Session expirée. Veuillez vous reconnecter.";
//         } else if (err instanceof ForbiddenError) {
//             return "Vous n'avez pas les droits nécessaires pour effectuer cette opération.";
//         } else if (err instanceof NotFoundError) {
//             return "Ressource non trouvée.";
//         } else if (err instanceof ApiError) {
//             if (err.status === 400) {
//                 return "Données invalides. Veuillez vérifier les informations saisies.";
//             } else if (err.status === 429) {
//                 return "Trop de requêtes. Veuillez réessayer plus tard.";
//             }
//             return err.message;
//         } else {
//             return "Une erreur inattendue s'est produite.";
//         }
//     };

//     const loadSoldes = async () => {
//         setLoadingSoldes(true);
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 throw new AuthenticationError("Token d'authentification non trouvé");
//             }

//             const paroisseId = getUserParoisseId();
//             if (!paroisseId) {
//                 throw new AuthenticationError("ID de paroisse non trouvé");
//             }

//             const response = await fetch(
//                 `https://api.cathoconnect.ci/api:HzF8fFua/finances/obtenir-comptes?paroisse_id=${paroisseId}`,
//                 {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error("Erreur lors du chargement des soldes");
//             }

//             const data = await response.json();
//             setSoldes(data.item);
//         } catch (err) {
//             console.error("Erreur lors du chargement des soldes:", err);
//             setSoldes(null);
//         } finally {
//             setLoadingSoldes(false);
//         }
//     };

//     // Charger les soldes au montage du hook
//     useEffect(() => {
//         loadSoldes();
//     }, []);

//     const getSoldeForCompte = (idSousCompte: string): number => {
//         if (!soldes) return 0;

//         switch (idSousCompte) {
//             case "1": return soldes.abonnement;
//             case "2": return soldes.demande_de_messe;
//             case "3": return soldes.denier_de_culte;
//             case "4": return soldes.quete;
//             case "5": return soldes.don;
//             default: return 0;
//         }
//     };
//     const faireRetrait = async (data: Omit<RetraitRequest, 'compte_id'>): Promise<RetraitResponse | null> => {
//         setLoading(true);
//         setError(null);

//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 throw new AuthenticationError("Token d'authentification non trouvé");
//             }

//             const compteId = getUserParoisseId();
//             if (!compteId) {
//                 throw new AuthenticationError("ID de paroisse non trouvé");
//             }

//             // Vérifier si le solde est suffisant
//             const soldeDisponible = getSoldeForCompte(data.id_sous_compte);
//             if (data.montant > soldeDisponible) {
//                 throw new Error(`Solde insuffisant. Solde disponible: ${soldeDisponible} FCFA`);
//             }

//             const requestData: RetraitRequest = {
//                 ...data,
//                 compte_id: compteId,
//             };

//             // 🔍 LOGS DE DÉBOGAGE - Ajoutez ces lignes
//             console.log("=== DÉBOGAGE RETRAIT ===");
//             console.log("1. Données reçues du formulaire:", data);
//             console.log("2. ID Paroisse (compte_id):", compteId);
//             console.log("3. Données finales envoyées à l'API:", requestData);
//             console.log("4. JSON stringifié:", JSON.stringify(requestData, null, 2));

//             const response = await fetch(
//                 "https://api.cathoconnect.ci/api:erbLVPjR/finances/faire-un-retrait",
//                 {
//                     method: "POST",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(requestData),
//                 }
//             );

//             // 🔍 LOG DE LA RÉPONSE
//             const responseText = await response.text();
//             console.log("5. Statut de la réponse:", response.status);
//             console.log("6. Réponse brute de l'API:", responseText);

//             if (!response.ok) {
//                 if (response.status === 400) {
//                     // Afficher plus de détails sur l'erreur 400
//                     console.error("❌ Erreur 400 - Détails:", responseText);
//                     throw new ApiError(
//                         `Données invalides. Détails: ${responseText}`,
//                         400
//                     );
//                 } else if (response.status === 401) {
//                     throw new AuthenticationError("Session expirée");
//                 } else if (response.status === 403) {
//                     throw new ForbiddenError("Accès refusé");
//                 } else if (response.status === 404) {
//                     throw new NotFoundError("Ressource non trouvée");
//                 } else if (response.status === 429) {
//                     throw new ApiError(
//                         "Trop de requêtes, veuillez réessayer plus tard",
//                         429
//                     );
//                 } else {
//                     throw new ApiError(
//                         "Erreur lors du traitement de la demande de retrait",
//                         response.status
//                     );
//                 }
//             }

//             const result: RetraitResponse = JSON.parse(responseText);
//             console.log("✅ Retrait réussi:", result);

//             // Recharger les soldes après un retrait réussi
//             await loadSoldes();

//             return result;
//         } catch (err) {
//             const errorMessage = handleApiError(err);
//             setError(errorMessage);
//             toast.error("Erreur lors du retrait", {
//                 description: errorMessage,
//             });
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         faireRetrait,
//         loading,
//         error,
//         setError,
//         soldes,
//         loadingSoldes,
//         getSoldeForCompte,
//         loadSoldes,
//     };
// }


// hooks/useRetrait.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    AuthenticationError,
    ForbiddenError,
    NotFoundError,
    ApiError,
} from "@/services/api";

// Types mis à jour selon la nouvelle API
interface SousCompte {
    field: string;
    label: string;
    montant: number;
}

interface NewRetraitRequest {
    paroisse_id: number;
    montant: number;
    frais: number;
    montant_avec_frais: number;
    num_de_telephone: string;
    moyen: "WAVE" | "ORANGE" | "MOOV" | "MTN" | "TREMO" | "PAYTOU";
    souscomptes: SousCompte[];
}

interface RetraitResponse {
    item: string;
    payzen_item: string;
}

interface CompteStatistiques {
    id: number;
    abonnement: number;
    demande_de_messe: number;
    denier_de_culte: number;
    fnc: number;
    don: number;
}

// Configuration API centralisée
const API_CONFIG = {
    BASE_URL: "https://api.cathoconnect.ci",
    ENDPOINTS: {
        OBTENIR_COMPTES: "/api:HzF8fFua/finances/obtenir-comptes",
        FAIRE_RETRAIT: "/api:erbLVPjR/finances/faire-un-retrait",
    }
};

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

    const getApiHeaders = () => ({
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
    });

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
        } else if (err instanceof Error) {
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

            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.OBTENIR_COMPTES}?paroisse_id=${paroisseId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: getApiHeaders(),
            });

            if (!response.ok) {
                throw new ApiError("Erreur lors du chargement des soldes", response.status);
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

    const getSoldeForCompte = (fieldName: string): number => {
        if (!soldes) return 0;

        // Mapping des champs selon votre logique métier
        switch (fieldName) {
            case "abonnement": return soldes.abonnement;
            case "demande_de_messe": return soldes.demande_de_messe;
            case "denier_de_culte": return soldes.denier_de_culte;
            case "fnc": return soldes.fnc;
            case "don": return soldes.don;
            default: return 0;
        }
    };

    // Calculer les frais selon l'opérateur
    const calculateFrais = (montant: number, moyen: string): number => {
        // Logique de calcul des frais selon l'opérateur
        const tauxFrais: { [key: string]: number } = {
            "WAVE": 1.5,
            "ORANGE": 1.0,
            "MOOV": 1.0,
            "MTN": 1.0,
            "TREMO": 1.0,
            "PAYTOU": 1.0,
        };
        
        const taux = tauxFrais[moyen] || 1.0;
        return Math.round((montant * taux) / 100);
    };

    // Valider les données du retrait
    const validateRetraitData = (data: {
        montant: number;
        souscomptes: SousCompte[];
        num_de_telephone: string;
        moyen: string;
    }): void => {
        if (data.montant <= 0) {
            throw new Error("Le montant doit être supérieur à 0");
        }

        if (!data.num_de_telephone || !/^[0-9]{10}$/.test(data.num_de_telephone)) {
            throw new Error("Numéro de téléphone invalide (10 chiffres requis)");
        }

        if (!data.moyen) {
            throw new Error("Moyen de paiement non sélectionné");
        }

        if (!data.souscomptes || data.souscomptes.length === 0) {
            throw new Error("Aucun sous-compte sélectionné");
        }

        // Vérifier que la somme des sous-comptes correspond au montant total
        const sommeSousComptes = data.souscomptes.reduce((sum, sc) => sum + sc.montant, 0);
        if (Math.abs(sommeSousComptes - data.montant) > 0.01) {
            throw new Error("La somme des sous-comptes ne correspond pas au montant total");
        }

        // Vérifier les soldes disponibles
        for (const souscompte of data.souscomptes) {
            const soldeDisponible = getSoldeForCompte(souscompte.field);
            if (souscompte.montant > soldeDisponible) {
                throw new Error(
                    `Solde insuffisant pour ${souscompte.label}. ` +
                    `Disponible: ${soldeDisponible} FCFA, Demandé: ${souscompte.montant} FCFA`
                );
            }
        }
    };

    const faireRetrait = async (data: {
        montant: number;
        souscomptes: SousCompte[];
        num_de_telephone: string;
        moyen: "WAVE" | "ORANGE" | "MOOV" | "MTN" | "TREMO" | "PAYTOU";
    }): Promise<RetraitResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            if (!token) {
                throw new AuthenticationError("Token d'authentification non trouvé");
            }

            const paroisseId = getUserParoisseId();
            if (!paroisseId) {
                throw new AuthenticationError("ID de paroisse non trouvé");
            }

            // Validation des données
            validateRetraitData(data);

            // Calculer les frais
            const frais = calculateFrais(data.montant, data.moyen);
            const montantAvecFrais = data.montant - frais;

            const requestData: NewRetraitRequest = {
                paroisse_id: paroisseId,
                montant: data.montant,
                frais: frais,
                montant_avec_frais: montantAvecFrais,
                num_de_telephone: data.num_de_telephone,
                moyen: data.moyen,
                souscomptes: data.souscomptes,
            };

            // Logs de débogage (à désactiver en production)
            const isDev = process.env.NODE_ENV === 'development';
            if (isDev) {
                console.log("=== DÉBOGAGE RETRAIT ===");
                console.log("1. Données reçues du formulaire:", data);
                console.log("2. ID Paroisse:", paroisseId);
                console.log("3. Frais calculés:", frais);
                console.log("4. Montant avec frais:", montantAvecFrais);
                console.log("5. Données finales envoyées à l'API:", requestData);
                console.log("6. JSON stringifié:", JSON.stringify(requestData, null, 2));
            }

            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FAIRE_RETRAIT}`;
            const response = await fetch(url, {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify(requestData),
            });

            // Log de la réponse (développement uniquement)
            const responseText = await response.text();
            if (isDev) {
                console.log("7. Statut de la réponse:", response.status);
                console.log("8. Réponse brute de l'API:", responseText);
            }

            if (!response.ok) {
                if (response.status === 400) {
                    console.error("❌ Erreur 400 - Détails:", responseText);
                    let errorMessage = "Données invalides.";
                    try {
                        const errorData = JSON.parse(responseText);
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.error) {
                            errorMessage = errorData.error;
                        }
                    } catch {
                        errorMessage = `Données invalides. Détails: ${responseText}`;
                    }
                    throw new ApiError(errorMessage, 400);
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
            
            if (isDev) {
                console.log("✅ Retrait réussi:", result);
            }

            // Recharger les soldes après un retrait réussi
            await loadSoldes();

            // Toast de succès
            toast.success("Retrait effectué avec succès", {
                description: `Montant: ${data.montant} FCFA - ${frais} FCFA de frais`,
            });

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

    // Calculer le montant total disponible
    const getTotalSolde = (): number => {
        if (!soldes) return 0;
        return soldes.abonnement + soldes.demande_de_messe + 
               soldes.denier_de_culte + soldes.fnc + soldes.don;
    };

    // Obtenir les informations d'un sous-compte
    const getSousCompteInfo = (field: string) => {
        const labels: { [key: string]: string } = {
            "abonnement": "Abonnement",
            "demande_de_messe": "Demande de messe",
            "denier_de_culte": "Denier de culte",
            "fnc": "Fnc",
            "don": "Don",
        };

        return {
            field,
            label: labels[field] || field,
            solde: getSoldeForCompte(field),
        };
    };

    return {
        // Actions principales
        faireRetrait,
        loadSoldes,
        
        // États
        loading,
        error,
        setError,
        soldes,
        loadingSoldes,
        
        // Utilitaires
        getSoldeForCompte,
        getTotalSolde,
        getSousCompteInfo,
        calculateFrais,
        
        // Validation
        validateRetraitData,
    };
}