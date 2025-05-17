/* eslint-disable @typescript-eslint/no-explicit-any */
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
  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    // Appel à l'API
    const response = await fetch(
      `https://api.cathoconnect.ci/api:HzF8fFua/ceb/obtenir-tous?paroisse_id=${paroisseId}`,
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
  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    // Appel à l'API
    const response = await fetch(
      `https://api.cathoconnect.ci/api:HzF8fFua/ceb/obtenir-un?ceb_id=${cebId}`,
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

/**
 * Nomme un président pour une CEB
 * @param {number} cebId - ID de la CEB
 * @param {string} telephone - Numéro de téléphone du paroissien à nommer comme président
 * @returns {Promise<Object>} La CEB mise à jour
 */
export const nominatePresident = async (cebId, telephone) => {
  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }

    // Journalisation pour le débogage
    console.log("Envoi de la requête avec les données:", {
      ceb_id: cebId,
      president: telephone,
    });

    // Appel à l'API avec la méthode POST (corrigée)
    const response = await fetch(
      "https://api.cathoconnect.ci/api:HzF8fFua/ceb/nommer-president", // Correction de l'URL (nominer → nommer)
      {
        method: "POST", // Correction de la méthode (PUT → POST)
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ceb_id: cebId,
          president: telephone, // Numéro de téléphone comme "president"
        }),
      }
    );

    // Pour le débogage, imprimons le corps de la réponse
    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
      console.log("Réponse API:", responseData);
    } catch (e) {
      console.log("Réponse non-JSON:", responseText);
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError("Session expirée");
      } else if (response.status === 403) {
        throw new ForbiddenError("Accès refusé");
      } else if (response.status === 404) {
        throw new NotFoundError(
          responseData?.message ||
            "Paroissien non trouvé avec ce numéro de téléphone"
        );
      } else if (response.status === 400) {
        throw new ApiError(
          responseData?.message ||
            "Données invalides, vérifiez le format du numéro de téléphone",
          400
        );
      } else if (response.status === 429) {
        throw new ApiError(
          "Trop de requêtes, veuillez réessayer plus tard",
          429
        );
      } else {
        throw new ApiError(
          responseData?.message || "Erreur lors de la nomination du président",
          response.status
        );
      }
    }

    return responseData?.item || null;
  } catch (err) {
    console.error("Erreur API nominatePresident:", err);
    throw err;
  }
};
