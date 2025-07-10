/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL_STATISTIQUEDIOCESE || "https://api.cathoconnect.ci/api:O-UjMCtX";

// Types pour les vicariats/secteurs
interface VicariatSecteur {
    id?: number;
    created_at?: string;
    nom?: string;
    siege_id?: number;
    vicaire_episcopal_id?: number;
    diocese_id?: number;
    vicaire_episcopal?: {
        id?: number;
        nom?: string;
        prenoms?: string;
    };
    siege?: {
        id?: number;
        nom?: string;
        pays?: 'COTE D\'IVOIRE';
        ville?: 'ABIDJAN';
        quartier?: string;
        statut?: 'Paroisse';
        photo?: {
            url?: string;
        };
        localisation?: string;
    };
}

interface VicariatDetails {
    vicariat: {
        id: number;
        created_at: string;
        nom: string;
        siege_id: number;
        vicaire_episcopal_id: number;
        diocese_id: number;
        siege: {
            id: number;
            created_at: string;
            nom: string;
            pays: 'COTE D\'IVOIRE';
            ville: 'ABIDJAN';
            quartier: string;
            statut: 'Paroisse';
            administrateur_id: number;
            cure_id: number;
            photo?: {
                url: string;
            };
            localisation: string;
        };
    };
    organisation: string | {
        vicaire_episcopal?: any;
        cure_doyens?: any;
        [key: string]: any;
    };
    doyennes: Array<{
        id: number;
        created_at: string;
        nom: string;
        siege_id: number;
        doyen_id: number;
        vicariatsecteur_id: number;
    }>;
    paroisses: Array<{
        id: number;
        created_at: string;
        nom: string;
        pays: 'COTE D\'IVOIRE';
        ville: 'ABIDJAN';
        quartier: string;
        statut: 'Paroisse';
        vicaires_id: number[];
        administrateur_id: number;
        cure_id: number;
        doyenne_id: number;
        vicariatsecteur_id: number;
        photo?: {
            access: string;
            path: string;
            name: string;
            type: string;
            size: number;
            mime: string;
            meta: any;
            url: string;
        };
        localisation: string;
    }>;
}

interface VicariatsApiResponse {
    items: VicariatSecteur[];
}

interface VicariatDetailsResponse {
    vicariat: VicariatDetails['vicariat'];
    organisation: string;
    doyennes: VicariatDetails['doyennes'];
    paroisses: VicariatDetails['paroisses'];
}

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

// Fonction pour récupérer tous les vicariats/secteurs d'un diocèse
export const fetchVicariats = async (dioceseId: number): Promise<VicariatSecteur[]> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    try {
        const response = await axios.get<VicariatsApiResponse>(
            `${API_URL}/vicariatsecteur/obtenir-tous`,
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

// Fonction pour récupérer les détails d'un vicariat/secteur spécifique
export const fetchVicariatDetails = async (vicariatId: number): Promise<VicariatDetails> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    try {
        const response = await axios.get<VicariatDetailsResponse>(
            `${API_URL}/vicariatsecteur/obtenir-un`,
            {
                params: { vicariatsecteur_id: vicariatId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            vicariat: response.data.vicariat,
            organisation: response.data.organisation,
            doyennes: response.data.doyennes,
            paroisses: response.data.paroisses
        };
    } catch (error) {
        handleApiError(error);
        throw error;
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
export type { VicariatSecteur, VicariatDetails };