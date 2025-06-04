/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  XCircle,
  CheckCircle,
  Hand,
  Clock,
  Eye,
  Filter,
  Calendar,
  MapPin,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Imports supplémentaires à ajouter
import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
interface Initiateur {
  nom: string;
  prenoms: string;
  num_de_telephone: string;
}

interface Messe {
  id: number;
  created_at: string;
  libelle: string;
  type: string;
  date_de_debut: number;
  extras: {
    type_messe: string;
    heure_de_fin: number;
    heure_de_debut: number;
    prix_demande_de_messe: number;
  };
  paroisse_id: number;
}

interface DemandeMesse {
  id: number;
  created_at: string;
  demandeur: string;
  intention: string;
  concerne: string;
  description: string;
  est_payee: boolean;
  messe_id: number;
  paroisse_id: number;
  messe?: Messe;
  initiateur?: Initiateur;
}

// Interface pour les filtres de messe
interface MesseFilters {
  libelle: string;
  dateDebut: string;
  heureFin: string;
}

// Service pour récupérer les demandes de messe
const fetchDemandesMesse = async (
  paroisseId: number
): Promise<DemandeMesse[]> => {
  const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new AuthenticationError("Token d'authentification non trouvé");
  }

  try {
    const response = await axios.get(`${API_URL}/demandemesse/obtenir-tous`, {
      params: { paroisse_id: paroisseId },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return response.data.items || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";

      switch (statusCode) {
        case 401:
          throw new AuthenticationError(errorMessage);
        case 403:
          throw new ForbiddenError(errorMessage);
        case 404:
          throw new NotFoundError(errorMessage);
        default:
          throw new Error(errorMessage);
      }
    }
    throw error;
  }
};

