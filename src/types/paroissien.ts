// types/paroissien.ts
export interface Paroissien {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  prenoms: string;
  genre: "M" | "F" | "Autre";
  num_de_telephone: string | null;
  email: string | null;
  date_de_naissance: string;
  pays: string | null;
  nationalite: string | null;
  ville: string | null;
  commune: string | null;
  quartier: string | null;
  solde: number;
  est_abonne: boolean;
  date_de_fin_abonnement: number | null;
  statut: ParoissienStatut;
  paroisse_id: number;
  chapelle_id: number | null;
  ceb_id: number | null;
  mouvementassociation_id: number | null;
  user_id: number | null;
  abonnement_id: number | null;
  abonnement?: {
    intitule: string;
    // autres propriétés de l'abonnement
  };
}

export type ParoissienStatut = 
  | "Baptisé" 
  | "Confirmé" 
  | "Marié" 
  | "Aucun";

export interface ParoissienFilters {
  searchQuery: string;
  statutFilter: string;
}

export interface ParoissienStatistics {
  total: number;
  abonnes: number;
  nonAbonnes: number;
  totalFiltered: number;
  totalPages: number;
}

export interface UserProfile {
  paroisse_id: number;
  paroisse_nom: string;
  // autres propriétés du profil
}