// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-html-link-for-pages */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// import axios, { AxiosError } from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL_STATISTIQUEDIOCESE || "https://api.cathoconnect.ci/api:O-UjMCtX";

// // Types pour les paroisses
// interface Cure {
//     id: number;
//     nom: string;
//     prenoms: string;
//     num_de_telephone: string;
// }

// interface Administrateur {
//     id: number;
//     nom: string;
//     prenoms: string;
//     num_de_telephone: string;
// }

// interface PhotoParoisse {
//     access: string;
//     path: string;
//     name: string;
//     type: string;
//     size: number;
//     mime: string;
//     meta: any;
//     url: string;
// }

// interface Localisation {
//     trim(): unknown;
//     type: string;
//     data: {
//         lng: number;
//         lat: number;
//     };
// }

// interface PhotoParoissien {
//     url: string;
// }

// interface Paroissien {
//     id: number;
//     nom: string;
//     prenoms: string;
//     genre: 'M' | 'F';
//     num_de_telephone: string;
//     est_abonne: boolean;
//     date_de_fin_abonnement: number;
//     statut: 'Aucun' | string; // Peut avoir d'autres statuts
//     photo?: PhotoParoissien;
// }

// interface Paroisse {
//     id: number;
//     created_at: string | number;
//     nom: string;
//     pays: 'COTE D\'IVOIRE';
//     ville: 'ABIDJAN';
//     quartier: string;
//     statut: 'Paroisse' | 'Quasi-Paroisse' | string;
//     vicaires_id: number[];
//     administrateur_id: number;
//     cure_id: number;
//     doyenne_id: number;
//     vicariatsecteur_id: number;
//     photo?: PhotoParoisse;
//     localisation: Localisation | null;
//     cure?: Cure;
//     administrateur?: Administrateur;
// }

// interface Vicaire {
//     id: number;
//     nom: string;
//     prenoms: string;
//     num_de_telephone: string;
// }

// interface Organisation {
//     cure: Cure;
//     vicaires: Vicaire[];
// }

// interface ParoisseDetails {
//     paroisse: {
//         id: number;
//         created_at: string | number;
//         nom: string;
//         pays: 'COTE D\'IVOIRE';
//         ville: 'ABIDJAN';
//         quartier: string;
//         statut: 'Paroisse' | 'Quasi-Paroisse' | string;
//         vicaires_id: number[];
//         administrateur_id: number;
//         cure_id: number;
//         doyenne_id: number;
//         vicariatsecteur_id: number;
//         photo?: PhotoParoisse;
//         localisation: string;
//     };
//     paroissiens: Paroissien[];
//     organisation: Organisation;
// }

// interface ParoissesApiResponse {
//     items: Paroisse[];
// }

// interface ParoisseDetailsResponse {
//     paroisse: ParoisseDetails['paroisse'];
//     paroissiens: Paroissien[];
//     organisation: Organisation;
// }

// // Classes d'erreurs (réutilisées)
// export class ApiError extends Error {
//     statusCode: number;
//     status: number | undefined;

//     constructor(message: string, statusCode: number) {
//         super(message);
//         this.name = 'ApiError';
//         this.statusCode = statusCode;
//     }
// }

// export class AuthenticationError extends ApiError {
//     constructor(message = 'Authentification requise') {
//         super(message, 401);
//         this.name = 'AuthenticationError';
//     }
// }

// export class ForbiddenError extends ApiError {
//     constructor(message = 'Accès refusé. Droits insuffisants.') {
//         super(message, 403);
//         this.name = 'ForbiddenError';
//     }
// }

// export class NotFoundError extends ApiError {
//     constructor(message = 'Ressource non trouvée') {
//         super(message, 404);
//         this.name = 'NotFoundError';
//     }
// }

// export class RateLimitError extends ApiError {
//     constructor(message = 'Trop de requêtes. Veuillez réessayer plus tard.') {
//         super(message, 429);
//         this.name = 'RateLimitError';
//     }
// }

// export class ValidationError extends ApiError {
//     constructor(message = 'Erreur de validation des données') {
//         super(message, 400);
//         this.name = 'ValidationError';
//     }
// }

// // Fonctions utilitaires
// export const formatTimestamp = (timestamp: number | string | null | undefined): string => {
//     if (!timestamp) return "Non renseignée";

//     try {
//         const date = new Date(typeof timestamp === 'number' ? timestamp : parseInt(timestamp.toString()));
//         return new Intl.DateTimeFormat("fr-FR", {
//             weekday: "long",
//             day: "2-digit",
//             month: "long",
//             year: "numeric",
//             timeZone: "UTC", // ou "Africa/Abidjan" selon le besoin

//         }).format(date);
//     } catch (err) {
//         console.error("Erreur lors du formatage du timestamp:", err);
//         return timestamp.toString();
//     }
// };

// export const getFullName = (person: { nom?: string; prenoms?: string } | null | undefined): string => {
//     if (!person) return "Non assigné";
//     return `${person.nom || ""} ${person.prenoms || ""}`.trim() || "Non renseigné";
// };

