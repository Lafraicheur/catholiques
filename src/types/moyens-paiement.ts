// types/moyens-paiement.ts

export interface Provider {
  id: number;
  label: string;
  valeur_stricte: string;
  frais: number;
  photo: {
    url: string;
  };
}

export interface MoyenPaiement {
  id: number;
  provider_id: number;
  label: string;
  numero: string;
  photo: string | null;
  provider: Provider;
}

export interface AddMoyenPaiementRequest {
  label: string;
  numero: string;
  provider_id: number;
  paroisse_id: number;
}

export interface RemoveMoyenPaiementRequest {
  moyen_id: number;
  paroisse_id: number;
}

export interface MoyensPaiementResponse {
  items: MoyenPaiement[];
}

export interface ProvidersResponse {
  items: Provider[];
}

export interface ApiResponse {
  items: string;
}