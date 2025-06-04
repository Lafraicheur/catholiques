// types/nonParoissien.ts
export interface NonParoissien {
    id: number;
    created_at: string;
    nom: string;
    prenom: string;
    genre: "M" | "F";
    num_de_telephone: string;
}

// Type pour les données du formulaire (sans created_at car généré par l'API)
export interface NonParoissienFormData {
    nonparoissien_id: number;
    nom: string;
    prenom: string;
    genre: "M" | "F";
    num_de_telephone: string;
}

// Type pour la création (sans id et created_at)
export interface CreateNonParoissienData {
    nom: string;
    prenom: string;
    genre: "M" | "F";
    num_de_telephone: string;
}

// Type pour la mise à jour (avec id mais sans created_at)
export interface UpdateNonParoissienData {
    nonparoissien_id: number;
    nom: string;
    prenom: string;
    genre: "M" | "F";
    num_de_telephone: string;
}

export interface FormErrors {
    nom?: string;
    prenom?: string;
    genre?: string;
    num_de_telephone?: string;
}