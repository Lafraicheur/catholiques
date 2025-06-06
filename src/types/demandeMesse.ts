// =============================================================================
// 1. TYPES ET INTERFACES - types/demandeMesse.ts
// =============================================================================

export interface Initiateur {
  nom: string;
  prenoms: string;
  num_de_telephone: string;
}

export interface Messe {
  id: number;
  created_at: string;
  libelle: string;
  type: string;
  date_de_debut: number;
  extras: {
    type_messe: string;
    heure_de_fin: number;
    heure_de_debut: number;
    prix_demande_de_messe: number;
  };
  paroisse_id: number;
}

export interface DemandeMesse {
  id: number;
  created_at: string;
  demandeur: string;
  intention: string;
  concerne: string;
  description: string;
  est_payee: boolean;
  messe_id: number;
  paroisse_id: number;
  messe?: Messe;
  initiateur?: Initiateur;
}

export interface MesseFilters {
  libelle: string;
  dateDebut: string;
  heureFin: string;
}