// export const formatLocalisation = (localisation: Localisation | null | undefined): string => {
//     if (!localisation || !localisation.data) return "Non spécifiée";
//     return `${localisation.data.lat.toFixed(5)}, ${localisation.data.lng.toFixed(5)}`;
// };

// export const formatGenre = (genre: 'M' | 'F' | string): string => {
//     switch (genre) {
//         case 'M':
//             return 'Masculin';
//         case 'F':
//             return 'Féminin';
//         default:
//             return genre || 'Non spécifié';
//     }
// };

// export const formatStatutAbonnement = (estAbonne: boolean, dateFinAbonnement: number | null): string => {
//     if (!estAbonne) return 'Non abonné';

//     if (!dateFinAbonnement) return 'Abonné';

//     const dateFin = new Date(dateFinAbonnement);
//     const maintenant = new Date();

//     if (dateFin < maintenant) {
//         return 'Abonnement expiré';
//     }

//     return `Abonné jusqu'au ${dateFin.toLocaleDateString('fr-FR')}`;
// };

// // Fonction utilitaire pour vérifier si une organisation est complète
// export const isOrganisationComplete = (organisation: Organisation | null | undefined): boolean => {
//     if (!organisation) return false;
//     return !!(organisation.cure && organisation.cure.nom && organisation.cure.prenoms);
// };

// // Fonction utilitaire pour obtenir le nombre total de responsables dans une paroisse
// export const getTotalResponsables = (organisation: Organisation | null | undefined): number => {
//     if (!organisation) return 0;

//     let total = 0;
//     if (organisation.cure && organisation.cure.nom) total += 1;
//     if (organisation.vicaires && Array.isArray(organisation.vicaires)) {
//         total += organisation.vicaires.length;
//     }

//     return total;
// };

// // Fonction pour récupérer toutes les paroisses d'un diocèse
// export const fetchParoisses = async (dioceseId: number): Promise<Paroisse[]> => {
//     const token = localStorage.getItem('auth_token');

//     if (!token) {
//         throw new AuthenticationError('Token d\'authentification non trouvé');
//     }

//     if (!dioceseId || dioceseId <= 0) {
//         throw new ValidationError('ID du diocèse invalide');
//     }

//     try {
//         const response = await axios.get<ParoissesApiResponse>(
//             `${API_URL}/paroisse/obtenir-tous`,
//             {
//                 params: { diocese_id: dioceseId },
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         return response.data.items || [];
//     } catch (error) {
//         handleApiError(error);
//         return [];
//     }
// };

// // Fonction pour récupérer les détails d'une paroisse spécifique
// export const fetchParoisseDetails = async (paroisseId: number): Promise<ParoisseDetails> => {
//     const token = localStorage.getItem('auth_token');

//     if (!token) {
//         throw new AuthenticationError('Token d\'authentification non trouvé');
//     }

//     if (!paroisseId || paroisseId <= 0) {
//         throw new ValidationError('ID de la paroisse invalide');
//     }

//     try {
//         const response = await axios.get<ParoisseDetailsResponse>(
//             `${API_URL}/paroisse/obtenir-un`,
//             {
//                 params: { paroisse_id: paroisseId },
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         return {
//             paroisse: response.data.paroisse,
//             paroissiens: response.data.paroissiens,
//             organisation: response.data.organisation
//         };
//     } catch (error) {
//         handleApiError(error);
//         throw error;
//     }
// };

// // Fonction pour nommer un curé pour une paroisse
// export const nommerCure = async (paroisseId: number, serviteurId: number): Promise<Paroisse> => {
//     const token = localStorage.getItem('auth_token');

//     if (!token) {
//         throw new AuthenticationError('Token d\'authentification non trouvé');
//     }

//     if (!paroisseId || paroisseId <= 0) {
//         throw new ValidationError('ID de la paroisse invalide');
//     }

//     if (!serviteurId || serviteurId <= 0) {
//         throw new ValidationError('ID du serviteur invalide');
//     }

//     try {
//         const response = await axios.post<{ item: Paroisse }>(
//             `${API_URL}/nomination/cure`,
//             {
//                 paroisse_id: paroisseId,
//                 serviteur_id: serviteurId
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         return response.data.item;
//     } catch (error) {
//         handleApiError(error);
//         throw error;
//     }
// };


// // Fonction de gestion des erreurs
// function handleApiError(error: unknown): never {
//     if (axios.isAxiosError(error)) {
//         const axiosError = error as AxiosError;
//         const statusCode = axiosError.response?.status || 500;
//         const errorMessage =
//             (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
//                 ? (axiosError.response.data as { message?: string }).message
//                 : undefined) ||
//             axiosError.message ||
//             'Une erreur est survenue';

//         switch (statusCode) {
//             case 400:
//                 throw new ValidationError(errorMessage);
//             case 401:
//                 throw new AuthenticationError(errorMessage);
//             case 403:
//                 throw new ForbiddenError(errorMessage);
//             case 404:
//                 throw new NotFoundError(errorMessage);
//             case 429:
//                 throw new RateLimitError(errorMessage);
//             default:
//                 throw new ApiError(errorMessage, statusCode);
//         }
//     } else if (error instanceof Error) {
//         throw new ApiError(error.message, 500);
//     } else {
//         throw new ApiError('Une erreur inconnue est survenue', 500);
//     }
// }

// // Export des types pour les utiliser dans d'autres fichiers
// export type {
//     Paroisse,
//     ParoisseDetails,
//     Paroissien,
//     Cure,
//     Vicaire,
//     Organisation,
//     Administrateur,
//     PhotoParoisse,
//     PhotoParoissien,
//     Localisation
// };

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
    trim(): unknown;
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
    localisation: string; // Modifié selon la nouvelle API
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
    cure: Cure | null;
    vicaires: Vicaire[];
}

