/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// lib/sacrement-utils.ts
import { Heart } from "lucide-react";
import { SacrementIndividuel } from "@/types/sacrement";
import React from "react";

// Formatage de la date
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "Date inconnue";
  }
};

// Extraire le statut à partir de la date
export const extractStatut = (sacrement: SacrementIndividuel) => {
  if (sacrement.statut) return sacrement.statut;

  const dateObj = new Date(sacrement.date);
  const now = new Date();

  if (dateObj < now) return "terminé";
  if (dateObj.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000)
    return "confirmé";
  if (dateObj.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000)
    return "en préparation";
  return "demande reçue";
};

// Formater soustype de sacrement pour Badge
export const getSacrementSoustypeDetails = (soustype: string) => {
  const soustypeLC = soustype.toLowerCase();

  if (soustypeLC.includes("baptême") || soustypeLC === "bapteme") {
    return {
      label: "Baptême",
      variant: "default" as const,
      icon: React.createElement(Heart, { className: "h-4 w-4 mr-1" }),
      category: "baptemes",
    };
  } else if (soustypeLC.includes("communion")) {
    return {
      label: "Première Communion",
      variant: "success" as const,
      icon: React.createElement(Heart, { className: "h-4 w-4 mr-1" }),
      category: "firstcommunions",
    };
  } else if (soustypeLC.includes("profession")) {
    return {
      label: "Profession de Foi",
      variant: "contained",
      color: "error",
      icon: React.createElement(Heart, { className: "h-4 w-4 mr-1" }),
      category: "professiondefoi",
    };
  } else if (soustypeLC.includes("malade")) {
    return {
      label: "Sacrement de Malade",
      variant: "primary" as const,
      icon: React.createElement(Heart, { className: "h-4 w-4 mr-1" }),
      category: "sacrementdemalade",
    };
  } else {
    return {
      label: soustype,
      variant: "default" as const,
      icon: React.createElement(Heart, { className: "h-4 w-4 mr-1" }),
      category: "autres",
    };
  }
};

// Détails du statut
export const getStatusDetails = (statut: string) => {
  switch (statut) {
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "en préparation":
      return { label: "En préparation", variant: "secondary" as const };
    case "demande reçue":
      return { label: "Demande reçue", variant: "outline" as const };
    case "terminé":
      return { label: "Terminé", variant: "default" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Fonction pour récupérer l'ID de la paroisse depuis le profil utilisateur
export const getUserParoisseId = () => {
  try {
    const userProfileStr = localStorage.getItem("user_profile");
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      return userProfile.paroisse_id || 0;
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du profil:", err);
  }

  // Récupérer depuis un autre emplacement si nécessaire
  const paroisseId = localStorage.getItem("paroisse_id");
  if (paroisseId && !isNaN(parseInt(paroisseId))) {
    return parseInt(paroisseId);
  }

  return 0; // Valeur par défaut
};

// Compter les sacrements par catégorie
export const countSacrements = (sacrements: SacrementIndividuel[]) => {
  const counts = {
    baptemes: 0,
    firstcommunions: 0,
    professiondefoi: 0,
    sacrementdemalade: 0,
  };

  sacrements.forEach((sacrement) => {
    const category = getSacrementSoustypeDetails(sacrement.soustype).category;
    if (counts.hasOwnProperty(category)) {
      counts[category as keyof typeof counts]++;
    }
  });

  return counts;
};

// Fonction pour exporter les données en CSV
export const exportSacrementsToCSV = (sacrements: SacrementIndividuel[]) => {
  // Créer les en-têtes du CSV
  let csvContent = "ID,Type,Date,Description,Célébrant,Statut\n";

  // Ajouter les données
  sacrements.forEach((sacrement) => {
    const statut = extractStatut(sacrement);
    const celebrantName = sacrement.celebrant
      ? `${sacrement.celebrant.prenoms} ${sacrement.celebrant.nom}`
      : `ID: ${sacrement.celebrant_id}`;

    // Échapper les virgules et les guillemets dans la description
    const safeDescription = sacrement.description.replace(/"/g, '""');

    csvContent += `${sacrement.id},"${sacrement.soustype}","${sacrement.date}","${safeDescription}","${celebrantName}","${statut}"\n`;
  });

  // Créer un Blob et télécharger
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `sacrements_individuels_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};