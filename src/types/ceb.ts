// types/ceb.ts
export interface President {
  id: number;
  nom: string;
  prenoms: string;
  num_de_telephone: string;
}

export interface Ceb {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  paroisse_id: number;
  chapelle_id: number | null;
  president_id: number | null;
  president?: President;
}

export interface CebFormData {
  nom: string;
  identifiant?: string;
  solde?: number;
  president_id?: number | null;
}

export interface CebListResponse {
  cebs: Ceb[];
  total: number;
  page: number;
  limit: number;
}

export interface CebCreateRequest {
  nom: string;
  identifiant?: string;
  paroisse_id: number;
  president_id?: number | null;
}

export interface CebUpdateRequest {
  ceb_id: number;
  nom: string;
  identifiant?: string;
  president_id?: number | null;
}

export interface CebDeleteRequest {
  ceb_id: number;
}

// Types pour les props des composants
export interface ModifierCebFormProps {
  onClose: () => void;
  cebData: Ceb;
  onSuccess: (item: Ceb) => void;
}

export interface AjouterCebFormProps {
  onClose: () => void;
  onSuccess: (item: Ceb) => void;
}

export interface DeleteCebConfirmationProps {
  onClose: () => void;
  cebData: Ceb;
  onSuccess: (deletedId: number) => void;
}