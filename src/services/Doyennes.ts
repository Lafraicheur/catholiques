/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL_STATISTIQUEDIOCESE || "https://api.cathoconnect.ci/api:O-UjMCtX";

// Types pour les doyennes
interface Doyen {
    id?: number;
    nom?: string;
    prenoms?: string;
    num_de_telephone?: string;
}

interface Cure {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
}

interface Siege {
    id?: number;
    created_at?: string;
    nom?: string;
    pays?: 'COTE D\'IVOIRE';
    ville?: 'ABIDJAN';
    quartier?: string;
    statut?: 'Paroisse';
    photo?: {
        url?: string;
    };
    localisation?: string;
}

interface Localisation {
    type: string;
    data: {
        lng: number;
        lat: number;
    };
}

interface Paroisse {
    id: number;
    created_at: number;
    nom: string;
    pays: 'COTE D\'IVOIRE' | 'COE D\'IVOIRE'; // Gestion de la typo dans les données
    ville: 'ABIDJAN';
    quartier: string | null;
    statut: 'Paroisse' | 'Quasi-Paroisse';
    vicaires_id: number[];
    administrateur_id: number | null;
    cure_id: number | null;
    doyenne_id: number;
    vicariatsecteur_id: number | null;
    photo: any | null;
    localisation: Localisation | null;
}

interface Organisation {
    cure_doyen: Cure;
    cures: Cure[];
}

interface Doyenne {
    id?: number;
    created_at?: number | string;
    nom?: string;
    siege_id?: number | null;
    doyen_id?: number;
    vicariatsecteur_id?: number;
    doyen?: Doyen;
    siege?: Siege;
}

interface DoyenneDetails {
    doyenne: {
        id: number;
        created_at: number;
        nom: string;
        siege_id: number | null;
        doyen_id: number;
        vicariatsecteur_id: number;
    };
    organisation: Organisation;
    paroisses: Paroisse[];
}

interface DoyennesApiResponse {
    items: Doyenne[];
}

interface DoyenneDetailsResponse {
    doyenne: {
        id: number;
        created_at: number;
        nom: string;
        siege_id: number | null;
        doyen_id: number;
        vicariatsecteur_id: number;
    };
    organisation: Organisation;
    paroisses: Paroisse[];
}

