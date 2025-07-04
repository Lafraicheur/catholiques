// Fichier: types.ts
// Contient toutes les définitions de types et fonctions utilitaires

// Types pour les événements
export type EventType =
  | "messe"
  | "formation"
  | "reunion"
  | "sacrement"
  | "priere"
  | "preparation";

export type EventStatus = "programmé" | "confirmé" | "terminé" | "annulé";

export interface Evenement {
  id: number;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  description: string;
  type: EventType;
  statut: EventStatus;
  responsable: string;
}

// Formatage de la date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Formater type d'événement pour Badge
export const getEventTypeDetails = (type: EventType) => {
  switch (type) {
    case "messe":
      return { label: "Messe", variant: "default" as const };
    case "formation":
      return { label: "Formation", variant: "secondary" as const };
    case "reunion":
      return { label: "Réunion", variant: "outline" as const };
    case "sacrement":
      return { label: "Sacrement", variant: "destructive" as const };
    case "priere":
      return { label: "Prière", variant: "success" as const };
    case "preparation":
      return { label: "Préparation", variant: "secondary" as const };
    default:
      return { label: type, variant: "default" as const };
  }
};

// Formater statut d'événement pour Badge
export const getEventStatusDetails = (statut: EventStatus) => {
  switch (statut) {
    case "programmé":
      return { label: "Programmé", variant: "outline" as const };
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "terminé":
      return { label: "Terminé", variant: "secondary" as const };
    case "annulé":
      return { label: "Annulé", variant: "destructive" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Obtenir les types d'événements pour les filtres
export const getTypesEvenements = () => {
  return [
    { value: "tous", label: "Tous les types" },
    { value: "messe", label: "Messe" },
    { value: "formation", label: "Formation" },
    { value: "reunion", label: "Réunion" },
    { value: "sacrement", label: "Sacrement" },
    { value: "priere", label: "Prière" },
    { value: "preparation", label: "Préparation" },
  ];
};

// Obtenir les mois pour les filtres
export const getMois = () => {
  return [
    { value: 0, label: "Janvier" },
    { value: 1, label: "Février" },
    { value: 2, label: "Mars" },
    { value: 3, label: "Avril" },
    { value: 4, label: "Mai" },
    { value: 5, label: "Juin" },
    { value: 6, label: "Juillet" },
    { value: 7, label: "Août" },
    { value: 8, label: "Septembre" },
    { value: 9, label: "Octobre" },
    { value: 10, label: "Novembre" },
    { value: 11, label: "Décembre" },
  ];
};