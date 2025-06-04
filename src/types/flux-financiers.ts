/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// types/flux-financiers.ts
export interface FluxFinancier {
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

export interface CompteStatistiques {
  id: number;
  abonnement: number;
  demande_de_messe: number;
  denier_de_culte: number;
  quete: number;
  don: number;
}

export type TransactionType = 
  | "TOUT"
  | "DÉPÔT"
  | "RETRAIT"
  | "AIDE"
  | "DIME"
  | "OFFRANDE"
  | "TRANSFERT"
  | "ABONNEMENT"
  | "COTISATION"
  | "DEMANDE DE MESSE"
  | "DENIER DE CULTE"
  | "DON"
  | "PARTICIPATION"
  | "QUÊTE";

export type TransactionStatus = 
  | "TOUT"
  | "EN ATTENTE"
  | "SUCCÈS"
  | "ECHEC";

export const TRANSACTION_TYPES: TransactionType[] = [
  "TOUT",
  "DÉPÔT",
  "RETRAIT",
  "AIDE",
  "DIME",
  "OFFRANDE",
  "TRANSFERT",
  "ABONNEMENT",
  "COTISATION",
  "DEMANDE DE MESSE",
  "DENIER DE CULTE",
  "DON",
  "PARTICIPATION",
  "QUÊTE",
];

export const TRANSACTION_STATUS: TransactionStatus[] = [
  "TOUT",
  "EN ATTENTE",
  "SUCCÈS",
  "ECHEC"
];