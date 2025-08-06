// utils/retrait.ts

import { SousCompte, MoyenPaiement, FraisConfig, ValidationResult, FraisCalculation } from "@/types/retrait";

// Configuration des frais par opérateur (en pourcentage)
export const FRAIS_CONFIG: FraisConfig = {
    "WAVE": 1.5,
    "ORANGE": 1.0,
    "MOOV": 1.0,
    "MTN": 1.0,
    "TREMO": 1.0,
    "PAYTOU": 1.0,
};

// Labels des sous-comptes
export const SOUSCOMPTE_LABELS: { [key: string]: string } = {
    "abonnement": "Abonnement",
    "demande_de_messe": "Demande de messe",
    "denier_de_culte": "Denier de culte",
    "quete": "Quête",
    "don": "Don",
};

// Calculer les frais selon l'opérateur
export const calculateFrais = (montant: number, moyen: MoyenPaiement): FraisCalculation => {
    const tauxFrais = FRAIS_CONFIG[moyen] || 1.0;
    const frais = Math.round((montant * tauxFrais) / 100);
    const montantAvecFrais = montant + frais;
    
    return {
        montant,
        frais,
        montantAvecFrais,
        tauxFrais,
    };
};

// Valider un numéro de téléphone
export const validatePhoneNumber = (numero: string): boolean => {
    // Retirer tous les espaces et caractères non-numériques
    const cleanNumber = numero.replace(/\D/g, '');
    // Vérifier que c'est exactement 10 chiffres
    return /^[0-9]{10}$/.test(cleanNumber);
};

// Formater un numéro de téléphone pour l'affichage
export const formatPhoneNumber = (numero: string): string => {
    const cleanNumber = numero.replace(/\D/g, '');
    if (cleanNumber.length === 10) {
        return cleanNumber.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    return numero;
};

// Valider les données de retrait
export const validateRetraitData = (data: {
    montant: number;
    souscomptes: SousCompte[];
    num_de_telephone: string;
    moyen: MoyenPaiement;
}, soldes?: { [key: string]: number }): ValidationResult => {
    const errors: string[] = [];

    // Validation du montant
    if (!data.montant || data.montant <= 0) {
        errors.push("Le montant doit être supérieur à 0");
    }

    // Validation du numéro de téléphone
    if (!data.num_de_telephone) {
        errors.push("Le numéro de téléphone est requis");
    } else if (!validatePhoneNumber(data.num_de_telephone)) {
        errors.push("Le numéro de téléphone doit contenir exactement 10 chiffres");
    }

    // Validation du moyen de paiement
    if (!data.moyen) {
        errors.push("Le moyen de paiement est requis");
    } else if (!Object.keys(FRAIS_CONFIG).includes(data.moyen)) {
        errors.push("Moyen de paiement non supporté");
    }

    // Validation des sous-comptes
    if (!data.souscomptes || data.souscomptes.length === 0) {
        errors.push("Au moins un sous-compte doit être sélectionné");
    } else {
        // Vérifier la somme des montants
        const sommeSousComptes = data.souscomptes.reduce((sum, sc) => sum + sc.montant, 0);
        if (Math.abs(sommeSousComptes - data.montant) > 0.01) {
            errors.push("La somme des sous-comptes ne correspond pas au montant total");
        }

        // Vérifier chaque sous-compte
        data.souscomptes.forEach((souscompte, index) => {
            if (!souscompte.field) {
                errors.push(`Sous-compte ${index + 1}: champ manquant`);
            }
            if (!souscompte.label) {
                errors.push(`Sous-compte ${index + 1}: libellé manquant`);
            }
            if (!souscompte.montant || souscompte.montant <= 0) {
                errors.push(`Sous-compte ${index + 1}: montant invalide`);
            }

            // Vérifier les soldes disponibles si fournis
            if (soldes && souscompte.field in soldes) {
                const soldeDisponible = soldes[souscompte.field];
                if (souscompte.montant > soldeDisponible) {
                    errors.push(
                        `${souscompte.label}: solde insuffisant (disponible: ${soldeDisponible} FCFA, demandé: ${souscompte.montant} FCFA)`
                    );
                }
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Formater un montant en FCFA
export const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(montant).replace('XOF', 'FCFA');
};

// Générer un résumé du retrait
export const generateRetraitSummary = (data: {
    montant: number;
    souscomptes: SousCompte[];
    num_de_telephone: string;
    moyen: MoyenPaiement;
}) => {
    const fraisCalc = calculateFrais(data.montant, data.moyen);
    
    return {
        montantTotal: data.montant,
        frais: fraisCalc.frais,
        montantAvecFrais: fraisCalc.montantAvecFrais,
        operateur: data.moyen,
        numeroTelephone: formatPhoneNumber(data.num_de_telephone),
        souscomptes: data.souscomptes,
        tauxFrais: fraisCalc.tauxFrais,
    };
};

// Convertir les soldes en options de sous-comptes
export const convertSoldesToOptions = (soldes: { [key: string]: number }) => {
    return Object.entries(SOUSCOMPTE_LABELS).map(([field, label]) => ({
        field,
        label,
        solde: soldes[field] || 0,
        selected: false,
        montant: 0,
    })).filter(option => option.solde > 0); // Ne montrer que les comptes avec solde > 0
};

// Vérifier si un retrait est possible
export const canMakeRetrait = (soldes: { [key: string]: number }, montantDemande: number): boolean => {
    const totalDisponible = Object.values(soldes).reduce((sum, solde) => sum + solde, 0);
    return totalDisponible >= montantDemande;
};

// Obtenir le montant minimum pour un retrait (basé sur les frais minimums)
export const getMinimumRetraitAmount = (): number => {
    return 100; // 100 FCFA minimum par exemple
};

// Obtenir le montant maximum pour un retrait
export const getMaximumRetraitAmount = (soldes: { [key: string]: number }): number => {
    return Object.values(soldes).reduce((sum, solde) => sum + solde, 0);
};