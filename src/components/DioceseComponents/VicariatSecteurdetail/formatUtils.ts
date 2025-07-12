/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Fonctions utilitaires de formatage
export const formatOrganisation = (organisation: any): string => {
  if (!organisation) return "N/A";

  if (typeof organisation === "string") return organisation;

  if (typeof organisation === "object") {
    const parts: string[] = [];

    if (organisation.vicaire_episcopal) {
      const vicaire = organisation.vicaire_episcopal;
      if (vicaire.nom && vicaire.prenoms) {
        parts.push(`Vicaire: ${vicaire.prenoms} ${vicaire.nom}`);
      }
    }

    if (organisation.cure_doyens && Array.isArray(organisation.cure_doyens)) {
      const cures = organisation.cure_doyens
        .map((cure: any) =>
          cure.nom && cure.prenoms
            ? `${cure.prenoms} ${cure.nom}`
            : "Non défini"
        )
        .join(", ");
      parts.push(`Curés doyens: ${cures}`);
    }

    return parts.length > 0 ? parts.join(" | ") : "Structure complexe";
  }

  return String(organisation);
};

export const formatLocalisation = (localisation: any): string => {
  if (!localisation) return "Non spécifiée";

  if (typeof localisation === "string") return localisation;

  if (typeof localisation === "object") {
    if (localisation.type === "point" && localisation.data) {
      const { lng, lat } = localisation.data;
      return `Coordonnées: ${lat}°, ${lng}°`;
    }

    return "[Localisation géographique]";
  }

  return String(localisation);
};

export const sanitizeForRender = (value: any): string | number => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "object") {
    if (value.type && value.data) {
      return formatLocalisation(value);
    }

    if (value.url) {
      return value.url;
    }

    if (value.nom) {
      return value.nom;
    }

    if (value.vicaire_episcopal || value.cure_doyens) {
      return formatOrganisation(value);
    }

    try {
      const keys = Object.keys(value);
      if (keys.length === 0) return "N/A";
      return `[Objet: ${keys.join(", ")}]`;
    } catch (error) {
      return "[Objet complexe]";
    }
  }

  return String(value);
};

export const formatDate = (timestamp: string | number | null | undefined): string => {
  if (!timestamp) return "Non renseignée";

  try {
    const date = new Date(
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp
    );

    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (err) {
    console.error("Erreur lors du formatage de la date:", err);
    return String(timestamp);
  }
};