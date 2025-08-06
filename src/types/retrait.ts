/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// // types/retrait.ts
// export interface RetraitRequest {
//     compte_id: number;
//     id_sous_compte: string;
//     montant: number;
//     operateur: string;
//     num_de_telephone: string;
// }

// export interface RetraitResponse {
//     item: string;
//     payzenApi: string;
// }

// export type Operateur = "ORANGE" | "MOOV" | "MTN" | "WAVE";

// export const OPERATEURS: Operateur[] = ["ORANGE", "MOOV", "MTN", "WAVE"];

// export const SOUS_COMPTES = {
//     "1": "abonnement",
//     "2": "demande de messe",
//     "3": "denier de culte",
//     "4": "quete",
//     "5": "don"
// } as const;

// export const OPERATEUR_LOGOS = {
//     ORANGE: "/images/operateurs/orange.png",
//     MOOV: "/images/operateurs/moov.png",
//     MTN: "/images/operateurs/mtn.png",
//     WAVE: "/images/operateurs/wave.png"
// } as const;

// export type SousCompteId = keyof typeof SOUS_COMPTES;


// types/retrait.ts



// Types pour les sous-comptes
export interface SousCompte {
    field: string;
    label: string;
    montant: number;
}

// Types d'opérateurs de paiement mobile
export type MoyenPaiement = "WAVE" | "ORANGE" | "MOOV" | "MTN" | "TREMO" | "PAYTOU";

// Requête de retrait selon la nouvelle API
export interface RetraitRequest {
    paroisse_id: number;
    montant: number;
    frais: number;
    montant_avec_frais: number;
    num_de_telephone: string;
    moyen: MoyenPaiement;
    souscomptes: SousCompte[];
}

// Réponse de l'API de retrait
export interface RetraitResponse {
    item: string;
    payzen_item: string;
}

// Données du formulaire de retrait (sans les champs calculés)
export interface RetraitFormData {
    montant: number;
    souscomptes: SousCompte[];
    num_de_telephone: string;
    moyen: MoyenPaiement;
}

// Statistiques des comptes
export interface CompteStatistiques {
    id: number;
    abonnement: number;
    demande_de_messe: number;
    denier_de_culte: number;
    quete: number;
    don: number;
}

// Information sur un sous-compte
export interface SousCompteInfo {
    field: string;
    label: string;
    solde: number;
}

// Configuration des frais par opérateur
export interface FraisConfig {
    [key: string]: number;
}

// Réponse générique de l'API
export interface ApiResponse<T = any> {
    item?: T;
    items?: T[];
    message?: string;
    error?: string;
}

// États de validation
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Données pour le calcul de frais
export interface FraisCalculation {
    montant: number;
    frais: number;
    montantAvecFrais: number;
    tauxFrais: number;
}

// Options de retrait disponibles
export interface RetraitOption {
    field: string;
    label: string;
    solde: number;
    selected: boolean;
    montant: number;
}

// Résumé du retrait avant confirmation
export interface RetraitSummary {
    montantTotal: number;
    frais: number;
    montantAvecFrais: number;
    operateur: MoyenPaiement;
    numeroTelephone: string;
    souscomptes: SousCompte[];
    tauxFrais: number;
}