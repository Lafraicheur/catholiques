// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-html-link-for-pages */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// // services/evenement-services.ts
// import {
//     ApiError,
//     AuthenticationError,
//     ForbiddenError,
//     NotFoundError
// } from "./api";
// import { debugEvenementData, debugApiPayload, cleanEvenementData } from "@/lib/debug-evenement";


// const API_URL_STATISTIQUE = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

// // Interface pour l'image
// interface EvenementImage {
//     access: string;
//     path: string;
//     name: string;
//     type: string;
//     size: number;
//     mime: string;
//     meta: Record<string, any>;
//     url: string;
// }

// // Interface pour l'événement
// export interface Evenement {
//     id: number;
//     created_at: string;
//     libelle: string;
//     type: "ACTIVITÉ" | "FORMATION" | "COLLECTE" | "CÉLÉBRATION";
//     solde: number;
//     solde_cible: number;
//     description: string;
//     date_de_debut: number; // timestamp
//     date_de_fin: number; // timestamp
//     solde_est_visibe: boolean;
//     type_visibilite_solde: string;
//     est_limite_par_echeance: boolean;
//     est_actif: boolean;
//     extras: Record<string, any>;
//     diocese_id: number;
//     paroisse_id: number;
//     mouvementassociation_id: number;
//     ceb_id: number;
//     image?: EvenementImage;
// }

// // Interface pour la réponse de l'API
// interface EvenementDetailsResponse {
//     item: Evenement;
// }

// /**
//  * Récupère les détails d'un événement par son ID
//  * @param {number} evenementId - L'ID de l'événement
//  * @returns {Promise<Object>} Promise<Evenement>
//  */
// export async function fetchEvenementDetails(evenementId: number): Promise<object> {
//     try {
//         // Récupérer le token d'authentification depuis le localStorage ou les cookies
//         const token = localStorage.getItem('auth_token'); // Ajustez selon votre implémentation

//         if (!token) {
//             throw new AuthenticationError("Token d'authentification manquant");
//         }

//         const response = await fetch(`${API_URL_STATISTIQUE}/evenements/obtenir-un?evenement_id=${evenementId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // Ajustez selon votre format d'auth
//             },
//         });

//         // Gérer les différents codes de statut
//         if (response.status === 401) {
//             throw new AuthenticationError("Session expirée. Veuillez vous reconnecter.");
//         }

//         if (response.status === 403) {
//             throw new ForbiddenError("Accès refusé. Privilèges insuffisants.");
//         }

//         if (response.status === 404) {
//             throw new NotFoundError("Événement non trouvé.");
//         }

//         if (response.status === 429) {
//             throw new ApiError("Trop de requêtes. Veuillez réessayer plus tard.", response.status);
//         }

//         if (response.status >= 500) {
//             throw new ApiError("Erreur serveur. Veuillez réessayer plus tard.", response.status);
//         }

//         if (!response.ok) {
//             throw new ApiError(`Erreur ${response.status}: ${response.statusText}`, response.status);
//         }

//         const data: EvenementDetailsResponse = await response.json();

//         if (!data.item) {
//             throw new NotFoundError("Données de l'événement non trouvées dans la réponse.");
//         }

//         return data.item;

//     } catch (error) {
//         // Si c'est déjà une erreur personnalisée, la relancer
//         if (error instanceof ApiError) {
//             throw error;
//         }

//         // Gérer les erreurs réseau
//         if (error instanceof TypeError && error.message === "Failed to fetch") {
//             throw new ApiError("Erreur de connexion. Vérifiez votre connexion internet.", 0);
//         }

//         // Gérer les autres erreurs
//         console.error("Erreur lors de la récupération des détails de l'événement:", error);
//         throw new ApiError("Une erreur inattendue s'est produite.", 500);
//     }
// }

// // Types pour les différents événements (même structure que dans le modal)
// type BaseEvenement = {
//     type: string;
//     dates: number[];
//     libelle: string;
//     description: string;
//     paroisse_id: number;
// };

// type DonEvenement = BaseEvenement & {
//     type: "DON";
//     est_actif: boolean;
//     date_de_fin: number;
//     solde_cible: number;
//     montant_par_paroissien: number;
//     est_limite_par_echeance: boolean;
// };

