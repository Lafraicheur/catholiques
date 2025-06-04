/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ReactNode } from "react";

// types/union.ts
export interface Personne {
  id: number;
  nom: string;
  prenoms: string;
  num_de_telephone: string;
  email?: string;
  date_de_naissance?: string;
}

export interface SacrementUnion {
  marie_ou_mariee: ReactNode;
  paroissien: any;
  id: number;
  created_at: string;
  type: string;
  date: string;
  description: string;
  statut: string;
  temoin_marie: string;
  temoin_mariee: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  marie_id: number;
  mariee_id: number;
  images?: Array<any>;
  celebrant?: Personne;
  marie?: Personne;
  mariee?: Personne;
}

export interface UnionCounts {
  enAttente: number;
  rejete: number;
  confirmes: number;
}

export type UnionTabValue = "tous" | "en-attente" | "rejete" | "confirmes";