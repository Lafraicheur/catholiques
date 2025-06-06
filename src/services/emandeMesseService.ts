// =============================================================================
// 3. SERVICES - services/demandeMesseService.ts
// =============================================================================

import axios from "axios";
import { AuthenticationError, ForbiddenError, NotFoundError } from "@/services/api";
import { DemandeMesse } from "../types/demandeMesse";

export const fetchDemandesMesse = async (paroisseId: number): Promise<DemandeMesse[]> => {
  const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new AuthenticationError("Token d'authentification non trouvé");
  }

  try {
    const response = await axios.get(`${API_URL}/demandemesse/obtenir-tous`, {
      params: { paroisse_id: paroisseId },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return response.data.items || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || "Une erreur est survenue";

      switch (statusCode) {
        case 401:
          throw new AuthenticationError(errorMessage);
        case 403:
          throw new ForbiddenError(errorMessage);
        case 404:
          throw new NotFoundError(errorMessage);
        default:
          throw new Error(errorMessage);
      }
    }
    throw error;
  }
};