// type MesseEvenement = BaseEvenement & {
//     type: "MESSE";
//     type_messe: "ORDINAIRE" | "SPECIALE";
//     heure_de_fin: number;
//     heure_de_debut: number;
// };

// type ActiviteEvenement = BaseEvenement & {
//     type: "ACTIVITÉ";
//     est_actif: boolean;
//     montant_par_paroissien: number;
// };

// type CotisationEvenement = BaseEvenement & {
//     type: "COTISATION";
//     est_actif: boolean;
//     date_de_fin: number;
//     solde_cible: number;
//     montant_par_paroissien: number;
//     est_limite_par_echeance: boolean;
// };

// type InscriptionEvenement = BaseEvenement & {
//     type: "INSCRIPTION";
//     date_de_fin: number;
//     montant_par_paroissien: number;
//     est_limite_par_echeance: boolean;
// };

// type EvenementModification =
//     | DonEvenement
//     | MesseEvenement
//     | ActiviteEvenement
//     | CotisationEvenement
//     | InscriptionEvenement;

// /**
//  * Modifier un événement existant
//  * @param evenementId - ID de l'événement à modifier
//  * @param evenementData - Données de l'événement à modifier
//  * @returns Promise<any> - L'événement modifié
//  */
// export async function modifierEvenement(
//     evenementId: number,
//     evenementData: Partial<EvenementModification>
// ): Promise<any> {
//     try {
//         // Debug des données d'entrée
//         console.log("🚀 Début modification événement ID:", evenementId);

//         // Nettoyer les données d'entrée
//         const cleanedData = cleanEvenementData(evenementData);
//         console.log("🧹 Données nettoyées:", cleanedData);

//         // Récupérer le token d'authentification
//         const token = localStorage.getItem("auth_token");
//         if (!token) {
//             throw new AuthenticationError("Token d'authentification manquant");
//         }

//         // Préparer les données selon le type d'événement
//         const requestBody = prepareEvenementData(cleanedData);

//         // Debug du payload final
//         debugApiPayload(requestBody);

//         // Effectuer la requête POST vers l'API
//         const response = await fetch(`${API_URL_STATISTIQUE}/evenements/modifier`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`,
//             },
//             body: JSON.stringify(requestBody),
//         });

//         // Gestion des erreurs HTTP
//         if (!response.ok) {
//             switch (response.status) {
//                 case 400:
//                     const errorData = await response.json();
//                     throw new ApiError(`Erreur de validation: ${errorData.message || "Données invalides"}`, 400);
//                 case 401:
//                     throw new AuthenticationError("Session expirée. Veuillez vous reconnecter.");
//                 case 403:
//                     throw new ForbiddenError("Vous n'avez pas les droits pour modifier cet événement.");
//                 case 404:
//                     throw new NotFoundError("Événement non trouvé.");
//                 case 429:
//                     throw new ApiError("Trop de requêtes. Veuillez patienter.", 429);
//                 case 500:
//                     throw new ApiError("Erreur serveur. Veuillez réessayer plus tard.", 500);
//                 default:
//                     throw new ApiError(`Erreur HTTP ${response.status}`, response.status);
//             }
//         }

//         // Retourner les données de l'événement modifié
//         const result = await response.json();
//         return result.item || result;

//     } catch (error) {
//         // Re-lancer les erreurs personnalisées
//         if (error instanceof ApiError ||
//             error instanceof AuthenticationError ||
//             error instanceof ForbiddenError ||
//             error instanceof NotFoundError) {
//             throw error;
//         }

//         // Gestion des erreurs réseau ou autres
//         console.error("Erreur lors de la modification de l'événement:", error);
//         throw new ApiError("Erreur de connexion. Vérifiez votre connexion internet.", 0);
//     }
// }

// /**
//  * Préparer les données de l'événement selon son type
//  * @param evenementData - Données brutes de l'événement
//  * @returns Object - Données formatées pour l'API
//  */
// function prepareEvenementData(evenementData: Partial<EvenementModification>): any {
//     const { type } = evenementData;

//     if (!type) {
//         throw new Error("Le type d'événement est obligatoire");
//     }

