// // api.js - Ajouter ces fonctions à votre fichier api.js existant

// import { ApiError, AuthenticationError, ForbiddenError, NotFoundError } from "./api";

// /**
//  * Récupère tous les paroissiens d'une paroisse
//  * @param {number} paroisseId - ID de la paroisse
//  * @returns {Promise<Array>} Les paroissiens de la paroisse
//  */
// export const fetchParoissiens = async (paroisseId: number) => {
//   try {
//     // Récupérer le token depuis localStorage
//     const token = localStorage.getItem("auth_token");

//     if (!token) {
//       throw new AuthenticationError("Token d'authentification non trouvé");
//     }

//     // Appel à l'API
//     const response = await fetch(
//       `https://api.cathoconnect.ci/api:HzF8fFua/paroissien/obtenir-tous?paroisse_id=${paroisseId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new AuthenticationError("Session expirée");
//       } else if (response.status === 403) {
//         throw new ForbiddenError("Accès refusé");
//       } else if (response.status === 404) {
//         throw new NotFoundError("Ressource non trouvée");
//       } else if (response.status === 429) {
//         throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         throw new ApiError(
//           errorData.message || "Erreur lors de la récupération des paroissiens",
//           response.status
//         );
//       }
//     }

//     const data = await response.json();
//     return data.items || [];

//   } catch (err) {
//     console.error("Erreur API fetchParoissiens:", err);
//     throw err;
//   }
// };

// /**
//  * Récupère les détails d'un paroissien spécifique
//  * @param {number} paroissienId - ID du paroissien
//  * @returns {Promise<Object>} Les détails du paroissien
//  */
// export const fetchParoissienDetails = async (paroissienId: number) => {
//   try {
//     // Récupérer le token depuis localStorage
//     const token = localStorage.getItem("auth_token");

//     if (!token) {
//       throw new AuthenticationError("Token d'authentification non trouvé");
//     }

//     // Appel à l'API
//     const response = await fetch(
//       `https://api.cathoconnect.ci/api:HzF8fFua/paroissien/obtenir-un?paroissien_id=${paroissienId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new AuthenticationError("Session expirée");
//       } else if (response.status === 403) {
//         throw new ForbiddenError("Accès refusé");
//       } else if (response.status === 404) {
//         throw new NotFoundError("Paroissien non trouvé");
//       } else if (response.status === 429) {
//         throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         throw new ApiError(
//           errorData.message || "Erreur lors de la récupération des détails du paroissien",
//           response.status
//         );
//       }
//     }

//     const data = await response.json();
//     return data.item || null;

//   } catch (err) {
//     console.error("Erreur API fetchParoissienDetails:", err);
//     throw err;
//   }
// };

// /**
//  * Modifie les informations d'un paroissien
//  * @param {Object} paroissienData - Les données du paroissien à modifier
//  * @returns {Promise<Object>} Le paroissien modifié
//  */
// export const updateParoissien = async (paroissienData: { paroissien_id: number; nom: string; prenoms: string; genre: string; num_de_telephone: string; email: string; date_de_naissance: string; pays: string; nationalite: string; ville: string; commune: string; quartier: string; est_abonne: boolean; date_de_fin_abonnement: number; statut: string; abonnement_id: number; }) => {
//   try {
//     // Récupérer le token depuis localStorage
//     const token = localStorage.getItem("auth_token");

//     if (!token) {
//       throw new AuthenticationError("Token d'authentification non trouvé");
//     }

//     // Appel à l'API
//     const response = await fetch(
//       "https://api.cathoconnect.ci/api:HzF8fFua/paroissien/modifier",
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(paroissienData),
//       }
//     );

//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new AuthenticationError("Session expirée");
//       } else if (response.status === 403) {
//         throw new ForbiddenError("Accès refusé");
//       } else if (response.status === 404) {
//         throw new NotFoundError("Paroissien non trouvé");
//       } else if (response.status === 429) {
//         throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         throw new ApiError(
//           errorData.message || "Erreur lors de la modification du paroissien",
//           response.status
//         );
//       }
//     }

//     const data = await response.json();
//     return data || {};