// Fonction utilitaire pour formater les dates depuis les timestamps
export const formatTimestamp = (timestamp: number | string | null | undefined): string => {
    if (!timestamp) return "Non renseignée";
    
    try {
        const date = new Date(typeof timestamp === 'number' ? timestamp : parseInt(timestamp.toString()));
        return new Intl.DateTimeFormat("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    } catch (err) {
        console.error("Erreur lors du formatage du timestamp:", err);
        return timestamp.toString();
    }
};

// Fonction utilitaire pour obtenir le nom complet d'un curé/doyen
export const getFullName = (person: { nom?: string; prenoms?: string } | null | undefined): string => {
    if (!person) return "Non assigné";
    return `${person.nom || ""} ${person.prenoms || ""}`.trim() || "Non renseigné";
};

// Fonction utilitaire pour formater la localisation
export const formatLocalisation = (localisation: Localisation | null | undefined): string => {
    if (!localisation || !localisation.data) return "Non spécifiée";
    return `${localisation.data.lat.toFixed(5)}, ${localisation.data.lng.toFixed(5)}`;
};

// Classes d'erreurs (réutilisées)
export class ApiError extends Error {
    statusCode: number;
    status: number | undefined;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

export class AuthenticationError extends ApiError {
    constructor(message = 'Authentification requise') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Accès refusé. Droits insuffisants.') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Ressource non trouvée') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class RateLimitError extends ApiError {
    constructor(message = 'Trop de requêtes. Veuillez réessayer plus tard.') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}

export class ValidationError extends ApiError {
    constructor(message = 'Erreur de validation des données') {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

// Fonction pour récupérer toutes les doyennes d'un diocèse
export const fetchDoyennes = async (dioceseId: number): Promise<Doyenne[]> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!dioceseId || dioceseId <= 0) {
        throw new ValidationError('ID du diocèse invalide');
    }

    try {
        const response = await axios.get<DoyennesApiResponse>(
            `${API_URL}/doyenne/obtenir-tous`,
            {
                params: { diocese_id: dioceseId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.items || [];
    } catch (error) {
        handleApiError(error);
        return [];
    }
};

// Fonction pour récupérer les détails d'une doyenne spécifique
export const fetchDoyenneDetails = async (doyenneId: number): Promise<DoyenneDetails> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!doyenneId || doyenneId <= 0) {
        throw new ValidationError('ID de la doyenne invalide');
    }

    try {
        const response = await axios.get<DoyenneDetailsResponse>(
            `${API_URL}/doyenne/obtenir-un`,
            {
                params: { doyenne_id: doyenneId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            doyenne: response.data.doyenne,
            organisation: response.data.organisation,
            paroisses: response.data.paroisses
        };
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

// Fonction pour récupérer les doyennes d'un vicariat/secteur spécifique
export const fetchDoyennesByVicariat = async (vicariatSecteurId: number): Promise<Doyenne[]> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!vicariatSecteurId || vicariatSecteurId <= 0) {
        throw new ValidationError('ID du vicariat/secteur invalide');
    }

    try {
        const response = await axios.get<DoyennesApiResponse>(
            `${API_URL}/doyenne/obtenir-par-vicariat`,
            {
                params: { vicariatsecteur_id: vicariatSecteurId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.items || [];
    } catch (error) {
        handleApiError(error);
        return [];
    }
};

// Fonction pour créer une nouvelle doyenne
export const createDoyenne = async (doyenneData: Partial<Doyenne>): Promise<Doyenne> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!doyenneData.nom || !doyenneData.siege_id || !doyenneData.doyen_id || !doyenneData.vicariatsecteur_id) {
        throw new ValidationError('Données de la doyenne incomplètes');
    }

    try {
        const response = await axios.post<Doyenne>(
            `${API_URL}/doyenne/creer`,
            doyenneData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

// Fonction pour mettre à jour une doyenne
export const updateDoyenne = async (doyenneId: number, doyenneData: Partial<Doyenne>): Promise<Doyenne> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!doyenneId || doyenneId <= 0) {
        throw new ValidationError('ID de la doyenne invalide');
    }

    try {
        const response = await axios.put<Doyenne>(
            `${API_URL}/doyenne/modifier`,
            { ...doyenneData, id: doyenneId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

// Fonction pour supprimer une doyenne
export const deleteDoyenne = async (doyenneId: number): Promise<boolean> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!doyenneId || doyenneId <= 0) {
        throw new ValidationError('ID de la doyenne invalide');
    }

    try {
        await axios.delete(
            `${API_URL}/doyenne/supprimer`,
            {
                params: { doyenne_id: doyenneId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return true;
    } catch (error) {
        handleApiError(error);
        return false;
    }
};

// Fonction de gestion des erreurs
function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status || 500;
        const errorMessage =
            (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
                ? (axiosError.response.data as { message?: string }).message
                : undefined) ||
            axiosError.message ||
            'Une erreur est survenue';

        switch (statusCode) {
            case 400:
                throw new ValidationError(errorMessage);
            case 401:
                throw new AuthenticationError(errorMessage);
            case 403:
                throw new ForbiddenError(errorMessage);
            case 404:
                throw new NotFoundError(errorMessage);
            case 429:
                throw new RateLimitError(errorMessage);
            default:
                throw new ApiError(errorMessage, statusCode);
        }
    } else if (error instanceof Error) {
        throw new ApiError(error.message, 500);
    } else {
        throw new ApiError('Une erreur inconnue est survenue', 500);
    }
}

// Export des types pour les utiliser dans d'autres fichiers
export type { Doyenne, DoyenneDetails, Doyen, Siege, Paroisse, Cure, Organisation, Localisation };