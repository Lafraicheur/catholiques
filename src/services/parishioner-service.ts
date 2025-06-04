// api.js - Ajouter ces fonctions à votre fichier api.js existant

import { ApiError, AuthenticationError, ForbiddenError, NotFoundError } from "./api";

/**
 * Récupère tous les paroissiens d'une paroisse
 * @param {number} paroisseId - ID de la paroisse
 * @returns {Promise<Array>} Les paroissiens de la paroisse
 */
export const fetchParoissiens = async (paroisseId: number) => {
  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }
    
    // Appel à l'API
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
      if (response.status === 401) {
        throw new AuthenticationError("Session expirée");
      } else if (response.status === 403) {
        throw new ForbiddenError("Accès refusé");
      } else if (response.status === 404) {
        throw new NotFoundError("Ressource non trouvée");
      } else if (response.status === 429) {
        throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "Erreur lors de la récupération des paroissiens",
          response.status
        );
      }
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
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }
    
    // Appel à l'API
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
      if (response.status === 401) {
        throw new AuthenticationError("Session expirée");
      } else if (response.status === 403) {
        throw new ForbiddenError("Accès refusé");
      } else if (response.status === 404) {
        throw new NotFoundError("Paroissien non trouvé");
      } else if (response.status === 429) {
        throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "Erreur lors de la récupération des détails du paroissien",
          response.status
        );
      }
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
export const updateParoissien = async (paroissienData: { paroissien_id: number; nom: string; prenoms: string; genre: string; num_de_telephone: string; email: string; date_de_naissance: string; pays: string; nationalite: string; ville: string; commune: string; quartier: string; est_abonne: boolean; date_de_fin_abonnement: number; statut: string; abonnement_id: number; }) => {
  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }
    
    // Appel à l'API
    const response = await fetch(
      "https://api.cathoconnect.ci/api:HzF8fFua/paroissien/modifier",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paroissienData),
      }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError("Session expirée");
      } else if (response.status === 403) {
        throw new ForbiddenError("Accès refusé");
      } else if (response.status === 404) {
        throw new NotFoundError("Paroissien non trouvé");
      } else if (response.status === 429) {
        throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "Erreur lors de la modification du paroissien",
          response.status
        );
      }
    }
    
    const data = await response.json();
    return data || {};
    
  } catch (err) {
    console.error("Erreur API updateParoissien:", err);
    throw err;
  }
};