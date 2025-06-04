// services/nonParoissienService.ts
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError, AuthenticationError, ForbiddenError, NotFoundError } from '@/services/api';

export interface NonParoissien {
  id: number;
  created_at: string;
  nom: string;
  prenom: string;
  genre: "M" | "F";
  num_de_telephone: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Service centralisé pour les appels API
export class NonParoissienService {
  private static readonly BASE_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
  
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new AuthenticationError("Token d'authentification non trouvé");
    }
    
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
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
            errorData.message || "Erreur lors de l'opération",
            response.status
          );
      }
    }

    return response.json();
  }

  static async fetchAll(): Promise<NonParoissien[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/nonparoissien/obtenir-tous`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      return this.handleResponse<NonParoissien[]>(response);
    } catch (error) {
      console.error("Erreur lors du chargement des non-paroissiens:", error);
      throw error;
    }
  }

  static async create(data: Omit<NonParoissien, 'id' | 'created_at'>): Promise<NonParoissien> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/nonparoissien/creer`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      return this.handleResponse<NonParoissien>(response);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      throw error;
    }
  }

  static async update(id: number, data: Partial<NonParoissien>): Promise<NonParoissien> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/nonparoissien/modifier/${id}`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      return this.handleResponse<NonParoissien>(response);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/nonparoissien/supprimer/${id}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw error;
    }
  }

  static async convertToParoissien(id: number, additionalData?: any): Promise<void> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/nonparoissien/convertir/${id}`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(additionalData || {}),
        }
      );

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error("Erreur lors de la conversion:", error);
      throw error;
    }
  }
}