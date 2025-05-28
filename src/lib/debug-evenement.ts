// utils/debug-evenement.ts

/**
 * Helper pour debugger les données d'événement avant envoi à l'API
 */
export function debugEvenementData(evenement: any, formData: any) {
  console.group("🔍 Debug Événement");
  
  console.log("📋 Événement original:", {
    id: evenement?.id,
    type: evenement?.type,
    libelle: evenement?.libelle,
    est_actif: evenement?.est_actif,
    date_de_debut: evenement?.date_de_debut,
    date_de_fin: evenement?.date_de_fin,
  });

  console.log("📝 Données du formulaire:", {
    type: formData?.type,
    libelle: formData?.libelle,
    description: formData?.description,
    paroisse_id: formData?.paroisse_id,
    dates: formData?.dates,
    est_actif: formData?.est_actif,
  });

  // Vérifications importantes
  const checks = {
    "✅ Type défini": !!formData?.type,
    "✅ Libellé rempli": !!formData?.libelle?.trim(),
    "✅ Description remplie": !!formData?.description?.trim(),
    "✅ Paroisse ID valide": !!(formData?.paroisse_id && formData.paroisse_id > 0),
    "✅ Dates définies": !!(formData?.dates && formData.dates.length > 0),
  };

  console.log("🔎 Vérifications:", checks);

  // Identifier les problèmes
  const problems = Object.entries(checks)
    .filter(([_, isValid]) => !isValid)
    .map(([check, _]) => check.replace("✅", "❌"));

  if (problems.length > 0) {
    console.warn("⚠️ Problèmes détectés:", problems);
  } else {
    console.log("✅ Toutes les vérifications passent");
  }

  console.groupEnd();
}

/**
 * Helper pour debugger la structure de données API
 */
export function debugApiPayload(payload: any) {
  console.group("📡 Debug Payload API");
  
  console.log("📦 Structure complète:", JSON.stringify(payload, null, 2));
  
  // Vérifier la structure attendue
  const hasValidStructure = Object.keys(payload).some(key => 
    ["DON", "MESSE", "ACTIVITÉ", "COTISATION", "INSCRIPTION"].includes(key)
  );
  
  console.log("🏗️ Structure valide:", hasValidStructure);
  
  if (hasValidStructure) {
    const typeKey = Object.keys(payload)[0];
    const eventData = payload[typeKey];
    
    console.log(`📋 Données ${typeKey}:`, {
      type: eventData?.type,
      libelle: eventData?.libelle,
      dates: eventData?.dates,
      description: eventData?.description,
      paroisse_id: eventData?.paroisse_id,
    });
  }
  
  console.groupEnd();
}

/**
 * Fonction pour nettoyer les données avant envoi
 */
export function cleanEvenementData(formData: any) {
  // Supprimer les valeurs undefined et null
  const cleaned = Object.entries(formData).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {} as any);

  // S'assurer que les dates sont des nombres
  if (cleaned.dates) {
    cleaned.dates = cleaned.dates.map((date: any) => {
      if (typeof date === "string") {
        return Math.floor(new Date(date).getTime() / 1000);
      }
      return typeof date === "number" ? date : Math.floor(Date.now() / 1000);
    });
  }

  // S'assurer que les IDs sont des nombres
  if (cleaned.paroisse_id && typeof cleaned.paroisse_id === "string") {
    cleaned.paroisse_id = parseInt(cleaned.paroisse_id, 10);
  }

  // S'assurer que les montants sont des nombres
  ["solde_cible", "montant_par_paroissien", "heure_de_debut", "heure_de_fin", "date_de_fin"].forEach(field => {
    if (cleaned[field] && typeof cleaned[field] === "string") {
      cleaned[field] = parseFloat(cleaned[field]) || 0;
    }
  });

  return cleaned;
}