export default function DemandeMessePage() {
  const router = useRouter();
  const [demandes, setDemandes] = useState<DemandeMesse[]>([]);
  const [filteredDemandes, setFilteredDemandes] = useState<DemandeMesse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Filtres
  const [filtrePayee, setFiltrePayee] = useState<boolean | null>(null);
  const [messeFilters, setMesseFilters] = useState<MesseFilters>({
    libelle: "",
    dateDebut: "",
    heureFin: "",
  });

  // Récupérer l'ID de la paroisse à partir du localStorage
  const getUserParoisseId = (): number => {
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

  // Charger les demandes de messe au montage du composant
  useEffect(() => {
    const loadDemandesMesse = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchDemandesMesse(paroisseId);
        setDemandes(data);
        setFilteredDemandes(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des demandes de messe:", err);
        if (err instanceof AuthenticationError) {
          toast.error("Session expirée", {
            description: "Veuillez vous reconnecter pour continuer.",
          });
          router.push("/login");
        } else if (err instanceof ForbiddenError) {
          setError(
            "Vous n'avez pas les droits nécessaires pour accéder à cette ressource."
          );
        } else if (err instanceof NotFoundError) {
          setError("Aucune demande de messe trouvée pour cette paroisse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDemandesMesse();
  }, [router]);

  // Utilitaires pour le formatage des dates et heures
  const formatTimestamp = (timestamp: number): string => {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(timestamp));
  };

  const formatTime = (timestamp: number): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  // Obtenir les options uniques pour les filtres
  const getUniqueMesseLibelles = (): string[] => {
    const libelles = demandes
      .map((d) => d.messe?.libelle)
      .filter((libelle): libelle is string => Boolean(libelle));
    return [...new Set(libelles)].sort();
  };

  const getUniqueDatesDebut = (): string[] => {
    const dates = demandes
      .map((d) => d.messe?.date_de_debut)
      .filter((date): date is number => Boolean(date))
      .map((timestamp) => formatTimestamp(timestamp));
    return [...new Set(dates)].sort();
  };

  const getUniqueHeuresFin = (): string[] => {
    const heures = demandes
      .map((d) => d.messe?.extras?.heure_de_fin)
      .filter((heure): heure is number => Boolean(heure))
      .map((timestamp) => formatTime(timestamp));
    return [...new Set(heures)].sort();
  };

  // Filtrer les demandes selon tous les critères
  useEffect(() => {
    let results = demandes;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (demande) =>
          demande.demandeur.toLowerCase().includes(query) ||
          demande.concerne.toLowerCase().includes(query) ||
          demande.intention.toLowerCase().includes(query) ||
          demande.description?.toLowerCase().includes(query)
      );
    }

    // Filtrer par statut de paiement
    if (filtrePayee !== null) {
      results = results.filter((demande) => demande.est_payee === filtrePayee);
    }

    // Filtrer par libellé de messe
    if (messeFilters.libelle) {
      results = results.filter(
        (demande) => demande.messe?.libelle === messeFilters.libelle
      );
    }

    // Filtrer par date de début
    if (messeFilters.dateDebut) {
      results = results.filter((demande) => {
        if (!demande.messe?.date_de_debut) return false;
        return (
          formatTimestamp(demande.messe.date_de_debut) ===
          messeFilters.dateDebut
        );
      });
    }

    // Filtrer par heure de fin
    if (messeFilters.heureFin) {
      results = results.filter((demande) => {
        if (!demande.messe?.extras?.heure_de_fin) return false;
        return (
          formatTime(demande.messe.extras.heure_de_fin) ===
          messeFilters.heureFin
        );
      });
    }

    setFilteredDemandes(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, filtrePayee, messeFilters, demandes, itemsPerPage]);

  // Réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchQuery("");
    setFiltrePayee(null);
    setMesseFilters({
      libelle: "",
      dateDebut: "",
      heureFin: "",
    });
  };

  // Calculer les demandes à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDemandes.slice(startIndex, endIndex);
  };

  const getParoisseName = (): string => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.paroisse_nom || "Paroisse";
      }
    } catch (err) {
      console.error(
        "Erreur lors de la récupération du nom de la paroisse:",
        err
      );
    }
    return "Paroisse";
  };

  const formatExportDate = (): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  };

  const getIntentionLabel = (intention: string): string => {
    const intentionLabels: Record<string, string> = {
      "1": "PRIÈRE DE REMERCIEMENT",
      "2": "PRIÈRE D'INTERCESSION",
      "3": "MESSE DE REQUIEM",
    };
    return intentionLabels[intention] || intention;
  };

  // Export individuel d'une demande
  const exportIndividualDemande = async (
    demande: DemandeMesse,
    format: "excel" | "pdf"
  ) => {
    try {
      setExporting(true);
      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();

      if (format === "excel") {
        const exportData = [
          {
            "Demande ID": demande.id,
            "Date de demande": formatDate(demande.created_at),
            Initiateur: demande.initiateur
              ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
              : "N/A",
            Téléphone: demande.initiateur?.num_de_telephone || "N/A",
            Demandeur: demande.demandeur,
            Intention: getIntentionLabel(demande.intention),
            Concerne: demande.concerne,
            Description: demande.description || "N/A",
            "Statut de paiement": demande.est_payee ? "Payée" : "Non payée",
            Messe: demande.messe?.libelle || "N/A",
            "Type de messe": demande.messe?.extras?.type_messe || "N/A",
            "Date de la messe": demande.messe?.date_de_debut
              ? formatTimestamp(demande.messe.date_de_debut)
              : "N/A",
            "Heure de début": demande.messe?.extras?.heure_de_debut
              ? formatTime(demande.messe.extras.heure_de_debut)
              : "N/A",
            "Heure de fin": demande.messe?.extras?.heure_de_fin
              ? formatTime(demande.messe.extras.heure_de_fin)
              : "N/A",
            Prix: demande.messe?.extras?.prix_demande_de_messe
              ? `${demande.messe.extras.prix_demande_de_messe} FCFA`
              : "N/A",
          },
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        XLSX.utils.sheet_add_aoa(
          ws,
          [
            [`Détail de la Demande de Messe #${demande.id}`],
            [`${paroisseName}`],
            [`Date d'exportation: ${exportDate}`],
            [],
          ],
          { origin: "A1" }
        );

        XLSX.utils.book_append_sheet(wb, ws, `Demande_${demande.id}`);

        const fileName = `Demande_Messe_${demande.id}_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast.success("Export Excel réussi", {
          description: `Demande #${demande.id} exportée avec succès.`,
        });
      } else if (format === "pdf") {
        const doc = new jsPDF();

        // En-tête
        doc.setFillColor(59, 130, 246);
        doc.rect(0, 0, 210, 35, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`DÉTAIL DE LA DEMANDE #${demande.id}`, 105, 15, {
          align: "center",
        });

        doc.setFontSize(12);
        doc.text(paroisseName, 105, 25, { align: "center" });

        // Contenu
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        const yStart = 50;
        let yPos = yStart;

        const addField = (label: string, value: string) => {
          doc.setFont("helvetica", "bold");
          doc.text(`${label}:`, 20, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(value, 70, yPos);
          yPos += 8;
        };

        addField("Date de demande", formatDate(demande.created_at));
        addField(
          "Initiateur",
          demande.initiateur
            ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
            : "N/A"
        );
        addField("Téléphone", demande.initiateur?.num_de_telephone || "N/A");
        addField("Demandeur", demande.demandeur);
        addField("Intention", getIntentionLabel(demande.intention));
        addField("Concerne", demande.concerne);
        addField("Description", demande.description || "N/A");
        addField("Statut paiement", demande.est_payee ? "Payée" : "Non payée");

        yPos += 5;
        doc.setFont("helvetica", "bold");
        doc.text("INFORMATIONS MESSE", 20, yPos);
        yPos += 10;

        addField("Messe", demande.messe?.libelle || "N/A");
        addField("Type", demande.messe?.extras?.type_messe || "N/A");
        addField(
          "Date",
          demande.messe?.date_de_debut
            ? formatTimestamp(demande.messe.date_de_debut)
            : "N/A"
        );
        addField(
          "Heure début",
          demande.messe?.extras?.heure_de_debut
            ? formatTime(demande.messe.extras.heure_de_debut)
            : "N/A"
        );
        addField(
          "Heure fin",
          demande.messe?.extras?.heure_de_fin
            ? formatTime(demande.messe.extras.heure_de_fin)
            : "N/A"
        );
        addField(
          "Prix",
          demande.messe?.extras?.prix_demande_de_messe
            ? `${demande.messe.extras.prix_demande_de_messe} FCFA`
            : "N/A"
        );

        // Pied de page
        doc.setFontSize(8);
        doc.text(`Exporté le ${exportDate}`, 20, 280);

        const fileName = `Demande_Messe_${demande.id}_${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);

        toast.success("Export PDF réussi", {
          description: `Demande #${demande.id} exportée avec succès.`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'export individuel:", error);
      toast.error("Erreur lors de l'exportation");
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();

      const exportData = filteredDemandes.map((demande, index) => ({
        "N°": index + 1,
        "Date de demande": formatDate(demande.created_at),
        Initiateur: demande.initiateur
          ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
          : "N/A",
        Téléphone: demande.initiateur?.num_de_telephone || "N/A",
        Demandeur: demande.demandeur,
        Intention: getIntentionLabel(demande.intention),
        Concerne: demande.concerne,
        Description: demande.description || "N/A",
        "Statut de paiement": demande.est_payee ? "Payée" : "Non payée",
        Messe: demande.messe?.libelle || "N/A",
        "Type de messe": demande.messe?.extras?.type_messe || "N/A",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [`Liste des Demandes de Messe`],
          [`${paroisseName}`],
          [`Date d'exportation: ${exportDate}`],
          [`Nombre total: ${filteredDemandes.length}`],
          [
            `Demandes payées: ${filteredDemandes.filter((d) => d.est_payee).length}`,
          ],
          [
            `Demandes non payées: ${filteredDemandes.filter((d) => !d.est_payee).length}`,
          ],
          [],
        ],
        { origin: "A1" }
      );

      const colWidths = [
        { wch: 2 }, // N°
        { wch: 15 }, // Date
        { wch: 20 }, // Initiateur
        { wch: 15 }, // Téléphone
        { wch: 20 }, // Demandeur
        { wch: 25 }, // Intention
        { wch: 20 }, // Concerne
        { wch: 30 }, // Description
        { wch: 12 }, // Statut
        { wch: 20 }, // Messe
        { wch: 15 }, // Type
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Demandes");

      const fileName = `Demandes_Messe_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Exportation Excel réussie", {
        description: `Le fichier ${fileName} a été téléchargé.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation Excel:", error);
      toast.error("Erreur lors de l'exportation Excel");
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();

      const doc = new jsPDF("l"); // Paysage pour plus de colonnes

      const primaryColor: [number, number, number] = [59, 130, 246];
      const secondaryColor: [number, number, number] = [148, 163, 184];
      const textColor: [number, number, number] = [15, 23, 42];

      // En-tête
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 297, 35, "F"); // Format paysage

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("DEMANDES DE MESSE", 148.5, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(paroisseName, 148.5, 25, { align: "center" });

      // Statistiques
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(`Total: ${filteredDemandes.length}`, 20, 52);
      doc.text(
        `Payées: ${filteredDemandes.filter((d) => d.est_payee).length}`,
        100,
        52
      );
      doc.text(
        `Non payées: ${filteredDemandes.filter((d) => !d.est_payee).length}`,
        150,
        52
      );

      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 277, 58);

      // Données du tableau
      const tableData = filteredDemandes.map((demande, index) => [
        (index + 1).toString(),
        formatDate(demande.created_at),
        demande.initiateur
          ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`.length >
            20
            ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
            : `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
          : "N/A",
        demande.demandeur.length > 15 ? demande.demandeur : demande.demandeur,
        getIntentionLabel(demande.intention).length > 20
          ? getIntentionLabel(demande.intention)
          : getIntentionLabel(demande.intention),
        demande?.concerne.length > 15 ? demande?.concerne : demande?.concerne,
        demande?.est_payee ? "Payée" : "Non payée",
        demande?.messe?.libelle && demande.messe.libelle.length > 20
          ? demande.messe.libelle
          : demande?.messe?.libelle || "N/A",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [
          [
            "N°",
            "Date",
            "Initiateur",
            "Demandeur",
            "Intention",
            "Concerne",
            "Statut",
            "Messe",
          ],
        ],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: textColor,
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 25 },
          2: { cellWidth: 35 },
          3: { cellWidth: 30 },
          4: { cellWidth: 45 },
          5: { cellWidth: 30 },
          6: { cellWidth: 25, halign: "center" },
          7: { cellWidth: 40 },
        },
        margin: { left: 20, right: 20 },
      });

      // Pied de page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(...secondaryColor);
        doc.line(20, pageHeight - 20, 277, pageHeight - 20);

        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);
        doc.text(`Page ${i} sur ${pageCount}`, 148.5, pageHeight - 12, {
          align: "center",
        });
        doc.text(`Généré le ${exportDate}`, 20, pageHeight - 12);
        doc.text("Système de Gestion Paroissiale", 277, pageHeight - 12, {
          align: "right",
        });
      }

      const fileName = `Demandes_Messe_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

      toast.success("Exportation PDF réussie", {
        description: `Le fichier ${fileName} a été téléchargé.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      toast.error("Erreur lors de l'exportation PDF");
    } finally {
      setExporting(false);
    }
  };

  // Navigation de pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Formater la date: 2023-05-15 -> 15/05/2023
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Non renseignée";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR").format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return dateString;
    }
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = () => {
    return (
      searchQuery.trim() !== "" ||
      filtrePayee !== null ||
      messeFilters.libelle !== "" ||
      messeFilters.dateDebut !== "" ||
      messeFilters.heureFin !== ""
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Demandes de Messe
          </h1>
          <p className="text-slate-500">
            Consultez et gérez les demandes de messe de votre paroisse
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <h3 className="text-2xl font-bold">{demandes.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Hand className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Payées</p>
                <h3 className="text-2xl font-bold">
                  {demandes.filter((d) => d.est_payee).length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Non payées</p>
                <h3 className="text-2xl font-bold">
                  {demandes.filter((d) => !d.est_payee).length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <div className="mb-6 space-y-4">
        {/* Ligne 1: Recherche */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher une demande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filtrePayee === true ? "default" : "outline"}
              onClick={() => setFiltrePayee(filtrePayee === true ? null : true)}
              className="cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Payées
            </Button>
            <Button
              variant={filtrePayee === false ? "default" : "outline"}
              onClick={() =>
                setFiltrePayee(filtrePayee === false ? null : false)
              }
              className="cursor-pointer"
            >
              <Clock className="h-4 w-4 mr-2" />
              Non payées
            </Button>
          </div>
        </div>

        {/* Ligne 2: Filtres de messe */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-slate-50 rounded-lg border">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Filter className="h-4 w-4" />
            Filtres messe:
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Select
              value={messeFilters.libelle}
              onValueChange={(value) => {
                const newValue = value === "ALL_LIBELLES" ? "" : value;
                setMesseFilters((prev) => ({ ...prev, libelle: newValue }));
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Libellé de messe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_LIBELLES">Tous les libellés</SelectItem>
                {getUniqueMesseLibelles().map((libelle) => (
                  <SelectItem key={libelle} value={libelle}>
                    {libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={messeFilters.dateDebut || "ALL_DATES"}
              onValueChange={(value) => {
                const newValue = value === "ALL_DATES" ? "" : value;
                setMesseFilters((prev) => ({ ...prev, dateDebut: newValue }));
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Date de début" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_DATES">Toutes les dates</SelectItem>
                {getUniqueDatesDebut().map((date) => (
                  <SelectItem key={date} value={date}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {date}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={messeFilters.heureFin || "ALL_HEURES"}
              onValueChange={(value) => {
                const newValue = value === "ALL_HEURES" ? "" : value;
                setMesseFilters((prev) => ({ ...prev, heureFin: newValue }));
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Heure de fin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_HEURES">Toutes les heures</SelectItem>
                {getUniqueHeuresFin().map((heure) => (
                  <SelectItem key={heure} value={heure}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {heure}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="cursor-pointer text-slate-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={exporting || filteredDemandes.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? "Exportation..." : "Exporter tout"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={exportToExcel}
                  className="cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                  Exporter en Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={exportToPDF}
                  className="cursor-pointer"
                >
                  <FileDown className="h-4 w-4 mr-2 text-red-600" />
                  Exporter en PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      {loading ? (
        <div className="space-y-4">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-10" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Impossible de charger les données
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            {error}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      ) : filteredDemandes.length === 0 ? (
        <div className="text-center py-12">
          <Hand className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucune demande de messe trouvée
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            {hasActiveFilters()
              ? "Aucune demande ne correspond à vos critères de recherche."
              : "Aucune demande n'est enregistrée pour cette paroisse."}
          </p>
          {hasActiveFilters() ? (
            <Button variant="outline" onClick={resetAllFilters}>
              Réinitialiser les filtres
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
          <Table className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-100 border-slate-200">
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Date de demande
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Initiateur
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Demandeur
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Intention
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Concerne
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Statut
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Messe
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageItems().map((demande) => (
                <TableRow
                  key={demande.id}
                  className="hover:bg-slate-50 border-slate-100"
                >
                  <TableCell className="text-slate-500 py-3 px-4">
                    <div className="flex items-center">
                      {formatDate(demande?.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="font-medium text-slate-900">
                      {demande?.initiateur?.prenoms} {demande?.initiateur?.nom}
                    </div>
                    <div className="text-xs text-slate-500">
                      {demande?.initiateur?.num_de_telephone}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-slate-900">
                    {demande?.demandeur}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="text-sm text-slate-700">
                      {getIntentionLabel(demande?.intention)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-slate-900">
                    {demande?.concerne}
                  </TableCell>
                  <TableCell>
                    {demande?.est_payee ? (
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-800 hover:bg-green-200 text-xs py-0.5 px-1.5"
                      >
                        <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                        Payée
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs py-0.5 px-1.5"
                      >
                        <Clock className="h-2.5 w-2.5 mr-0.5" />
                        Non Payée
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="font-medium text-slate-700">
                        {demande.messe?.libelle}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {demande.messe?.extras?.type_messe}
                      </div>
                      {/* {demande.messe?.date_de_debut && (
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTimestamp(demande.messe.date_de_debut)}
                        </div>
                      )} */}
                      {/* {demande.messe?.extras?.heure_de_debut &&
                        demande.messe?.extras?.heure_de_fin && (
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(
                              demande.messe.extras.heure_de_debut
                            )} - {formatTime(demande.messe.extras.heure_de_fin)}
                          </div>
                        )} */}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-2 px-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/dashboard/paroisse/demandemesse/${demande.id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer text-green-600 hover:bg-green-50"
                            disabled={exporting}
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              exportIndividualDemande(demande, "excel")
                            }
                            className="cursor-pointer"
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                            Excel
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              exportIndividualDemande(demande, "pdf")
                            }
                            className="cursor-pointer"
                          >
                            <FileDown className="h-4 w-4 mr-2 text-red-600" />
                            PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-500">
                Page {currentPage} sur {totalPages}
              </p>
              {hasActiveFilters() && (
                <div className="text-xs text-slate-400">
                  {filteredDemandes.length} résultat(s) sur {demandes.length}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
