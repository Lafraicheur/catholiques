// utils/formatters.ts
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatters = {
  // Formater la date: 2023-05-15 -> 15 mai 2023
  date: (dateString: string): string => {
    if (dateString === "now") return "Récemment";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (err) {
      return "Date inconnue";
    }
  },

  // Formater le numéro pour l'affichage: 0123456789 -> 01 23 45 67 89
  phone: (phone: string): string => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const groups = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      groups.push(cleaned.slice(i, i + 2));
    }
    return groups.join(" ");
  },

  // Formater pour l'export avec date et heure
  exportDate: (): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  },

  // Valider le numéro de téléphone
  validatePhone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 8 && cleaned.length <= 15;
  },
};
