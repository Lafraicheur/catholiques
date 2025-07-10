/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL_STATISTIQUEDIOCESE || "https://api.cathoconnect.ci/api:O-UjMCtX";

// Types pour les paroisses
interface Cure {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
}

interface Administrateur {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
}

interface PhotoParoisse {
    access: string;
    path: string;
    name: string;
    type: string;
    size: number;
    mime: string;
    meta: any;
    url: string;
}

interface Localisation {
    type: string;
    data: {
        lng: number;
        lat: number;
    };
}

interface PhotoParoissien {
    url: string;
}

interface Paroissien {
    id: number;
    nom: string;
    prenoms: string;
    genre: 'M' | 'F';
    num_de_telephone: string;
    est_abonne: boolean;
    date_de_fin_abonnement: number;
    statut: 'Aucun' | string; // Peut avoir d'autres statuts
    photo?: PhotoParoissien;
}

interface Paroisse {
    id: number;
    created_at: string | number;
    nom: string;
    pays: 'COTE D\'IVOIRE';
    ville: 'ABIDJAN';
    quartier: string;
    statut: 'Paroisse' | 'Quasi-Paroisse' | string;
    vicaires_id: number[];
    administrateur_id: number;
    cure_id: number;
    doyenne_id: number;
    vicariatsecteur_id: number;
    photo?: PhotoParoisse;
    localisation: Localisation | null;
    cure?: Cure;
    administrateur?: Administrateur;
}

interface Vicaire {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
}

interface Organisation {
    cure: Cure;
    vicaires: Vicaire[];
}

interface ParoisseDetails {
    paroisse: {
        id: number;
        created_at: string | number;
        nom: string;
        pays: 'COTE D\'IVOIRE';
        ville: 'ABIDJAN';
        quartier: string;
        statut: 'Paroisse' | 'Quasi-Paroisse' | string;
        vicaires_id: number[];
        administrateur_id: number;
        cure_id: number;
        doyenne_id: number;
        vicariatsecteur_id: number;
        photo?: PhotoParoisse;
        localisation: string;
    };
    paroissiens: Paroissien[];
    organisation: Organisation;
}

interface ParoissesApiResponse {
    items: Paroisse[];
}

interface ParoisseDetailsResponse {
    paroisse: ParoisseDetails['paroisse'];
    paroissiens: Paroissien[];
    organisation: Organisation;
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

// Fonctions utilitaires
export const formatTimestamp = (timestamp: number | string | null | undefined): string => {
    if (!timestamp) return "Non renseignée";

    try {
        const date = new Date(typeof timestamp === 'number' ? timestamp : parseInt(timestamp.toString()));
        return new Intl.DateTimeFormat("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC", // ou "Africa/Abidjan" selon le besoin

        }).format(date);
    } catch (err) {
        console.error("Erreur lors du formatage du timestamp:", err);
        return timestamp.toString();
    }
};

export const getFullName = (person: { nom?: string; prenoms?: string } | null | undefined): string => {
    if (!person) return "Non assigné";
    return `${person.nom || ""} ${person.prenoms || ""}`.trim() || "Non renseigné";
};

export const formatLocalisation = (localisation: Localisation | null | undefined): string => {
    if (!localisation || !localisation.data) return "Non spécifiée";
    return `${localisation.data.lat.toFixed(5)}, ${localisation.data.lng.toFixed(5)}`;
};

export const formatGenre = (genre: 'M' | 'F' | string): string => {
    switch (genre) {
        case 'M':
            return 'Masculin';
        case 'F':
            return 'Féminin';
        default:
            return genre || 'Non spécifié';
    }
};

export const formatStatutAbonnement = (estAbonne: boolean, dateFinAbonnement: number | null): string => {
    if (!estAbonne) return 'Non abonné';

    if (!dateFinAbonnement) return 'Abonné';

    const dateFin = new Date(dateFinAbonnement);
    const maintenant = new Date();

    if (dateFin < maintenant) {
        return 'Abonnement expiré';
    }

    return `Abonné jusqu'au ${dateFin.toLocaleDateString('fr-FR')}`;
};

