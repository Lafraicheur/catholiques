/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// api.js - Ajouter cette fonction à votre fichier api.js existant

import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "./api";

/**
 * Récupère toutes les CEB d'une paroisse
 * @param {number} paroisseId - ID de la paroisse
 * @returns {Promise<Array>} Les CEB de la paroisse
 */
export const fetchCebs = async (paroisseId: number): Promise<Array<any>> => {
  const API_URL_STATISTIQUE = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    // Appel à l'API
    const response = await fetch(
      `${API_URL_STATISTIQUE}/ceb/obtenir-tous?paroisse_id=${paroisseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError("Session expirée");
      } else if (response.status === 403) {
        throw new ForbiddenError("Accès refusé");
      } else if (response.status === 404) {
        throw new NotFoundError("Ressource non trouvée");
      } else if (response.status === 429) {
        throw new ApiError(
          "Trop de requêtes, veuillez réessayer plus tard",
          429
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "Erreur lors de la récupération des CEB",
          response.status
        );
      }
    }

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.error("Erreur API fetchCebs:", err);
    throw err;
  }
};

/**
 * Récupère les détails d'une CEB spécifique
 * @param {number} cebId - ID de la CEB
 * @returns {Promise<Object>} Les détails de la CEB
 */
export const fetchCebDetails = async (cebId: number): Promise<object> => {
  const API_URL_STATISTIQUE = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    // Appel à l'API
    const response = await fetch(
      `${API_URL_STATISTIQUE}/ceb/obtenir-un?ceb_id=${cebId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError("Session expirée");
      } else if (response.status === 403) {
        throw new ForbiddenError("Accès refusé");
      } else if (response.status === 404) {
        throw new NotFoundError("CEB non trouvée");
      } else if (response.status === 429) {
        throw new ApiError(
          "Trop de requêtes, veuillez réessayer plus tard",
          429
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message ||
          "Erreur lors de la récupération des détails de la CEB",
          response.status
        );
      }
    }

    const data = await response.json();
    return data.item || null;
  } catch (err) {
    console.error("Erreur API fetchCebDetails:", err);
    throw err;
  }
};