//     // Structure de base commune
//     const baseData = {
//         type: evenementData.type,
//         dates: evenementData.dates || [],
//         libelle: evenementData.libelle?.trim(),
//         description: evenementData.description?.trim(),
//         paroisse_id: evenementData.paroisse_id,
//     };

//     // Selon le schéma de l'API, retourner directement l'objet avec la clé du type
//     switch (type) {
//         case "DON":
//             return {
//                 DON: {
//                     ...baseData,
//                     est_actif: (evenementData as DonEvenement).est_actif ?? true,
//                     date_de_fin: (evenementData as DonEvenement).date_de_fin || 0,
//                     solde_cible: (evenementData as DonEvenement).solde_cible || 0,
//                     montant_par_paroissien: (evenementData as DonEvenement).montant_par_paroissien || 0,
//                     est_limite_par_echeance: (evenementData as DonEvenement).est_limite_par_echeance ?? false,
//                 }
//             };

//         case "MESSE":
//             return {
//                 MESSE: {
//                     ...baseData,
//                     type_messe: (evenementData as MesseEvenement).type_messe || "ORDINAIRE",
//                     heure_de_debut: (evenementData as MesseEvenement).heure_de_debut || 0,
//                     heure_de_fin: (evenementData as MesseEvenement).heure_de_fin || 0,
//                 }
//             };

//         case "ACTIVITÉ":
//             return {
//                 "ACTIVITÉ": {
//                     ...baseData,
//                     est_actif: (evenementData as ActiviteEvenement).est_actif ?? true,
//                     montant_par_paroissien: (evenementData as ActiviteEvenement).montant_par_paroissien || 0,
//                 }
//             };

//         case "COTISATION":
//             return {
//                 COTISATION: {
//                     ...baseData,
//                     est_actif: (evenementData as CotisationEvenement).est_actif ?? true,
//                     date_de_fin: (evenementData as CotisationEvenement).date_de_fin || 0,
//                     solde_cible: (evenementData as CotisationEvenement).solde_cible || 0,
//                     montant_par_paroissien: (evenementData as CotisationEvenement).montant_par_paroissien || 0,
//                     est_limite_par_echeance: (evenementData as CotisationEvenement).est_limite_par_echeance ?? false,
//                 }
//             };

//         case "INSCRIPTION":
//             return {
//                 INSCRIPTION: {
//                     ...baseData,
//                     date_de_fin: (evenementData as InscriptionEvenement).date_de_fin || 0,
//                     montant_par_paroissien: (evenementData as InscriptionEvenement).montant_par_paroissien || 0,
//                     est_limite_par_echeance: (evenementData as InscriptionEvenement).est_limite_par_echeance ?? false,
//                 }
//             };

//         default:
//             throw new Error(`Type d'événement non supporté: ${type}`);
//     }
// }

// /**
//  * Valider les données d'un événement avant modification
//  * @param evenementData - Données à valider
//  * @returns boolean - true si valide, lance une erreur sinon
//  */
// export function validateEvenementData(evenementData: Partial<EvenementModification>): boolean {
//     const errors: string[] = [];

//     // Validations communes
//     if (!evenementData.libelle?.trim()) {
//         errors.push("Le libellé est obligatoire");
//     }

//     if (!evenementData.description?.trim()) {
//         errors.push("La description est obligatoire");
//     }

//     if (!evenementData.paroisse_id || evenementData.paroisse_id <= 0) {
//         errors.push("L'ID de la paroisse est obligatoire");
//     }

//     if (!evenementData.type) {
//         errors.push("Le type d'événement est obligatoire");
//     }

//     if (!evenementData.dates || evenementData.dates.length === 0) {
//         errors.push("Au moins une date est obligatoire");
//     }

//     // Validations spécifiques selon le type
//     switch (evenementData.type) {
//         case "MESSE":
//             const messeData = evenementData as MesseEvenement;
//             if (!messeData.type_messe) {
//                 errors.push("Le type de messe est obligatoire");
//             }
//             break;

