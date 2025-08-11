/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// hooks/useFluxFinanciers.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ApiError,
} from "@/services/api";

interface FluxFinancier {
  id: number;
  created_at: number;
  reference: string;
  type: string;
  montant: number;
  frais: number;
  montant_avec_frais: number;
  description: string;
  motif: string;
  statut: string;
  solde_avant_beneficiaire: number;
  solde_apres_beneficiaire: number;
  initiateur_id: number;
  extras: Record<string, any>;
  initiateur: {
    id: number;
    nom: string;
    prenoms: string;
  };
}

interface CompteStatistiques {
  id: number;
  abonnement: number;
  demande_de_messe: number;
  denier_de_culte: number;
  fnc: number;
  don: number;
}

export function useFluxFinanciers() {
  const router = useRouter();
  const [fluxFinanciers, setFluxFinanciers] = useState<FluxFinancier[]>([]);
  const [stats, setStats] = useState<CompteStatistiques>({
    id: 0,
    abonnement: 0,
    demande_de_messe: 0,
    denier_de_culte: 0,
    fnc: 0,
    don: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserParoisseId = (): number => {
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

  const getAuthToken = (): string | null => {
    return localStorage.getItem("auth_token");
  };

  const handleApiError = (err: unknown) => {
    console.error("Erreur API:", err);

    if (err instanceof AuthenticationError) {
      toast.error("Session expirée", {
        description: "Veuillez vous reconnecter pour continuer.",
      });
      router.push("/login");
    } else if (err instanceof ForbiddenError) {
      setError(
        "Vous n'avez pas les droits nécessaires pour accéder à cette ressource."
      );
    } else if (err instanceof NotFoundError) {
      setError("Aucun flux financier trouvé.");
    } else {
      setError("Une erreur est survenue lors du chargement des données.");
    }
  };

  const loadFluxFinanciers = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      const paroisseId = getUserParoisseId();
      if (!paroisseId) {
        throw new AuthenticationError("ID de paroisse non trouvé");
      }

      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/finances/obtenir-tous?paroisse_id=${paroisseId}`,
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
          throw new ApiError(
            "Erreur lors du chargement des données",
            response.status
          );
        }
      }

      const data = await response.json();
      setFluxFinanciers(data);
    } catch (err) {
      handleApiError(err);
    }
  };

  const loadStatistiques = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      const paroisseId = getUserParoisseId();
      if (!paroisseId) {
        throw new AuthenticationError("ID de paroisse non trouvé");
      }

      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/finances/obtenir-comptes?paroisse_id=${paroisseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statistiques");
      }

      const data = await response.json();
      setStats(data.item);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([loadFluxFinanciers(), loadStatistiques()]);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    fluxFinanciers,
    stats,
    loading,
    error,
    retry,
  };
}