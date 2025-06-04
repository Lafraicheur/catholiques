/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// lib/union-utils.ts
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SacrementUnion, UnionCounts } from "@/types/union";

// Formatage de la date
export const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return format(date, "d MMMM yyyy", { locale: fr });
    } catch (error) {
        return "Date inconnue";
    }
};

const variantClasses: Record<string, string> = {
    success: "bg-green-500 text-white",
    warning: "bg-yellow-400 text-black",
    danger: "bg-red-500 text-white",
    info: "bg-blue-400 text-white",
    default: "bg-gray-300 text-gray-800",
    secondary: "bg-gray-500 text-white",
    primary: "bg-blue-600 text-white",
    outline: "border border-gray-400 text-gray-700",
};

// Obtenir les détails du statut
const getStatusDetails = (statut: string) => {
    const normalized = statut.toUpperCase();

    if (["CONFIRMÉ", "CONFIRME", "VALIDÉ", "VALIDE"].includes(normalized)) {
        return { label: "Validé", variant: "success" as const };
    }

    if (["EN ATTENTE", "ATTENTE"].includes(normalized)) {
        return { label: "En attente", variant: "warning" as const };
    }

    if (["REJETÉ", "REJETE"].includes(normalized)) {
        return { label: "Rejeté", variant: "danger" as const };
    }

    return { label: statut, variant: "outline" as const };
};

// // Obtenir les détails du statut
// export const getStatusDetails = (statut: string) => {
//     const normalizedStatus = statut.toUpperCase();

//     switch (normalizedStatus) {
//         case "CONFIRMÉ":
//         case "CONFIRME":
//         case "VALIDÉ":
//         case "VALIDE":
//             return { label: "Validé", variant: "success" as const };
//         case "EN ATTENTE":
//         case "ATTENTE":
//             return { label: "En attente", variant: "warning" as const };
//         case "REJETE":
//         case "REJETÉ":
//             return { label: "Rejeté", variant: "danger" as const };
//         default:
//             return { label: statut, variant: "outline" as const };
//     }
// };

// Compter les sacrements par statut
export const countUnions = (sacrements: SacrementUnion[]): UnionCounts => {
    const counts = {
        enAttente: 0,
        rejete: 0,
        confirmes: 0,
        termines: 0,
    };

    sacrements.forEach((sacrement) => {
        const status = sacrement.statut.toUpperCase();
        if (status === "EN ATTENTE") {
            counts.enAttente++;
        } else if (status === "EN PRÉPARATION" || status === "EN PREPARATION") {
            counts.rejete++;
        } else if (status === "CONFIRMÉ" || status === "CONFIRME" || status === "VALIDÉ" || status === "VALIDE") {
            counts.confirmes++;
        } else if (status === "TERMINÉ" || status === "TERMINE") {
            counts.termines++;
        }
    });

    return counts;
};

// Récupérer l'ID de la paroisse
export const getUserParoisseId = (): string => {
    try {
        const userProfileStr = localStorage.getItem("user_profile");
        if (userProfileStr) {
            const userProfile = JSON.parse(userProfileStr);
            return userProfile.paroisse_id || "1";
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
    }
    return "1"; // Valeur par défaut
};