//         case "DON":
//         case "COTISATION":
//             const financialData = evenementData as DonEvenement | CotisationEvenement;
//             if (financialData.solde_cible && financialData.solde_cible < 0) {
//                 errors.push("L'objectif ne peut pas être négatif");
//             }
//             if (financialData.montant_par_paroissien && financialData.montant_par_paroissien < 0) {
//                 errors.push("Le montant par paroissien ne peut pas être négatif");
//             }
//             break;
//     }

//     if (errors.length > 0) {
//         throw new Error(errors.join(", "));
//     }

//     return true;
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// services/evenement-services.ts
import {
    ApiError,
    AuthenticationError,
    ForbiddenError,
    NotFoundError
} from "./api";
import { debugEvenementData, debugApiPayload, cleanEvenementData } from "@/lib/debug-evenement";

const API_URL_STATISTIQUE = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

// Interface pour l'image d'événement
interface EvenementImage {
    url: string;
    access?: string;
    path?: string;
    name?: string;
    type?: string;
    size?: number;
    mime?: string;
    meta?: Record<string, any>;
}

// Interface pour la photo des participants
interface ParticipantPhoto {
    url: string;
    access?: string;
    path?: string;
    name?: string;
    type?: string;
    size?: number;
    mime?: string;
    meta?: Record<string, any>;
}

// Interface pour une option d'activité
interface ActivityOption {
    label: string;
    montant: number;
}

// Interface pour les extras selon le type d'événement
interface MesseExtras {
    type_messe: "ORDINAIRE" | "SPECIALE";
    heure_de_debut: number;
    heure_de_fin: number;
    prix_demande_de_messe?: number;
    lieu: string;
    options: ActivityOption[];
    categorie: string; // Flexible pour accepter différents formats
    est_gratuit: boolean;
}

interface ActiviteExtras {
    lieu: string;
    options: ActivityOption[];
    categorie: string; // Flexible pour accepter différents formats
    est_gratuit: boolean;
}

// Interface pour les informations du paroissien
interface Paroissien {
    id: number;
    nom: string;
    prenoms: string;
    genre?: "M" | "F";
    num_de_telephone?: string;
    statut?: string;
    photo?: ParticipantPhoto | null;
}

// Interface pour un participant (relation événement-paroissien)
interface Participant {
    id: number;
    created_at?: number;
    evenement_id: number;
    paroissien_id: number;
    option?: ActivityOption; // L'option choisie par le participant
    paroissien: Paroissien; // Les infos complètes du paroissien
}

// Interface pour l'événement (structure réelle de l'API)
export interface Evenement {
    id: number;
    created_at: number;
    libelle: string;
    type: "MESSE" | "ACTIVITÉ";
    solde: number;
    solde_cible?: number;
    description: string;
    date_de_debut: number; // timestamp
    date_de_fin?: number; // timestamp
    solde_est_visibe?: boolean;
    type_visibilite_solde?: string;
    est_limite_par_echeance?: boolean;
    est_actif?: boolean;
    extras: MesseExtras | ActiviteExtras;
    diocese_id?: number;
    paroisse_id?: number;
    mouvementassociation_id?: number;
    ceb_id?: number;
    image?: EvenementImage | null;
    participants?: Participant[]; // Structure corrigée
}

// Interface pour la réponse de l'API
interface EvenementDetailsResponse {
    item: Evenement;
}

/**
 * Récupère les détails d'un événement par son ID
 * @param {number} evenementId - L'ID de l'événement
 * @returns {Promise<Evenement>} Promise<Evenement>
 */
