// services/evenement-services.ts
import {
    ApiError,
    AuthenticationError,
    ForbiddenError,
    NotFoundError
} from "./api";
import { debugEvenementData, debugApiPayload, cleanEvenementData } from "@/lib/debug-evenement";


const API_URL_STATISTIQUE = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

// Interface pour l'image
interface EvenementImage {
    access: string;
    path: string;
    name: string;
    type: string;
    size: number;
    mime: string;
    meta: Record<string, any>;
    url: string;
}

// Interface pour l'événement
export interface Evenement {
    id: number;
    created_at: string;
    libelle: string;
    type: "ACTIVITÉ" | "FORMATION" | "COLLECTE" | "CÉLÉBRATION";
    solde: number;
    solde_cible: number;
    description: string;
    date_de_debut: number; // timestamp
    date_de_fin: number; // timestamp
    solde_est_visibe: boolean;
    type_visibilite_solde: string;
    est_limite_par_echeance: boolean;
    est_actif: boolean;
    extras: Record<string, any>;
    diocese_id: number;
    paroisse_id: number;
    mouvementassociation_id: number;
    ceb_id: number;
    image?: EvenementImage;
}

// Interface pour la réponse de l'API
interface EvenementDetailsResponse {
    item: Evenement;
}

/**
 * Récupère les détails d'un événement par son ID
 * @param {number} evenementId - L'ID de l'événement
 * @returns {Promise<Object>} Promise<Evenement>
 */
