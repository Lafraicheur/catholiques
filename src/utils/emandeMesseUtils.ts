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

// export const formatDate = (dateString: string | null | undefined): string => {
//   if (!dateString) return "Non renseignée";
//   try {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("fr-FR").format(date);
//   } catch (err) {
//     console.error("Erreur lors du formatage de la date:", err);
//     return dateString;
//   }
// };

export const formatDate = (dateString: string | number | Date | null | undefined): string => {
  if (!dateString) return "Non renseignée";
  
  try {
    let date: Date;
    
    // Si c'est déjà un objet Date
    if (dateString instanceof Date) {
      date = dateString;
    }
    // Si c'est un timestamp (number)
    else if (typeof dateString === 'number') {
      date = new Date(dateString);
    }
    // Si c'est une string
    else {
      const dateStr = String(dateString);
      
      // Vérifier si c'est au format français DD/MM/YYYY
      if (dateStr.includes('/') && dateStr.split('/').length === 3) {
        const [day, month, year] = dateStr.split('/');
        date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      } else {
        date = new Date(dateStr);
      }
    }
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.error("Date invalide:", dateString);
      return "Date invalide";
    }
    
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "2-digit", 
      month: "long",
      year: "numeric"
    }).format(date);
  } catch (err) {
    console.error("Erreur lors du formatage de la date:", err);
    return String(dateString) || "Date invalide";
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