// Nouveaux types pour les mouvements, cebs et événements
interface Mouvement {
    id: number;
    created_at: string | number;
    identifiant: string;
    nom: string;
    type: 'PASTORALE DE LA SANTE' | string;
    responsable_id: number;
    parrain_id: number;
    aumonier_id: number;
    aumonier?: {
        id: number;
        nom: string;
        prenoms: string;
        num_de_telephone: string;
    };
    responsable?: {
        id: number;
        nom: string;
        prenoms: string;
        num_de_telephone: string;
    };
    parrain?: {
        id: number;
        nom: string;
        prenoms: string;
        num_de_telephone: string;
    };
}

interface Ceb {
    id: number;
    created_at: string | number;
    identifiant: string;
    nom: string;
    chapelle_id: number;
    president_id: number;
    president?: {
        id: number;
        nom: string;
        prenoms: string;
        num_de_telephone: string;
    };
}

interface Evenement {
    id: number;
    created_at: string | number;
    libelle: string;
    type: 'ACTIVITÉ' | string;
    date_de_debut: number;
    date_de_fin: number;
    est_limite_par_echeance: boolean;
    est_actif: boolean;
    extras: any;
    paroisse_id: number;
    image?: {
        url: string;
    };
}

// Interface mise à jour pour les détails de paroisse
interface ParoisseDetails {
    paroisse: Paroisse;
    organisation: Organisation; // Changé de string à Organisation
    paroissiens: Paroissien[];
    mouvements: Mouvement[];
    cebs: Ceb[];
    evenements: Evenement[];
}

interface ParoissesApiResponse {
    items: Paroisse[];
}

interface ParoisseDetailsResponse {
    paroisse: Paroisse;
    organisation: Organisation; // Changé de string à Organisation
    paroissiens: Paroissien[];
    mouvements: Mouvement[];
    cebs: Ceb[];
    evenements: Evenement[];
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

export const formatLocalisation = (localisation: string | null | undefined): string => {
    if (!localisation) return "Non spécifiée";
    return localisation;
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

// Fonction utilitaire pour formater le type de mouvement
export const formatTypeMouvement = (type: string): string => {
    switch (type) {
        case 'PASTORALE DE LA SANTE':
            return 'Pastorale de la santé';
        default:
            return type || 'Non spécifié';
    }
};

// Fonction utilitaire pour formater le type d'événement
export const formatTypeEvenement = (type: string): string => {
    switch (type) {
        case 'ACTIVITÉ':
            return 'Activité';
        default:
            return type || 'Non spécifié';
    }
};

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

// Fonction pour récupérer les détails d'une paroisse spécifique (mise à jour)
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
            organisation: response.data.organisation,
            paroissiens: response.data.paroissiens,
            mouvements: response.data.mouvements,
            cebs: response.data.cebs,
            evenements: response.data.evenements
        };
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

// Fonction pour nommer un curé pour une paroisse
export const nommerCure = async (paroisseId: number, serviteurId: number): Promise<Paroisse> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!paroisseId || paroisseId <= 0) {
        throw new ValidationError('ID de la paroisse invalide');
    }

    if (!serviteurId || serviteurId <= 0) {
        throw new ValidationError('ID du serviteur invalide');
    }

    try {
        const response = await axios.post<{ item: Paroisse }>(
            `${API_URL}/nomination/cure`,
            {
                paroisse_id: paroisseId,
                serviteur_id: serviteurId
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
        throw error;
    }
};

// Nouvelle fonction pour affecter un vicaire à une paroisse
export const affecterVicaire = async (paroisseId: number, serviteurId: number): Promise<Paroisse> => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new AuthenticationError('Token d\'authentification non trouvé');
    }

    if (!paroisseId || paroisseId <= 0) {
        throw new ValidationError('ID de la paroisse invalide');
    }

    if (!serviteurId || serviteurId <= 0) {
        throw new ValidationError('ID du serviteur invalide');
    }

    try {
        const response = await axios.post<{ item: Paroisse }>(
            `${API_URL}/affectation/vicaire`,
            {
                paroisse_id: paroisseId,
                serviteur_id: serviteurId
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
    Localisation,
    Mouvement,
    Ceb,
    Evenement
};