export async function fetchEvenementDetails(evenementId: number): Promise<object> {
    try {
        // Récupérer le token d'authentification depuis le localStorage ou les cookies
        const token = localStorage.getItem('auth_token'); // Ajustez selon votre implémentation

        if (!token) {
            throw new AuthenticationError("Token d'authentification manquant");
        }

        const response = await fetch(`${API_URL_STATISTIQUE}/evenements/obtenir-un?evenement_id=${evenementId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Ajustez selon votre format d'auth
            },
        });

        // Gérer les différents codes de statut
        if (response.status === 401) {
            throw new AuthenticationError("Session expirée. Veuillez vous reconnecter.");
        }

        if (response.status === 403) {
            throw new ForbiddenError("Accès refusé. Privilèges insuffisants.");
        }

        if (response.status === 404) {
            throw new NotFoundError("Événement non trouvé.");
        }

        if (response.status === 429) {
            throw new ApiError("Trop de requêtes. Veuillez réessayer plus tard.", response.status);
        }

        if (response.status >= 500) {
            throw new ApiError("Erreur serveur. Veuillez réessayer plus tard.", response.status);
        }

        if (!response.ok) {
            throw new ApiError(`Erreur ${response.status}: ${response.statusText}`, response.status);
        }

        const data: EvenementDetailsResponse = await response.json();

        if (!data.item) {
            throw new NotFoundError("Données de l'événement non trouvées dans la réponse.");
        }

        return data.item;

    } catch (error) {
        // Si c'est déjà une erreur personnalisée, la relancer
        if (error instanceof ApiError) {
            throw error;
        }

        // Gérer les erreurs réseau
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            throw new ApiError("Erreur de connexion. Vérifiez votre connexion internet.", 0);
        }

        // Gérer les autres erreurs
        console.error("Erreur lors de la récupération des détails de l'événement:", error);
        throw new ApiError("Une erreur inattendue s'est produite.", 500);
    }
}

// Types pour les différents événements (même structure que dans le modal)
type BaseEvenement = {
    type: string;
    dates: number[];
    libelle: string;
    description: string;
    paroisse_id: number;
};

type DonEvenement = BaseEvenement & {
    type: "DON";
    est_actif: boolean;
    date_de_fin: number;
    solde_cible: number;
    montant_par_paroissien: number;
    est_limite_par_echeance: boolean;
};

type MesseEvenement = BaseEvenement & {
    type: "MESSE";
    type_messe: "ORDINAIRE" | "SPECIALE";
    heure_de_fin: number;
    heure_de_debut: number;
};

type ActiviteEvenement = BaseEvenement & {
    type: "ACTIVITÉ";
    est_actif: boolean;
    montant_par_paroissien: number;
};

type CotisationEvenement = BaseEvenement & {
    type: "COTISATION";
    est_actif: boolean;
    date_de_fin: number;
    solde_cible: number;
    montant_par_paroissien: number;
    est_limite_par_echeance: boolean;
};

type InscriptionEvenement = BaseEvenement & {
    type: "INSCRIPTION";
    date_de_fin: number;
    montant_par_paroissien: number;
    est_limite_par_echeance: boolean;
};

type EvenementModification =
    | DonEvenement
    | MesseEvenement
    | ActiviteEvenement
    | CotisationEvenement
    | InscriptionEvenement;

/**
 * Modifier un événement existant
 * @param evenementId - ID de l'événement à modifier
 * @param evenementData - Données de l'événement à modifier
 * @returns Promise<any> - L'événement modifié
 */
export async function modifierEvenement(
    evenementId: number,
    evenementData: Partial<EvenementModification>
): Promise<any> {
    try {
        // Debug des données d'entrée
        console.log("🚀 Début modification événement ID:", evenementId);

        // Nettoyer les données d'entrée
        const cleanedData = cleanEvenementData(evenementData);
        console.log("🧹 Données nettoyées:", cleanedData);

        // Récupérer le token d'authentification
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new AuthenticationError("Token d'authentification manquant");
        }

        // Préparer les données selon le type d'événement
        const requestBody = prepareEvenementData(cleanedData);

        // Debug du payload final
        debugApiPayload(requestBody);

        // Effectuer la requête POST vers l'API
        const response = await fetch(`${API_URL_STATISTIQUE}/evenements/modifier`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        });

        // Gestion des erreurs HTTP
        if (!response.ok) {
            switch (response.status) {
                case 400:
                    const errorData = await response.json();
                    throw new ApiError(`Erreur de validation: ${errorData.message || "Données invalides"}`, 400);
                case 401:
                    throw new AuthenticationError("Session expirée. Veuillez vous reconnecter.");
                case 403:
                    throw new ForbiddenError("Vous n'avez pas les droits pour modifier cet événement.");
                case 404:
                    throw new NotFoundError("Événement non trouvé.");
                case 429:
                    throw new ApiError("Trop de requêtes. Veuillez patienter.", 429);
                case 500:
                    throw new ApiError("Erreur serveur. Veuillez réessayer plus tard.", 500);
                default:
                    throw new ApiError(`Erreur HTTP ${response.status}`, response.status);
            }
        }

        // Retourner les données de l'événement modifié
        const result = await response.json();
        return result.item || result;

    } catch (error) {
        // Re-lancer les erreurs personnalisées
        if (error instanceof ApiError ||
            error instanceof AuthenticationError ||
            error instanceof ForbiddenError ||
            error instanceof NotFoundError) {
            throw error;
        }

        // Gestion des erreurs réseau ou autres
        console.error("Erreur lors de la modification de l'événement:", error);
        throw new ApiError("Erreur de connexion. Vérifiez votre connexion internet.", 0);
    }
}

/**
 * Préparer les données de l'événement selon son type
 * @param evenementData - Données brutes de l'événement
 * @returns Object - Données formatées pour l'API
 */
function prepareEvenementData(evenementData: Partial<EvenementModification>): any {
    const { type } = evenementData;

    if (!type) {
        throw new Error("Le type d'événement est obligatoire");
    }

    // Structure de base commune
    const baseData = {
        type: evenementData.type,
        dates: evenementData.dates || [],
        libelle: evenementData.libelle?.trim(),
        description: evenementData.description?.trim(),
        paroisse_id: evenementData.paroisse_id,
    };

    // Selon le schéma de l'API, retourner directement l'objet avec la clé du type
    switch (type) {
        case "DON":
            return {
                DON: {
                    ...baseData,
                    est_actif: (evenementData as DonEvenement).est_actif ?? true,
                    date_de_fin: (evenementData as DonEvenement).date_de_fin || 0,
                    solde_cible: (evenementData as DonEvenement).solde_cible || 0,
                    montant_par_paroissien: (evenementData as DonEvenement).montant_par_paroissien || 0,
                    est_limite_par_echeance: (evenementData as DonEvenement).est_limite_par_echeance ?? false,
                }
            };

        case "MESSE":
            return {
                MESSE: {
                    ...baseData,
                    type_messe: (evenementData as MesseEvenement).type_messe || "ORDINAIRE",
                    heure_de_debut: (evenementData as MesseEvenement).heure_de_debut || 0,
                    heure_de_fin: (evenementData as MesseEvenement).heure_de_fin || 0,
                }
            };

        case "ACTIVITÉ":
            return {
                "ACTIVITÉ": {
                    ...baseData,
                    est_actif: (evenementData as ActiviteEvenement).est_actif ?? true,
                    montant_par_paroissien: (evenementData as ActiviteEvenement).montant_par_paroissien || 0,
                }
            };

        case "COTISATION":
            return {
                COTISATION: {
                    ...baseData,
                    est_actif: (evenementData as CotisationEvenement).est_actif ?? true,
                    date_de_fin: (evenementData as CotisationEvenement).date_de_fin || 0,
                    solde_cible: (evenementData as CotisationEvenement).solde_cible || 0,
                    montant_par_paroissien: (evenementData as CotisationEvenement).montant_par_paroissien || 0,
                    est_limite_par_echeance: (evenementData as CotisationEvenement).est_limite_par_echeance ?? false,
                }
            };

        case "INSCRIPTION":
            return {
                INSCRIPTION: {
                    ...baseData,
                    date_de_fin: (evenementData as InscriptionEvenement).date_de_fin || 0,
                    montant_par_paroissien: (evenementData as InscriptionEvenement).montant_par_paroissien || 0,
                    est_limite_par_echeance: (evenementData as InscriptionEvenement).est_limite_par_echeance ?? false,
                }
            };

        default:
            throw new Error(`Type d'événement non supporté: ${type}`);
    }
}

/**
 * Valider les données d'un événement avant modification
 * @param evenementData - Données à valider
 * @returns boolean - true si valide, lance une erreur sinon
 */
export function validateEvenementData(evenementData: Partial<EvenementModification>): boolean {
    const errors: string[] = [];

    // Validations communes
    if (!evenementData.libelle?.trim()) {
        errors.push("Le libellé est obligatoire");
    }

    if (!evenementData.description?.trim()) {
        errors.push("La description est obligatoire");
    }

    if (!evenementData.paroisse_id || evenementData.paroisse_id <= 0) {
        errors.push("L'ID de la paroisse est obligatoire");
    }

    if (!evenementData.type) {
        errors.push("Le type d'événement est obligatoire");
    }

    if (!evenementData.dates || evenementData.dates.length === 0) {
        errors.push("Au moins une date est obligatoire");
    }

    // Validations spécifiques selon le type
    switch (evenementData.type) {
        case "MESSE":
            const messeData = evenementData as MesseEvenement;
            if (!messeData.type_messe) {
                errors.push("Le type de messe est obligatoire");
            }
            break;

        case "DON":
        case "COTISATION":
            const financialData = evenementData as DonEvenement | CotisationEvenement;
            if (financialData.solde_cible && financialData.solde_cible < 0) {
                errors.push("L'objectif ne peut pas être négatif");
            }
            if (financialData.montant_par_paroissien && financialData.montant_par_paroissien < 0) {
                errors.push("Le montant par paroissien ne peut pas être négatif");
            }
            break;
    }

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    }

    return true;
}