//   } catch (err) {
//     console.error("Erreur API updateParoissien:", err);
//     throw err;
//   }
// };

// paroissien-service.js - Service corrigé pour les paroissiens
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


// Définition des types d'erreur (à exporter depuis un fichier séparé)
export class ApiError extends Error {
  status: number;
  constructor(message: string | undefined, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Erreur d'authentification") {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Accès refusé") {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Ressource non trouvée") {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Récupère le token d'authentification
 * @returns {string|null} Le token ou null
 */
const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

/**
 * Gère les erreurs de réponse HTTP
 * @param {Response} response - La réponse HTTP
 */
const handleApiError = async (response: Response) => {
  const errorData = await response.json().catch(() => ({}));

  switch (response.status) {
    case 401:
      throw new AuthenticationError("Session expirée");
    case 403:
      throw new ForbiddenError("Accès refusé");
    case 404:
      throw new NotFoundError("Ressource non trouvée");
    case 429:
      throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
    default:
      throw new ApiError(
        errorData.message || "Erreur API inattendue",
        response.status
      );
  }
};

/**
 * Récupère tous les paroissiens d'une paroisse
 * @param {number} paroisseId - ID de la paroisse
 * @returns {Promise<Array>} Les paroissiens de la paroisse
 */
export const fetchParoissiens = async (paroisseId: number) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    const response = await fetch(
      `https://api.cathoconnect.ci/api:HzF8fFua/paroissien/obtenir-tous?paroisse_id=${paroisseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return data.items || [];

  } catch (err) {
    console.error("Erreur API fetchParoissiens:", err);
    throw err;
  }
};

/**
 * Récupère les détails d'un paroissien spécifique
 * @param {number} paroissienId - ID du paroissien
 * @returns {Promise<Object>} Les détails du paroissien
 */
export const fetchParoissienDetails = async (paroissienId: number) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    const response = await fetch(
      `https://api.cathoconnect.ci/api:HzF8fFua/paroissien/obtenir-un?paroissien_id=${paroissienId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return data.item || null;

  } catch (err) {
    console.error("Erreur API fetchParoissienDetails:", err);
    throw err;
  }
};

/**
 * Modifie les informations d'un paroissien
 * @param {Object} paroissienData - Les données du paroissien à modifier
 * @returns {Promise<Object>} Le paroissien modifié
 */
export const updateParoissien = async (paroissienData: { paroissien_id: any; nom: any; prenoms: any; genre: any; num_de_telephone: any; email: any; date_de_naissance: any; pays: any; nationalite: any; ville: any; commune: any; quartier: any; est_abonne: any; date_de_fin_abonnement: any; statut: any; abonnement_id: any; mouvements?: any; statut_social?: any; }) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    // Validation des données requises
    if (!paroissienData.paroissien_id) {
      throw new ApiError("L'ID du paroissien est requis", 400);
    }

    // Préparer les données selon le schéma de l'API
    const apiData = {
      paroissien_id: paroissienData.paroissien_id,
      nom: paroissienData.nom || "",
      prenoms: paroissienData.prenoms || "",
      genre: paroissienData.genre || "M",
      num_de_telephone: paroissienData.num_de_telephone || "",
      email: paroissienData.email || "",
      date_de_naissance: paroissienData.date_de_naissance || "",
      pays: paroissienData.pays || "",
      nationalite: paroissienData.nationalite || "",
      ville: paroissienData.ville || "",
      commune: paroissienData.commune || "",
      quartier: paroissienData.quartier || "",
      est_abonne: paroissienData.est_abonne || false,
      date_de_fin_abonnement: paroissienData.date_de_fin_abonnement || 0,
      statut: paroissienData.statut || "Aucun",
      abonnement_id: paroissienData.abonnement_id || 0,
      mouvements: paroissienData.mouvements || [],
      statut_social: paroissienData.statut_social || "Bébé",
      // photo sera ajoutée séparément si nécessaire
    };

    console.log("Données envoyées à l'API:", apiData);

    const response = await fetch(
      "https://api.cathoconnect.ci/api:HzF8fFua/paroissien/modifier",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return data || {};

  } catch (err) {
    console.error("Erreur API updateParoissien:", err);
    throw err;
  }
};