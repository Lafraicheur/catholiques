// types/sacrement.ts
export interface SacrementIndividuel {
    id: number;
    created_at: string;
    type: string;
    soustype: string;
    date: string;
    description: string;
    celebrant_id: number;
    paroisse_id: number;
    chapelle_id: number | null;
    certificateur_id: number | null;
    celebrant?: {
        id: number;
        nom: string;
        prenoms: string;
    };
    // Champs supplémentaires qui pourraient être utiles
    lieu?: string;
    heure?: string;
    personne?: string;
    statut?: string;
    preparation?: string;
}

export interface SacrementCounts {
    baptemes: number;
    firstcommunions: number;
    professiondefoi: number;
    sacrementdemalade: number;
}