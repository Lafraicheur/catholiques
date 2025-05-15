import axios, { AxiosError } from 'axios';

const API_URL = 'https://api.cathoconnect.ci/api:HzF8fFua';

// Définition des types
interface Mouvement {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  type: string;
  responsable_id: number | null;
  parrain_id: number | null;
  aumonier_id: number | null;
  paroisse_id: number;
  chapelle_id: number | null;
}

interface ApiResponse {
  items: Mouvement[];
}

// Types d'erreurs personnalisés
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

export const fetchMouvements = async (paroisseId: number): Promise<Mouvement[]> => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new AuthenticationError('Token d\'authentification non trouvé');
  }
  
  try {
    const response = await axios.get<ApiResponse>(`${API_URL}/mouvementassociation/obtenir-tous`, {
      params: { paroisse_id: paroisseId },
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.items || [];
  } catch (error) {
    handleApiError(error);
    // Cette ligne ne sera jamais atteinte car handleApiError lancera toujours une exception
    // mais TypeScript a besoin d'un return ici
    return [];
  }
};

function handleApiError(error: unknown): never {
  // Vérifier si c'est une erreur Axios
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Une erreur est survenue';
    
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

// Exemple d'utilisation
/* 
try {
  const mouvements = await fetchMouvements(123);
  console.log('Mouvements récupérés:', mouvements);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Rediriger vers la page de connexion
    console.error('Erreur d\'authentification:', error.message);
  } else if (error instanceof ForbiddenError) {
    // Afficher un message d'accès refusé
    console.error('Accès refusé:', error.message);
  } else {
    // Gérer les autres types d'erreurs
    console.error('Erreur:', error instanceof Error ? error.message : 'Erreur inconnue');
  }
}
*/