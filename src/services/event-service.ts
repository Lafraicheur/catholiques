// Fichier: services/api.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Service d'API pour gérer les appels à l'API CathoConnect

import { Evenement, EventType } from "./types";

// URL de base de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

// Classes d'erreurs personnalisées
export class ApiError extends Error {
    statusCode: number;

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

// Fonction sécurisée pour vérifier si le code s'exécute dans un navigateur
const isBrowser = () => typeof window !== 'undefined';

// Fonction pour obtenir l'ID de la paroisse depuis le profil utilisateur
export const getUserParoisseId = (): number => {
    if (!isBrowser()) return 0;

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

// Fonction pour obtenir le token d'authentification
const getAuthToken = (): string => {
    if (!isBrowser()) return '';

    try {
        const token = localStorage.getItem('auth_token');
        return token || '';
    } catch (err) {
        console.error("Erreur lors de la récupération du token:", err);
        return '';
    }
};

// Interface pour la réponse de l'API
interface ApiResponse {
    [key: string]: {
        type: string;
        extras: {
            type_messe?: string;
            heure_de_fin?: number;
            heure_de_debut?: number;
            prix_demande_de_messe?: number;
        };
        libelle: string;
        description: string;
        paroisse_id: number;
        date_de_debut: number;
    };
}

// Fonction pour déboguer la réponse API
const debugApiResponse = (data: any) => {
    console.log('Structure de la réponse API:', JSON.stringify(data, null, 2));

    if (data && typeof data === 'object') {
        // Examiner les timestamps
        Object.values(data).forEach((item: any, index) => {
            console.log(`Événement ${index}:`);
            console.log(`- date_de_debut: ${item.date_de_debut} (type: ${typeof item.date_de_debut})`);
            console.log(`- heure_de_debut: ${item.extras?.heure_de_debut} (type: ${typeof item.extras?.heure_de_debut})`);

            // Tester la conversion
            try {
                const date = new Date(item.date_de_debut * 1000);
                console.log(`- Conversion date_de_debut: ${date.toISOString()}`);
            } catch (e) {
                console.error(`- Impossible de convertir date_de_debut: ${e.message}`);
            }
        });
    }
};

// Convertir les timestamps en format de date lisible avec gestion d'erreurs
const timestampToDateString = (timestamp: number | null | undefined): string => {
    try {
        // Vérifier si le timestamp est valide
        if (timestamp === null || timestamp === undefined || timestamp <= 0) {
            console.warn(`Timestamp de date invalide reçu: ${timestamp}, utilisation de la date actuelle`);
            return new Date().toISOString().split('T')[0]; // Date par défaut
        }

        // Convertir en millisecondes et créer l'objet Date
        const date = new Date(timestamp * 1000);

        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
            console.warn(`Date invalide créée à partir du timestamp: ${timestamp}`);
            return new Date().toISOString().split('T')[0]; // Date par défaut
        }

        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    } catch (err) {
        console.error(`Erreur lors de la conversion du timestamp ${timestamp}:`, err);
        return new Date().toISOString().split('T')[0]; // Date par défaut en cas d'erreur
    }
};

// Convertir les timestamps en heure lisible avec gestion d'erreurs
const timestampToTimeString = (timestamp: number | null | undefined): string => {
    try {
        // Vérifier si le timestamp est valide
        if (timestamp === null || timestamp === undefined || timestamp <= 0) {
            console.warn(`Timestamp d'heure invalide reçu: ${timestamp}, utilisation de l'heure actuelle`);
            return new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Convertir en millisecondes
        const date = new Date(timestamp * 1000);

        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
            console.warn(`Heure invalide créée à partir du timestamp: ${timestamp}`);
            return new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (err) {
        console.error(`Erreur lors de la conversion du timestamp ${timestamp}:`, err);
        return new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Convertir le type de l'API en EventType local avec gestion d'erreurs
const mapApiTypeToEventType = (apiType: string): EventType => {
    if (!apiType) {
        return 'messe'; // Type par défaut si aucun type fourni
    }

    try {
        switch (apiType.toUpperCase()) {
            case 'MESSE':
                return 'messe';
            case 'FORMATION':
                return 'formation';
            case 'REUNION':
                return 'reunion';
            case 'SACREMENT':
                return 'sacrement';
            case 'PRIERE':
                return 'priere';
            case 'PREPARATION':
                return 'preparation';
            default:
                console.warn(`Type d'événement non reconnu: ${apiType}, utilisation du type par défaut`);
                return 'messe'; // Type par défaut
        }
    } catch (err) {
        console.error(`Erreur lors de la conversion du type d'événement ${apiType}:`, err);
        return 'messe'; // Type par défaut en cas d'erreur
    }
};

// Fonction pour gérer les erreurs de l'API
function handleApiError(response: Response): never {
    const statusCode = response.status;

    switch (statusCode) {
        case 400:
            throw new ValidationError();
        case 401:
            throw new AuthenticationError();
        case 403:
            throw new ForbiddenError();
        case 404:
            throw new NotFoundError();
        case 429:
            throw new RateLimitError();
        default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
    }
}

// Fonction pour récupérer tous les événements d'une paroisse
export const fetchEvenements = async (paroisse_id: number): Promise<Evenement[]> => {
    if (!paroisse_id) {
        throw new ValidationError('ID de paroisse non valide');
    }

    const token = getAuthToken();
    if (!token) {
        throw new AuthenticationError();
    }

    try {
        const response = await fetch(`${API_BASE_URL}/evenements/obtenir-tous?paroisse_id=${paroisse_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            handleApiError(response);
        }

        const data: ApiResponse = await response.json();

        // Activer pour le débogage si nécessaire
        // debugApiResponse(data);

        // Convertir la réponse de l'API en format d'événements compatible avec notre application
        const evenements: Evenement[] = [];

        // Ajouter une vérification pour s'assurer que data n'est pas null ou undefined
        if (data && typeof data === 'object') {
            Object.values(data).forEach((item, index) => {
                try {
                    // Vérifier que les propriétés essentielles existent
                    if (!item) {
                        console.warn('Entrée d\'événement invalide ignorée: null ou undefined');
                        return; // Ignorer cet élément
                    }

                    evenements.push({
                        id: index + 1, // Générer un ID unique
                        titre: item.libelle || 'Sans titre',
                        date: timestampToDateString(item.date_de_debut),
                        heure: timestampToTimeString(item.extras?.heure_de_debut),
                        lieu: "À déterminer",
                        description: item.description || '',
                        type: mapApiTypeToEventType(item.type || ''),
                        statut: "programmé",
                        responsable: "À déterminer"
                    });
                } catch (itemError) {
                    console.error('Erreur lors du traitement d\'un événement:', itemError);
                    // Continuer avec les autres éléments
                }
            });
        } else {
            console.warn('Réponse API inattendue:', data);
        }

        return evenements;
    } catch (error) {
        // Ajouter un log détaillé pour mieux diagnostiquer
        console.error('Erreur détaillée lors de la récupération des événements:', error);

        // Relancer les ApiError déjà typées
        if (error instanceof ApiError) {
            throw error;
        }

        // Pour les autres types d'erreurs (réseau, etc.)
        throw new ApiError('Une erreur est survenue lors de la communication avec le serveur', 500);
    }
};