export async function fetchEvenementDetails(evenementId: number): Promise<Evenement> {
    try {
        // Récupérer le token d'authentification depuis le localStorage
        const token = localStorage.getItem('auth_token');

        if (!token) {
            throw new AuthenticationError("Token d'authentification manquant");
        }

        const response = await fetch(`${API_URL_STATISTIQUE}/evenements/obtenir-un?evenement_id=${evenementId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

// Types pour les modifications d'événements
type BaseEvenement = {
    evenement_id?: number;
    type: string;
    dates?: number[];
    libelle: string;
    description: string;
    paroisse_id: number;
};

type MesseEvenement = BaseEvenement & {
    type: "MESSE";
    type_messe: "ORDINAIRE" | "SPECIALE";
    heure_de_fin: number;
    heure_de_debut: number;
    prix_demande_de_messe?: number;
};

type ActiviteEvenement = BaseEvenement & {
    type: "ACTIVITÉ";
    lieu: string;
    options: ActivityOption[];
    categorie: string; // Plus flexible pour accepter différents formats
    est_gratuit: boolean;
    date_de_debut?: number;
    image?: File | string | null;
};

type EvenementModification = MesseEvenement | ActiviteEvenement;

/**
 * Modifier un événement existant
 * @param evenementId - ID de l'événement à modifier
 * @param evenementData - Données de l'événement à modifier
 * @returns Promise<Evenement> - L'événement modifié
 */
export async function modifierEvenement(
    evenementId: number,
    evenementData: Partial<EvenementModification>
): Promise<Evenement> {
    try {
        // Debug des données d'entrée
        console.log("🚀 Début modification événement ID:", evenementId);

        // Récupérer le token d'authentification
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new AuthenticationError("Token d'authentification manquant");
        }

        // Ajouter l'ID de l'événement aux données
        const dataWithId = {
            ...evenementData,
            evenement_id: evenementId
        };

        // Préparer les données selon le type d'événement
        const requestBody = prepareEvenementData(dataWithId);

        console.log("📤 Payload envoyé à l'API:", JSON.stringify(requestBody, null, 2));

        // Déterminer le type de contenu et préparer la requête
        let headers: HeadersInit = {
            "Authorization": `Bearer ${token}`,
        };

        let body: string | FormData;

        // Si c'est une activité avec une image, utiliser FormData
        if (evenementData.type === "ACTIVITÉ" && evenementData.image instanceof File) {
            const formData = new FormData();

            // Ajouter tous les champs sauf l'image
            Object.entries(requestBody).forEach(([key, value]) => {
                if (key !== 'image') {
                    if (typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            // Ajouter l'image
            formData.append('iimage', evenementData.image);

            body = formData;
            headers = {
                ...headers,
                // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
            };
        } else {
            // Utiliser JSON pour les autres cas
            headers = {
                ...headers,
                "Content-Type": "application/json",
            };
            body = JSON.stringify(requestBody);
        }

        // Effectuer la requête POST vers l'API
        const response = await fetch(`${API_URL_STATISTIQUE}/evenements/modifier`, {
            method: "POST",
            headers,
            body,
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
        evenement_id: evenementData.evenement_id,
        type: evenementData.type,
        libelle: evenementData.libelle?.trim(),
        description: evenementData.description?.trim(),
        paroisse_id: evenementData.paroisse_id,
    };

    // Ajouter les dates si présentes
    if (evenementData.dates && evenementData.dates.length > 0) {
        Object.assign(baseData, { dates: evenementData.dates });
    }

    // Selon le schéma de l'API, adapter les données selon le type
    switch (type) {
        case "MESSE":
            const messeData = evenementData as MesseEvenement;
            return {
                ...baseData,
                type_messe: messeData.type_messe || "ORDINAIRE",
                heure_de_debut: messeData.heure_de_debut || 0,
                heure_de_fin: messeData.heure_de_fin || 0,
                prix_demande_de_messe: messeData.prix_demande_de_messe || 0,
            };

        case "ACTIVITÉ":
            const activiteData = evenementData as ActiviteEvenement;
            const result = {
                ...baseData,
                lieu: activiteData.lieu?.trim() || "",
                categorie_activite: activiteData.categorie || "Détente",
                est_gratuit: activiteData.est_gratuit ?? false,
            };

            // Ajouter la date de début si présente
            if (activiteData.date_de_debut) {
                Object.assign(result, { date_de_debut: activiteData.date_de_debut });
            }

            // Ajouter les options si l'activité n'est pas gratuite
            if (!activiteData.est_gratuit && activiteData.options && activiteData.options.length > 0) {
                Object.assign(result, {
                    options: activiteData.options.map(opt => ({
                        label: opt.label.trim(),
                        montant: opt.montant
                    }))
                });
            }

            return result;

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

    if (!evenementData.paroisse_id || evenementData.paroisse_id <= 0) {
        errors.push("L'ID de la paroisse est obligatoire");
    }

    if (!evenementData.type) {
        errors.push("Le type d'événement est obligatoire");
    }

    // Validations spécifiques selon le type
    switch (evenementData.type) {
        case "MESSE":
            const messeData = evenementData as MesseEvenement;
            if (!messeData.type_messe) {
                errors.push("Le type de messe est obligatoire");
            }
            if (messeData.heure_de_debut && messeData.heure_de_fin &&
                messeData.heure_de_debut >= messeData.heure_de_fin) {
                errors.push("L'heure de fin doit être après l'heure de début");
            }
            break;

        case "ACTIVITÉ":
            const activiteData = evenementData as ActiviteEvenement;
            if (!activiteData.lieu?.trim()) {
                errors.push("Le lieu est obligatoire pour une activité");
            }
            if (!activiteData.categorie) {
                errors.push("La catégorie est obligatoire pour une activité");
            }
            if (!activiteData.est_gratuit && (!activiteData.options || activiteData.options.length === 0)) {
                errors.push("Au moins une option tarifaire est requise pour une activité payante");
            }
            if (activiteData.options) {
                for (const option of activiteData.options) {
                    if (!option.label?.trim()) {
                        errors.push("Tous les libellés d'options sont obligatoires");
                    }
                    if (option.montant < 0) {
                        errors.push("Le montant ne peut pas être négatif");
                    }
                }
            }
            break;
    }

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    }

    return true;
}

/**
 * Formater les données d'un événement pour l'affichage
 * @param evenement - Événement brut de l'API
 * @returns Evenement formaté
 */
export function formatEvenementForDisplay(evenement: Evenement): Evenement {
    // Créer une copie pour éviter de modifier l'original
    const formattedEvent = { ...evenement };

    // Formater les timestamps si nécessaire
    if (formattedEvent.created_at && String(formattedEvent.created_at).length <= 10) {
        formattedEvent.created_at = formattedEvent.created_at * 1000;
    }

    if (formattedEvent.date_de_debut && String(formattedEvent.date_de_debut).length <= 10) {
        formattedEvent.date_de_debut = formattedEvent.date_de_debut * 1000;
    }

    if (formattedEvent.date_de_fin && String(formattedEvent.date_de_fin).length <= 10) {
        formattedEvent.date_de_fin = formattedEvent.date_de_fin * 1000;
    }

    // Formater les heures dans les extras pour les messes
    if (formattedEvent.type === "MESSE" && formattedEvent.extras) {
        const messeExtras = formattedEvent.extras as MesseExtras;
        if (messeExtras.heure_de_debut && String(messeExtras.heure_de_debut).length <= 10) {
            messeExtras.heure_de_debut = messeExtras.heure_de_debut * 1000;
        }
        if (messeExtras.heure_de_fin && String(messeExtras.heure_de_fin).length <= 10) {
            messeExtras.heure_de_fin = messeExtras.heure_de_fin * 1000;
        }
    }

    return formattedEvent;
}

/**
 * Fonction helper pour obtenir la couleur selon la catégorie d'activité
 * @param categorie - La catégorie de l'activité
 * @returns string - Classes CSS pour le badge
 */
export function getCategorieColor(categorie: string): string {
    const categorieMap: Record<string, string> = {
        // Nouveaux formats
        "Détente": "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
        "Retraites": "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
        "Pèlérinage": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
        "Formations": "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
        // Anciens formats pour rétrocompatibilité
        "DETENTE": "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
        "RETRAITES": "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
        "PELERINAGE": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
        "FORMATIONS": "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    };

    return categorieMap[categorie] || "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
}

/**
 * Fonction helper pour vérifier si un événement est une messe
 * @param evenement - L'événement à vérifier
 * @returns boolean - true si c'est une messe
 */
export function isMesseEvent(
    evenement: Evenement
): evenement is Evenement & { extras: MesseExtras } {
    return evenement.type === "MESSE";
}

/**
 * Fonction helper pour vérifier si un événement est une activité
 * @param evenement - L'événement à vérifier  
 * @returns boolean - true si c'est une activité
 */
export function isActiviteEvent(
    evenement: Evenement
): evenement is Evenement & { extras: ActiviteExtras } {
    return evenement.type === "ACTIVITÉ";
}