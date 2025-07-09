/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

// Types pour les deniers de culte - CORRIGÉ avec les 3 statuts
interface DenierCulte {
    id: number;
    created_at: string;
    annee: number;
    montant: number;
    statut: 'PAYE' | 'EN ATTENTE' | 'REJETE'; // CORRIGÉ : Suppression de 'VALIDE'
    date_de_paiement: number;
    date_de_validation: number;
    motif_de_rejet: string | null;
    paroissien_id: number;
    paroisse_id: number;
    chapelle_id: number;
    certificateur_id: number | null;
    paroissien: {
        id: number;
        nom: string;
        prenoms: string;
        genre: 'M' | 'F';
        num_de_telephone: string;
        statut: string;
        photo?: {
            url: string;
        };
    };
    certificateur?: {
        id: number;
        nom: string;
        prenoms: string;
        num_de_telephone: string;
    };
}

interface DeniersApiResponse {
    items: DenierCulte[];
}

interface ApiActionResponse {
    item: string;
}

// Classes d'erreurs
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

// Fonction pour récupérer tous les deniers de culte d'une paroisse
export const fetchDeniersCulte = async (paroisseId: number): Promise<DenierCulte[]> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    try {
        const response = await axios.get<DeniersApiResponse>(
            `${API_URL}/denierdeculte/obtenir-tous`,
            {
                params: { paroisse_id: paroisseId },
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

// Fonction pour valider un denier de culte
// IMPORTANT : Cette fonction change le statut de "EN ATTENTE" vers "PAYE"
export const validerDenierCulte = async (denierId: number): Promise<string> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    try {
        const response = await axios.post<ApiActionResponse>(
            `${API_URL}/denierdeculte/valider`,
            {
                denierdeculte_id: denierId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.item;
    } catch (error) {
        handleApiError(error);
        return '';
    }
};

// Fonction pour rejeter un denier de culte
// IMPORTANT : Cette fonction change le statut de "EN ATTENTE" vers "REJETE"
export const rejeterDenierCulte = async (
    denierId: number,
    motifRejet: string
): Promise<string> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!motifRejet.trim()) {
        throw new ValidationError('Le motif de rejet est requis');
    }

    try {
        const response = await axios.post<ApiActionResponse>(
            `${API_URL}/denierdeculte/rejeter`,
            {
                denierdeculte_id: denierId,
                motif_de_rejet: motifRejet.trim()
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.item;
    } catch (error) {
        handleApiError(error);
        return '';
    }
};

// Fonction de gestion des erreurs
function handleApiError(error: unknown): never {
    // Vérifier si c'est une erreur Axios
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status || 500;
        const errorMessage =
            (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
                ? (axiosError.response.data as { message?: string }).message
                : undefined) ||
            axiosError.message ||
            'Une erreur est survenue';

        // Gérer les différents codes d'erreur
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
        // Pour les erreurs JavaScript standard
        throw new ApiError(error.message, 500);
    } else {
        // Pour tout autre type d'erreur
        throw new ApiError('Une erreur inconnue est survenue', 500);
    }
}

// Export du type pour l'utiliser dans d'autres fichiers
export type { DenierCulte };