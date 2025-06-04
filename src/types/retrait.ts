// types/retrait.ts
export interface RetraitRequest {
    compte_id: number;
    id_sous_compte: string;
    montant: number;
    operateur: string;
    num_de_telephone: string;
}

export interface RetraitResponse {
    item: string;
    payzenApi: string;
}

export type Operateur = "ORANGE" | "MOOV" | "MTN" | "WAVE";

export const OPERATEURS: Operateur[] = ["ORANGE", "MOOV", "MTN", "WAVE"];

export const SOUS_COMPTES = {
    "1": "abonnement",
    "2": "demande de messe",
    "3": "denier de culte",
    "4": "quete",
    "5": "don"
} as const;

export const OPERATEUR_LOGOS = {
    ORANGE: "/images/operateurs/orange.png",
    MOOV: "/images/operateurs/moov.png",
    MTN: "/images/operateurs/mtn.png",
    WAVE: "/images/operateurs/wave.png"
} as const;

export type SousCompteId = keyof typeof SOUS_COMPTES;