// Fonction utilitaire pour vérifier si une organisation est complète
export const isOrganisationComplete = (organisation: Organisation | null | undefined): boolean => {
    if (!organisation) return false;
    return !!(organisation.cure && organisation.cure.nom && organisation.cure.prenoms);
};

// Fonction utilitaire pour obtenir le nombre total de responsables dans une paroisse
export const getTotalResponsables = (organisation: Organisation | null | undefined): number => {
    if (!organisation) return 0;

    let total = 0;
    if (organisation.cure && organisation.cure.nom) total += 1;
    if (organisation.vicaires && Array.isArray(organisation.vicaires)) {
        total += organisation.vicaires.length;
    }

    return total;
};

// Fonction pour récupérer toutes les paroisses d'un diocèse
export const fetchParoisses = async (dioceseId: number): Promise<Paroisse[]> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!dioceseId || dioceseId <= 0) {
        throw new ValidationError('ID du diocèse invalide');
    }

    try {
        const response = await axios.get<ParoissesApiResponse>(
            `${API_URL}/paroisse/obtenir-tous`,
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

// Fonction pour récupérer les détails d'une paroisse spécifique
export const fetchParoisseDetails = async (paroisseId: number): Promise<ParoisseDetails> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!paroisseId || paroisseId <= 0) {
        throw new ValidationError('ID de la paroisse invalide');
    }

    try {
        const response = await axios.get<ParoisseDetailsResponse>(
            `${API_URL}/paroisse/obtenir-un`,
            {
                params: { paroisse_id: paroisseId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            paroisse: response.data.paroisse,
            paroissiens: response.data.paroissiens,
            organisation: response.data.organisation
        };
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

// Fonction pour récupérer les paroisses d'une doyenne spécifique
export const fetchParoissesByDoyenne = async (doyenneId: number): Promise<Paroisse[]> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!doyenneId || doyenneId <= 0) {
        throw new ValidationError('ID de la doyenne invalide');
    }

    try {
        const response = await axios.get<ParoissesApiResponse>(
            `${API_URL}/paroisse/obtenir-par-doyenne`,
            {
                params: { doyenne_id: doyenneId },
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

// Fonction pour récupérer les paroisses d'un vicariat/secteur spécifique
export const fetchParoissesByVicariat = async (vicariatSecteurId: number): Promise<Paroisse[]> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!vicariatSecteurId || vicariatSecteurId <= 0) {
        throw new ValidationError('ID du vicariat/secteur invalide');
    }

    try {
        const response = await axios.get<ParoissesApiResponse>(
            `${API_URL}/paroisse/obtenir-par-vicariat`,
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

// Fonction pour créer une nouvelle paroisse
export const createParoisse = async (paroisseData: Partial<Paroisse>): Promise<Paroisse> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!paroisseData.nom || !paroisseData.ville || !paroisseData.doyenne_id) {
        throw new ValidationError('Données de la paroisse incomplètes');
    }

    try {
        const response = await axios.post<Paroisse>(
            `${API_URL}/paroisse/creer`,
            paroisseData,
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

// Fonction pour mettre à jour une paroisse
export const updateParoisse = async (paroisseId: number, paroisseData: Partial<Paroisse>): Promise<Paroisse> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!paroisseId || paroisseId <= 0) {
        throw new ValidationError('ID de la paroisse invalide');
    }

    try {
        const response = await axios.put<Paroisse>(
            `${API_URL}/paroisse/modifier`,
            { ...paroisseData, id: paroisseId },
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

// Fonction pour supprimer une paroisse
export const deleteParoisse = async (paroisseId: number): Promise<boolean> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!paroisseId || paroisseId <= 0) {
        throw new ValidationError('ID de la paroisse invalide');
    }

    try {
        await axios.delete(
            `${API_URL}/paroisse/supprimer`,
            {
                params: { paroisse_id: paroisseId },
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
export type {
    Paroisse,
    ParoisseDetails,
    Paroissien,
    Cure,
    Vicaire,
    Organisation,
    Administrateur,
    PhotoParoisse,
    PhotoParoissien,
    Localisation
};