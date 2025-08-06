// NonParoissiensPage.jsx - Version mise à jour avec design moderne
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Filter,
  XCircle,
  Edit,
  Phone,
  User,
  Venus,
  Mars,
  UserPlus,
  Trash2,
  Download,
  FileSpreadsheet,
  FileDown,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ApiError,
} from "@/services/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AjouterNonParoissienForm from "@/components/forms/AjouterNonParoissienForm";
import ModifierNonParoissienForm from "@/components/forms/ModifierNonParoissienForm";
import SupprimerNonParoissienConfirmation from "@/components/forms/SupprimerNonParoissienConfirmation";
import ConvertirEnParoissienForm from "@/components/forms/ConvertirEnParoissienForm";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
interface NonParoissien {
  id: number;
  created_at: string;
  nom: string;
  prenom: string;
  genre: "M" | "F";
  num_de_telephone: string;
}

// Composant pour les cartes de statistiques modernes
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white transition-shadow duration-200">
      <CardContent className="p-y-1">
        {/* Header avec icône et menu */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-3 w-12 rounded-xl flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
        </div>

        {/* Titre */}

        {/* Valeur et tendance */}
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function NonParoissiensPage() {
  const router = useRouter();
  const [nonParoissiens, setNonParoissiens] = useState<NonParoissien[]>([]);
  const [filteredNonParoissiens, setFilteredNonParoissiens] = useState<
    NonParoissien[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("TOUS");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les dialogues
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [selectedNonParoissien, setSelectedNonParoissien] =
    useState<NonParoissien | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loadNonParoissiens = async () => {
      setLoading(true);
      setError(null);

      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new AuthenticationError("Token d'authentification non trouvé");
        }

        // Appel à l'API pour récupérer la liste des non-paroissiens
        const response = await fetch(
          "https://api.cathoconnect.ci/api:HzF8fFua/nonparoissien/obtenir-tous",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Gérer les différents codes d'erreur
          if (response.status === 401) {
            throw new AuthenticationError("Session expirée");
          } else if (response.status === 403) {
            throw new ForbiddenError("Accès refusé");
          } else if (response.status === 404) {
            throw new NotFoundError("Ressource non trouvée");
          } else if (response.status === 429) {
            throw new ApiError(
              "Trop de requêtes, veuillez réessayer plus tard",
              429
            );
          } else {
            throw new ApiError(
              "Erreur lors du chargement des données",
              response.status
            );
          }
        }

        const data = await response.json();
        setNonParoissiens(data);
        setFilteredNonParoissiens(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des non-paroissiens:", err);

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
          setError("Aucun non-paroissien trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadNonParoissiens();
  }, [router, itemsPerPage]);

  // Filtrer les non-paroissiens selon la recherche et le genre
  useEffect(() => {
    let results = nonParoissiens;

    // Filtrer par genre
    if (genreFilter !== "TOUS") {
      results = results.filter((np) => np.genre === genreFilter);
    }

    // Filtrer par recherche (nom, prénom ou téléphone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (np) =>
          np.nom.toLowerCase().includes(query) ||
          np.prenom.toLowerCase().includes(query) ||
          np.num_de_telephone?.includes(query)
      );
    }

    setFilteredNonParoissiens(results);
    setCurrentPage(1);

    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, genreFilter, nonParoissiens, itemsPerPage]);

  const formatExportDate = (): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  };

  // Exportation Excel
  const exportToExcel = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();

      const exportData = filteredNonParoissiens.map((np, index) => ({
        "N°": index + 1,
        "Date d'ajout": formatDate(np.created_at),
        Nom: np.nom,
        Prénom: np.prenom,
        Genre: np.genre === "M" ? "Homme" : "Femme",
        Téléphone: formatPhoneDisplay(np.num_de_telephone) || "Non renseigné",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // En-tête informatif
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [`Liste des Non-Paroissiens`],
          [`Date d'exportation: ${exportDate}`],
          [`Nombre total: ${filteredNonParoissiens.length}`],
          [
            `Hommes: ${filteredNonParoissiens.filter((np) => np.genre === "M").length}`,
          ],
          [
            `Femmes: ${filteredNonParoissiens.filter((np) => np.genre === "F").length}`,
          ],
          [],
        ],
        { origin: "A1" }
      );

      // Largeurs des colonnes
      const colWidths = [
        { wch: 5 }, // N°
        { wch: 15 }, // Date
        { wch: 20 }, // Nom
        { wch: 20 }, // Prénom
        { wch: 10 }, // Genre
        { wch: 15 }, // Téléphone
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Non-Paroissiens");

      const fileName = `Non_Paroissiens_${new Date().toISOString().split("T")[0]}.xlsx`;
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

  // Exportation PDF
  const exportToPDF = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();

      const doc = new jsPDF("l"); // Format paysage

      const primaryColor: [number, number, number] = [59, 130, 246];
      const secondaryColor: [number, number, number] = [148, 163, 184];
      const textColor: [number, number, number] = [15, 23, 42];

      // En-tête avec design spécialisé
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 297, 35, "F"); // Format paysage

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("LISTE DES NON-PAROISSIENS", 148.5, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Statistiques avec icônes
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(`Nombre total: ${filteredNonParoissiens.length}`, 20, 52);

      // Ligne de séparation
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 277, 58);

      // Données du tableau
      const tableData = filteredNonParoissiens.map((np, index) => [
        (index + 1).toString(),
        formatDate(np.created_at),
        `${np.prenom} ${np.nom}`.length > 25
          ? `${np.prenom} ${np.nom}`
          : `${np.prenom} ${np.nom}`,
        np.genre === "M" ? "Homme" : "Femme",
        formatPhoneDisplay(np.num_de_telephone) || "N/A",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [["N°", "Date d'ajout", "Nom Complet", "Genre", "Téléphone"]],
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
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 70 },
          3: { cellWidth: 30, halign: "center" },
          4: { cellWidth: 35, halign: "center" },
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
        doc.text("Gestion Non-Paroissiens", 277, pageHeight - 12, {
          align: "right",
        });
      }

      const fileName = `Non_Paroissiens_${new Date().toISOString().split("T")[0]}.pdf`;
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

  // Calculer les mouvements à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNonParoissiens.slice(startIndex, endIndex);
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

  // Formatage de la date
  const formatDate = (dateString: string): string => {
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
  };

  // Formater le numéro pour l'affichage (XX XX XX XX XX)
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return "";
    const groups = [];
    for (let i = 0; i < phone.length; i += 2) {
      groups.push(phone.slice(i, i + 2));
    }
    return groups.join(" ");
  };

  // Gérer le succès de l'ajout
  const handleCreateSuccess = (newNonParoissien: NonParoissien) => {
    // Ajouter le nouveau non-paroissien à la liste
    setNonParoissiens((prevList) => [newNonParoissien, ...prevList]);
  };

  // Gérer le succès de la modification
  const handleUpdateSuccess = (updatedNonParoissien: NonParoissien) => {
    // Mettre à jour la liste
    setNonParoissiens((prevList) =>
      prevList.map((item) =>
        item.id === updatedNonParoissien.id ? updatedNonParoissien : item
      )
    );
    // Réinitialiser l'état
    setSelectedNonParoissien(null);
  };

  // Gérer le succès de la suppression
  const handleDeleteSuccess = (deletedId: string | number) => {
    // Mettre à jour la liste
    setNonParoissiens((prevList) =>
      prevList.filter((item) => item.id !== deletedId)
    );
    // Réinitialiser l'état
    setSelectedNonParoissien(null);
  };

  // Gérer le succès de la conversion
  const handleConvertSuccess = (convertedId: number) => {
    // Mettre à jour la liste
    setNonParoissiens((prevList) =>
      prevList.filter((item) => item.id !== convertedId)
    );
    // Réinitialiser l'état
    setSelectedNonParoissien(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Non-Paroissiens
          </h1>
          <p className="text-slate-500">
            Gérez les personnes non inscrites à la paroisse
          </p>
        </div>
      </div>

      {/* Statistiques avec nouveau design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Non-Paroissiens"
          value={nonParoissiens.length}
          icon={<Users size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Hommes"
          value={nonParoissiens.filter((np) => np.genre === "M").length}
          icon={<Mars size={24} />}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <StatsCard
          title="Femmes"
          value={nonParoissiens.filter((np) => np.genre === "F").length}
          icon={<Venus size={24} />}
          iconBgColor="bg-pink-50"
          iconColor="text-pink-600"
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
              placeholder="Rechercher par nom, prénom ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-9 bg-white border-slate-200 rounded-xl shadow-sm transition-all duration-200"
            />
          </div>

          {/* Section filtres et actions */}
          <div className="flex gap-3">
            {/* Filtre par genre moderne */}
            <div className="w-40">
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="h-9 bg-white border-slate-200 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Genre" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg rounded-xl">
                  <SelectItem value="TOUS">Tous</SelectItem>
                  <SelectItem value="M">Hommes</SelectItem>
                  <SelectItem value="F">Femmes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bouton d'exportation moderne */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-6 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  disabled={exporting || filteredNonParoissiens.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? "Export..." : "Exporter"}
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

            {/* Bouton d'ajout moderne */}
            <Button
              onClick={() => setShowAddDialog(true)}
              className="h-9 px-6 bg-slate-800 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all duration-200 font-medium cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau
            </Button>
          </div>
        </div>
      </div>

      {/* Liste des non-paroissiens */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <XCircle className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Impossible de charger les données
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      ) : filteredNonParoissiens.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <Users className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun non-paroissien trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">
            {searchQuery || genreFilter !== "TOUS"
              ? "Aucun non-paroissien ne correspond à vos critères de recherche."
              : "Aucun non-paroissien n'est enregistré."}
          </p>
          {searchQuery || genreFilter !== "TOUS" ? (
            <Button
              onClick={() => {
                setSearchQuery("");
                setGenreFilter("TOUS");
              }}
            >
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un non-paroissien
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header du tableau moderne */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Non-Paroissiens
              </h3>
              <div className="text-sm text-slate-500">
                {filteredNonParoissiens.length} résultat
                {filteredNonParoissiens.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Date de Création
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Nom & Prénom
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Genre
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Téléphone
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().map((np) => (
                <TableRow
                  key={np.id}
                  className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full opacity-60" />
                      <span className="text-slate-600 font-medium">
                        {formatDate(np.created_at)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                          np.genre === "M" ? "bg-indigo-100" : "bg-pink-100"
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${
                            np.genre === "M"
                              ? "text-indigo-600"
                              : "text-pink-600"
                          }`}
                        >
                          {np.prenom.charAt(0)}
                          {np.nom.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-base">
                          {np.prenom} {np.nom}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          np.genre === "M" ? "bg-indigo-100" : "bg-pink-100"
                        }`}
                      >
                        {np.genre === "M" ? (
                          <Mars className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Venus className="h-4 w-4 text-pink-600" />
                        )}
                      </div>
                      <Badge
                        className={`px-3 py-1 font-medium text-sm rounded-full ${
                          np.genre === "M"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                            : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                        }`}
                      >
                        {np.genre === "M" ? "Homme" : "Femme"}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    {np.num_de_telephone ? (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-slate-900">
                          {formatPhoneDisplay(np.num_de_telephone)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                          <Phone className="h-4 w-4 text-slate-400" />
                        </div>
                        <span className="text-slate-400 text-sm italic">
                          Non renseigné
                        </span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        onClick={() => {
                          setSelectedNonParoissien(np);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 transition-colors duration-150"
                        onClick={() => {
                          setSelectedNonParoissien(np);
                          setShowConvertDialog(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                        onClick={() => {
                          setSelectedNonParoissien(np);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer du tableau moderne */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Affichage de {filteredNonParoissiens.length} résultats
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

      {/* Dialog d'ajout */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px] w-[92vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Ajouter un non-paroissien
            </DialogTitle>
          </DialogHeader>

          <AjouterNonParoissienForm
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setSelectedNonParoissien(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] w-[92vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <Edit className="h-5 w-5 mr-2 text-blue-600" />
              Modifier un non-paroissien
            </DialogTitle>
          </DialogHeader>

          {selectedNonParoissien && (
            <ModifierNonParoissienForm
              nonParoissien={selectedNonParoissien}
              onClose={() => setShowEditDialog(false)}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) {
            setSelectedNonParoissien(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {selectedNonParoissien && (
            <SupprimerNonParoissienConfirmation
              nonParoissien={selectedNonParoissien}
              onClose={() => setShowDeleteDialog(false)}
              onSuccess={handleDeleteSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de conversion en paroissien */}
      <Dialog
        open={showConvertDialog}
        onOpenChange={(open) => {
          setShowConvertDialog(open);
          if (!open) {
            setSelectedNonParoissien(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] w-[92vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-green-600" />
              Convertir en paroissien
            </DialogTitle>
          </DialogHeader>

          {selectedNonParoissien && (
            <ConvertirEnParoissienForm
              nonParoissien={selectedNonParoissien}
              onClose={() => setShowConvertDialog(false)}
              onSuccess={handleConvertSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
