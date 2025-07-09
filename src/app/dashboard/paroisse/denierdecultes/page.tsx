/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Users,
  Search,
  Filter,
  User,
  ChevronRight,
  ChevronLeft,
  Eye,
  Check,
  X,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Download,
  FileSpreadsheet,
  FileDown,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  fetchDeniersCulte,
  validerDenierCulte,
  rejeterDenierCulte,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/denier_de_culte";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
interface DenierCulte {
  id: number;
  created_at: string;
  annee: number;
  montant: number;
  statut: "PAYE" | "EN ATTENTE" | "REJETE";
  date_de_paiement: number;
  date_de_validation: number;
  motif_de_rejet: string | null;
  paroissien_id: number;
  paroisse_id: number;
  chapelle_id: number;
  certificateur_id: number | null;
  paroissien: {
    id: number;
    nom: string;
    prenoms: string;
    genre: "M" | "F";
    num_de_telephone: string;
    statut: string;
    photo?: {
      url: string;
    };
  };
  certificateur?: {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
  };
}

// Types pour les filtres - Mis à jour avec les 3 statuts
const STATUTS_FILTER = ["TOUS", "PAYE", "EN ATTENTE", "REJETE"];

// Composant pour les cartes de statistiques modernes
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend,
}: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header avec icône */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-12 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        </div>

        {/* Valeur et tendance */}
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DeniersCultePage() {
  const router = useRouter();
  const [deniers, setDeniers] = useState<DenierCulte[]>([]);
  const [filteredDeniers, setFilteredDeniers] = useState<DenierCulte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statutFilter, setStatutFilter] = useState("TOUS");
  const [anneeFilter, setAnneeFilter] = useState<string>("TOUTES");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les dialogues
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedDenier, setSelectedDenier] = useState<DenierCulte | null>(
    null
  );
  const [motifRejet, setMotifRejet] = useState("");
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  // Charger les deniers au montage du composant
  useEffect(() => {
    const loadDeniers = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchDeniersCulte(paroisseId);
        setDeniers(data);
        setFilteredDeniers(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des deniers:", err);
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
          setError("Aucun denier de culte trouvé pour cette paroisse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDeniers();
  }, [router, itemsPerPage]);

  // Obtenir les années disponibles
  const getAvailableYears = () => {
    const years = [...new Set(deniers.map((d) => d.annee))].sort(
      (a, b) => b - a
    );
    return years;
  };

  // Filtrer les deniers selon la recherche, le statut et l'année
  useEffect(() => {
    let results = deniers;

    // Filtrer par statut
    if (statutFilter !== "TOUS") {
      results = results.filter((denier) => denier.statut === statutFilter);
    }

    // Filtrer par année
    if (anneeFilter !== "TOUTES") {
      results = results.filter(
        (denier) => denier.annee.toString() === anneeFilter
      );
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (denier) =>
          denier.paroissien.nom.toLowerCase().includes(query) ||
          denier.paroissien.prenoms.toLowerCase().includes(query) ||
          denier.paroissien.num_de_telephone.includes(query)
      );
    }

    setFilteredDeniers(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, statutFilter, anneeFilter, deniers, itemsPerPage]);

  // Calculer les deniers à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDeniers.slice(startIndex, endIndex);
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

  // Formater la monnaie en FCFA
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Non renseignée";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return dateString;
    }
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

  // Fonction pour valider un denier (change le statut de EN_ATTENTE vers PAYE)
  const handleValidation = async () => {
    if (!selectedDenier) return;

    setProcessing(true);
    try {
      await validerDenierCulte(selectedDenier.id);

      // Mettre à jour l'état local
      setDeniers((prev) =>
        prev.map((d) =>
          d.id === selectedDenier.id
            ? {
                ...d,
                statut: "PAYE" as const,
                date_de_validation: Date.now(),
              }
            : d
        )
      );

      toast.success("Denier de culte validé", {
        description: `Le paiement de ${selectedDenier.paroissien.nom} ${selectedDenier.paroissien.prenoms} a été validé.`,
      });

      setShowValidationDialog(false);
      setSelectedDenier(null);
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast.error("Erreur lors de la validation", {
        description: "Une erreur est survenue lors de la validation du denier.",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Fonction pour rejeter un denier (change le statut de EN_ATTENTE vers REJETE)
  const handleRejection = async () => {
    if (!selectedDenier || !motifRejet.trim()) {
      toast.error("Motif requis", {
        description: "Veuillez saisir un motif de rejet.",
      });
      return;
    }

    setProcessing(true);
    try {
      await rejeterDenierCulte(selectedDenier.id, motifRejet.trim());

      // Mettre à jour l'état local
      setDeniers((prev) =>
        prev.map((d) =>
          d.id === selectedDenier.id
            ? {
                ...d,
                statut: "REJETE" as const,
                motif_de_rejet: motifRejet.trim(),
              }
            : d
        )
      );

      toast.success("Denier de culte rejeté", {
        description: `Le paiement de ${selectedDenier.paroissien.nom} ${selectedDenier.paroissien.prenoms} a été rejeté.`,
      });

      setShowRejectionDialog(false);
      setSelectedDenier(null);
      setMotifRejet("");
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      toast.error("Erreur lors du rejet", {
        description: "Une erreur est survenue lors du rejet du denier.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();

      const exportData = filteredDeniers.map((denier, index) => ({
        "N°": index + 1,
        "Date de création": formatDate(denier.created_at),
        Paroissien: `${denier.paroissien.nom} ${denier.paroissien.prenoms}`,
        Téléphone: denier.paroissien.num_de_telephone,
        Année: denier.annee,
        "Montant (FCFA)": denier.montant,
        Statut: denier.statut,
        "Date de paiement": denier.date_de_paiement
          ? formatDate(new Date(denier.date_de_paiement).toISOString())
          : "N/A",
        "Date de validation": denier.date_de_validation
          ? formatDate(new Date(denier.date_de_validation).toISOString())
          : "N/A",
        "Motif de rejet": denier.motif_de_rejet || "N/A",
        Certificateur: denier.certificateur
          ? `${denier.certificateur.nom} ${denier.certificateur.prenoms}`
          : "N/A",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [`Deniers de Culte`],
          [`${paroisseName}`],
          [`Date d'exportation: ${exportDate}`],
          [`Nombre total: ${filteredDeniers.length}`],
          [],
        ],
        { origin: "A1" }
      );

      const colWidths = [
        { wch: 5 }, // N°
        { wch: 12 }, // Date
        { wch: 25 }, // Paroissien
        { wch: 15 }, // Téléphone
        { wch: 8 }, // Année
        { wch: 15 }, // Montant
        { wch: 12 }, // Statut
        { wch: 15 }, // Date paiement
        { wch: 15 }, // Date validation
        { wch: 20 }, // Motif rejet
        { wch: 20 }, // Certificateur
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Deniers de Culte");

      const fileName = `Deniers_Culte_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
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

      const doc = new jsPDF();

      const primaryColor: [number, number, number] = [59, 130, 246];
      const secondaryColor: [number, number, number] = [148, 163, 184];
      const textColor: [number, number, number] = [15, 23, 42];

      // En-tête
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("DENIERS DE CULTE", 105, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(paroisseName, 105, 25, { align: "center" });

      // Informations
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(`Nombre total: ${filteredDeniers.length}`, 20, 52);

      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 190, 58);

      // Données du tableau
      const tableData = filteredDeniers.map((denier, index) => [
        (index + 1).toString(),
        `${denier.paroissien.nom} ${denier.paroissien.prenoms}`,
        denier.annee.toString(),
        formatCurrency(denier.montant),
        denier.statut,
        formatDate(denier.created_at),
      ]);

      autoTable(doc, {
        startY: 65,
        head: [["N°", "Paroissien", "Année", "Montant", "Statut", "Date"]],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: textColor,
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 45 },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 25, halign: "right" },
          4: { cellWidth: 25, halign: "center" },
          5: { cellWidth: 25 },
        },
        margin: { left: 20, right: 20 },
      });

      // Pied de page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(...secondaryColor);
        doc.line(20, pageHeight - 20, 190, pageHeight - 20);

        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);
        doc.text(`Page ${i} sur ${pageCount}`, 105, pageHeight - 12, {
          align: "center",
        });
        doc.text(`Généré le ${exportDate}`, 20, pageHeight - 12);
        doc.text("Système de Gestion Paroissiale", 190, pageHeight - 12, {
          align: "right",
        });
      }

      const fileName = `Deniers_Culte_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
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

  // Fonction pour obtenir le badge de statut avec couleurs - Mis à jour
  const getStatutBadge = (statut: string) => {
    const statutMap: Record<string, { className: string; label: string }> = {
      PAYE: {
        className:
          "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        label: "Payé",
      },
      "EN ATTENTE": {
        className:
          "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        label: "En attente",
      },
      REJETE: {
        className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
        label: "Rejeté",
      },
    };

    const statutInfo = statutMap[statut] || {
      className: "bg-slate-50 text-slate-500 border-slate-200",
      label: statut,
    };

    return (
      <Badge
        className={`px-3 py-1 font-medium text-sm rounded-full ${statutInfo.className}`}
      >
        {statutInfo.label}
      </Badge>
    );
  };

  // Calculer les statistiques - Mis à jour
  const totalMontant = deniers.reduce((sum, d) => sum + d.montant, 0);
  const payes = deniers.filter((d) => d.statut === "PAYE").length;
  const enAttente = deniers.filter((d) => d.statut === "EN ATTENTE").length;
  const rejetes = deniers.filter((d) => d.statut === "REJETE").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Deniers de Culte
          </h1>
          <p className="text-slate-500">
            Gérez les paiements et validations des deniers de culte
          </p>
        </div>
      </div>

      {/* Statistiques avec nouveau design moderne - Mis à jour */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Deniers"
          value={deniers.length}
          icon={<CreditCard size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Montant Total"
          value={formatCurrency(totalMontant)}
          icon={<DollarSign size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Payés"
          value={payes}
          icon={<CheckCircle size={24} />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatsCard
          title="En Attente"
          value={enAttente}
          icon={<Clock size={24} />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Section filtres et actions - Design moderne */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Section recherche */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              placeholder="Rechercher un paroissien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-9 bg-white border-slate-200 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Section filtres et actions */}
          <div className="flex gap-16">
            {/* Filtre par statut */}
            <div className="w-48">
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Filtrer par statut" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg rounded-xl max-h-72 overflow-y-auto">
                  {STATUTS_FILTER.map((statut) => (
                    <SelectItem
                      key={statut}
                      value={statut}
                      className="cursor-pointer"
                    >
                      {statut === "TOUS" ? "Tous les statuts" : statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre par année */}
            <div className="w-36">
              <Select value={anneeFilter} onValueChange={setAnneeFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Année" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg rounded-xl">
                  <SelectItem value="TOUTES" className="cursor-pointer">
                    Toutes les années
                  </SelectItem>
                  {getAvailableYears().map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="cursor-pointer"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bouton d'exportation moderne */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-6 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                  disabled={exporting || filteredDeniers.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? "Exportation..." : "Exporter"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border-slate-200 shadow-lg rounded-xl"
              >
                <DropdownMenuItem
                  onClick={exportToExcel}
                  className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-3 text-green-600" />
                  <span className="font-medium">Exporter en Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={exportToPDF}
                  className="cursor-pointer hover:bg-slate-50 rounded-lg m-1 p-3 transition-colors"
                >
                  <FileDown className="h-4 w-4 mr-3 text-red-600" />
                  <span className="font-medium">Exporter en PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

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
      ) : filteredDeniers.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun denier de culte trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            {searchQuery || statutFilter !== "TOUS" || anneeFilter !== "TOUTES"
              ? "Aucun denier de culte ne correspond à vos critères de recherche."
              : "Aucun denier de culte n'est enregistré pour cette paroisse."}
          </p>
          {searchQuery ||
          statutFilter !== "TOUS" ||
          anneeFilter !== "TOUTES" ? (
            <Button
              onClick={() => {
                setSearchQuery("");
                setStatutFilter("TOUS");
                setAnneeFilter("TOUTES");
              }}
              className="cursor-pointer"
            >
              Réinitialiser les filtres
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header du tableau moderne */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Deniers de Culte
              </h3>
              <div className="text-sm text-slate-500">
                {filteredDeniers.length} résultat
                {filteredDeniers.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Date de création
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Paroissien
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Montant
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Année
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Statut
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().map((denier) => (
                <TableRow
                  key={denier.id}
                  className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <TableCell className="py-4 px-6">
                    <div className="text-slate-600 font-medium">
                      {formatDate(denier.created_at)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-base">
                          {denier.paroissien.nom} {denier.paroissien.prenoms}
                        </div>
                        {denier.paroissien.num_de_telephone && (
                          <div className="text-sm text-slate-500">
                            {denier.paroissien.num_de_telephone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="font-semibold text-slate-900 text-sm">
                      {formatCurrency(denier.montant)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="inline-flex items-center justify-center h-8 w-16 bg-slate-100 rounded-lg font-semibold text-slate-700">
                      {denier.annee}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    {getStatutBadge(denier.statut)}
                  </TableCell>

                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Actions disponibles uniquement pour les deniers "EN ATTENTE" */}
                      {denier.statut === "EN ATTENTE" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 cursor-pointer"
                            onClick={() => {
                              setSelectedDenier(denier);
                              setShowValidationDialog(true);
                            }}
                            title="Valider le paiement"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 cursor-pointer"
                            onClick={() => {
                              setSelectedDenier(denier);
                              setShowRejectionDialog(true);
                            }}
                            title="Rejeter le paiement"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer du tableau moderne */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filteredDeniers.length)} sur{" "}
              {filteredDeniers.length} résultats
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-9 px-4 bg-white border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-9 px-4 bg-white border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de validation */}
      <Dialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Valider le denier de culte
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider ce paiement ? Le statut passera
              de "En attente" à "Payé".
            </DialogDescription>
          </DialogHeader>

          {selectedDenier && (
            <div className="py-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Paroissien :</span>
                  <span className="font-medium">
                    {selectedDenier.paroissien.nom}{" "}
                    {selectedDenier.paroissien.prenoms}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Année :</span>
                  <span className="font-medium">{selectedDenier.annee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Montant :</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(selectedDenier.montant)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">
                    Statut actuel :
                  </span>
                  <span className="font-medium text-amber-600">En attente</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowValidationDialog(false);
                setSelectedDenier(null);
              }}
              disabled={processing}
            >
              Annuler
            </Button>
            <Button
              onClick={handleValidation}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {processing ? "Validation..." : "Valider"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de rejet */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <XCircle className="h-5 w-5 mr-2" />
              Rejeter le denier de culte
            </DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif du rejet de ce paiement. Le statut
              passera de "En attente" à "Rejeté".
            </DialogDescription>
          </DialogHeader>

          {selectedDenier && (
            <div className="py-4 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Paroissien :</span>
                  <span className="font-medium">
                    {selectedDenier.paroissien.nom}{" "}
                    {selectedDenier.paroissien.prenoms}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Année :</span>
                  <span className="font-medium">{selectedDenier.annee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Montant :</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(selectedDenier.montant)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">
                    Statut actuel :
                  </span>
                  <span className="font-medium text-amber-600">En attente</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motif du rejet *
                </label>
                <Textarea
                  placeholder="Expliquez pourquoi ce paiement est rejeté..."
                  value={motifRejet}
                  onChange={(e) => setMotifRejet(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionDialog(false);
                setSelectedDenier(null);
                setMotifRejet("");
              }}
              disabled={processing}
            >
              Annuler
            </Button>
            <Button
              onClick={handleRejection}
              disabled={processing || !motifRejet.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {processing ? "Rejet..." : "Rejeter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
