// =============================================================================
// 2. UTILITAIRES - utils/demandeMesseUtils.ts
// =============================================================================

export const formatTimestamp = (timestamp: number): string => {
  return new Intl.DateTimeFormat("fr-FR").format(new Date(timestamp));
};

export const formatTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Non renseignée";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  } catch (err) {
    console.error("Erreur lors du formatage de la date:", err);
    return dateString;
  }
};

export const getIntentionLabel = (intention: string): string => {
  const intentionLabels: Record<string, string> = {
    "0": "Action de Grâce",
    "1": "Aide, assistance et protection",
    "2": "Rappel à Dieu",
  };
  return intentionLabels[intention] || intention;
};

export const getUserParoisseId = (): number => {
  try {
    const userProfileStr = localStorage.getItem("user_profile");
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      return userProfile.paroisse_id || 0;
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du profil:", err);
  }
  return 0;
};

export const getParoisseName = (): string => {
  try {
    const userProfileStr = localStorage.getItem("user_profile");
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      return userProfile.paroisse_nom || "Paroisse";
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du nom de la paroisse:", err);
  }
  return "Paroisse";
};

export const formatExportDate = (): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
};