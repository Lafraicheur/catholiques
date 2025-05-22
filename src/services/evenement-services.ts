// services/evenement-services.ts
import {
    ApiError,
    AuthenticationError,
    ForbiddenError,
    NotFoundError
} from "./api";

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