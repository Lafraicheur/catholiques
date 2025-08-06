// hooks/useMoyensPaiement.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  MoyenPaiement,
  Provider,
  AddMoyenPaiementRequest,
  RemoveMoyenPaiementRequest,
  MoyensPaiementResponse,
  ProvidersResponse,
} from "@/types/moyens-paiement";

const API_BASE_URL = "https://api.cathoconnect.ci/api:HzF8fFua";

interface UseMoyensPaiementReturn {
  // États
  moyensPaiement: MoyenPaiement[];
  providers: Provider[];
  loading: boolean;
  addingMoyen: boolean;
  removingMoyen: number | null;
  
  // Actions
  loadMoyensPaiement: () => Promise<void>;
  loadProviders: () => Promise<void>;
  addMoyenPaiement: (data: Omit<AddMoyenPaiementRequest, 'paroisse_id'>) => Promise<boolean>;
  removeMoyenPaiement: (moyenId: number) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export function useMoyensPaiement(paroisseId: number): UseMoyensPaiementReturn {
  // États
  const [moyensPaiement, setMoyensPaiement] = useState<MoyenPaiement[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingMoyen, setAddingMoyen] = useState(false);
  const [removingMoyen, setRemovingMoyen] = useState<number | null>(null);

  // Récupérer le token d'authentification
  const getAuthToken = () => {
    return localStorage.getItem("auth_token");
  };

  // Headers pour les requêtes API
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Charger les moyens de paiement
  const loadMoyensPaiement = async () => {
    try {
      const response = await axios.get<MoyensPaiementResponse>(
        `${API_BASE_URL}/retrait/mes-moyens`,
        {
          params: { paroisse_id: paroisseId },
          headers: getHeaders(),
        }
      );
      
      setMoyensPaiement(response.data.items || []);
    } catch (error) {
      console.error("Erreur lors du chargement des moyens de paiement:", error);
      toast.error("Impossible de charger les moyens de paiement");
      throw error;
    }
  };

  // Charger les opérateurs/providers
  const loadProviders = async () => {
    try {
      const response = await axios.get<ProvidersResponse>(
        `${API_BASE_URL}/retrait/les-operateurs`,
        {
          headers: getHeaders(),
        }
      );
      
      setProviders(response.data.items || []);
    } catch (error) {
      console.error("Erreur lors du chargement des opérateurs:", error);
      toast.error("Impossible de charger les opérateurs");
      throw error;
    }
  };

  // Ajouter un moyen de paiement
  const addMoyenPaiement = async (
    data: Omit<AddMoyenPaiementRequest, 'paroisse_id'>
  ): Promise<boolean> => {
    setAddingMoyen(true);
    
    try {
      await axios.post(
        `${API_BASE_URL}/retrait/ajouter-un-moyen`,
        {
          ...data,
          paroisse_id: paroisseId,
        },
        {
          headers: getHeaders(),
        }
      );

      toast.success("Moyen de paiement ajouté avec succès");
      
      // Recharger la liste
      await loadMoyensPaiement();
      return true;
    } catch (error: any) {
      console.error("Erreur lors de l'ajout:", error);
      const message = error.response?.data?.message || "Erreur lors de l'ajout";
      toast.error(message);
      return false;
    } finally {
      setAddingMoyen(false);
    }
  };

  // Supprimer un moyen de paiement
  const removeMoyenPaiement = async (moyenId: number): Promise<boolean> => {
    setRemovingMoyen(moyenId);
    
    try {
      await axios.post(
        `${API_BASE_URL}/retrait/retirer-un-moyen`,
        {
          moyen_id: moyenId,
          paroisse_id: paroisseId,
        },
        {
          headers: getHeaders(),
        }
      );

      toast.success("Moyen de paiement supprimé avec succès");
      
      // Recharger la liste
      await loadMoyensPaiement();
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      const message = error.response?.data?.message || "Erreur lors de la suppression";
      toast.error(message);
      return false;
    } finally {
      setRemovingMoyen(null);
    }
  };

  // Actualiser toutes les données
  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadMoyensPaiement(), loadProviders()]);
    } catch (error) {
      console.error("Erreur lors du rechargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    refreshData();
  }, [paroisseId]);

  return {
    // États
    moyensPaiement,
    providers,
    loading,
    addingMoyen,
    removingMoyen,
    
    // Actions
    loadMoyensPaiement,
    loadProviders,
    addMoyenPaiement,
    removeMoyenPaiement,
    refreshData,
  };
}