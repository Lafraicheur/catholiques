/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Download,
  XCircle,
  Edit,
  Mail,
  Phone,
  User,
  UserCheck,
  UserX,
  ChevronRight,
  ChevronLeft,
  Users,
  Eye,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { fetchParoissiens } from "@/services/parishioner-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Importer le formulaire de modification des paroissiens
import ModifierParoissienForm from "@/components/forms/ModifierParoissienForm";
import { FileSpreadsheet, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
interface Paroissien {
  [x: string]: any;
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  prenoms: string;
  genre: string;
  num_de_telephone: string;
  email: string;
  date_de_naissance: string;
  pays: string;
  nationalite: string;
  ville: string;
  commune: string;
  quartier: string;
  solde: number;
  est_abonne: boolean;
  date_de_fin_abonnement: number;
  statut: string;
  paroisse_id: number;
  chapelle_id: number | null;
  ceb_id: number | null;
  mouvementassociation_id: number | null;
  user_id: number | null;
  abonnement_id: number | null;
  abonnement?: {
    intitule: string;
  };
  photo?: {
    url: string;
  };
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
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
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

export default function ParoissiensPage() {
  const router = useRouter();
  const [paroissiens, setParoissiens] = useState<Paroissien[]>([]);
  const [filteredParoissiens, setFilteredParoissiens] = useState<Paroissien[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [statutFilter, setStatutFilter] = useState("TOUS");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);

  // États pour les dialogues
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedParoissien, setSelectedParoissien] =
    useState<Paroissien | null>(null);

  const getUniqueStatuts = () => {
    const statuts = paroissiens.map((p) => p.statut || "Aucun");
    return ["TOUS", ...Array.from(new Set(statuts))];
  };

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

  // Filtrer les paroissiens selon la recherche et le statut
  useEffect(() => {
    let results = paroissiens;

    // Filtrer par statut
    if (statutFilter !== "TOUS") {
      results = results.filter((p) => p.statut === statutFilter);
    }

    // Filtrer par recherche textuelle
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.nom.toLowerCase().includes(query) ||
          p.prenoms.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          p.num_de_telephone?.includes(query)
      );
    }

    setFilteredParoissiens(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, statutFilter, paroissiens, itemsPerPage]);

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

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Exportation Excel
  const exportToExcel = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();

      const exportData = filteredParoissiens.map((paroissien, index) => ({
        "N°": index + 1,
        "Date d'inscription": formatDate(paroissien.created_at),
        Nom: paroissien.nom,
        Prénoms: paroissien.prenoms,
        Genre: paroissien.genre,
        "Date de naissance": formatDate(paroissien.date_de_naissance),
        Téléphone: formatPhoneNumber(paroissien.num_de_telephone),
        Email: paroissien.email || "N/A",
        Pays: paroissien.pays || "N/A",
        Nationalité: paroissien.nationalite || "N/A",
        Ville: paroissien.ville || "N/A",
        Commune: paroissien.commune || "N/A",
        Quartier: paroissien.quartier || "N/A",
        "Statut religieux": paroissien.statut || "Aucun",
        Abonné: paroissien.est_abonne ? "Oui" : "Non",
        "Type d'abonnement": paroissien.abonnement?.intitule || "N/A",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // En-tête informatif
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [`Liste des Paroissiens`],
          [`${paroisseName}`],
          [`Date d'exportation: ${exportDate}`],
          [`Nombre total: ${filteredParoissiens.length}`],
          [
            `Abonnés: ${filteredParoissiens.filter((p) => p.est_abonne).length}`,
          ],
          [
            `Non abonnés: ${filteredParoissiens.filter((p) => !p.est_abonne).length}`,
          ],
          [],
        ],
        { origin: "A1" }
      );

      // Largeurs des colonnes
      const colWidths = [
        { wch: 5 }, // N°
        { wch: 15 }, // Date inscription
        { wch: 20 }, // Nom
        { wch: 20 }, // Prénoms
        { wch: 8 }, // Genre
        { wch: 15 }, // Date naissance
        { wch: 15 }, // Téléphone
        { wch: 25 }, // Email
        { wch: 15 }, // Pays
        { wch: 15 }, // Nationalité
        { wch: 15 }, // Ville
        { wch: 15 }, // Commune
        { wch: 15 }, // Quartier
        { wch: 15 }, // Statut
        { wch: 8 }, // Abonné
        { wch: 20 }, // Type abonnement
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Paroissiens");

      const fileName = `Paroissiens_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const paroisseName = getParoisseName();

      const doc = new jsPDF("l"); // Format paysage

      const primaryColor: [number, number, number] = [59, 130, 246];
      const secondaryColor: [number, number, number] = [148, 163, 184];
      const textColor: [number, number, number] = [15, 23, 42];

      // En-tête stylé
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 297, 35, "F"); // Format paysage

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("LISTE DES PAROISSIENS", 148.5, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(paroisseName, 148.5, 25, { align: "center" });

      // Informations
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(`Nombre total: ${filteredParoissiens.length}`, 20, 52);

      // Ligne de séparation
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 277, 58);

      // Données du tableau (colonnes essentielles)
      const tableData = filteredParoissiens.map((paroissien, index) => [
        (index + 1).toString(),
        `${paroissien.nom} ${paroissien.prenoms}`.length > 25
          ? `${paroissien.nom} ${paroissien.prenoms}`
          : `${paroissien.nom} ${paroissien.prenoms}`,
        paroissien.genre,
        formatPhoneNumber(paroissien.num_de_telephone),
        paroissien.statut || "Aucun",
        paroissien.est_abonne ? "Oui" : "Non",
        `${paroissien.commune || ""} ${paroissien.quartier || ""}`.trim() ||
          "N/A",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [
          [
            "N°",
            "Nom Complet",
            "Genre",
            "Téléphone",
            "Statut",
            "Abonné",
            "Localisation",
          ],
        ],
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
          1: { cellWidth: 60 },
          2: { cellWidth: 60 },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 35, halign: "center" },
          5: { cellWidth: 35, halign: "center" },
          6: { cellWidth: 25 },
          7: { cellWidth: 45 },
        },
        margin: { left: 20, right: 20 },
      });

      // Pied de page professionnel
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

      const fileName = `Paroissiens_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
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

  // Charger les paroissiens au montage du composant
  useEffect(() => {
    const loadParoissiens = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchParoissiens(paroisseId);
        setParoissiens(data);
        setFilteredParoissiens(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des paroissiens:", err);
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
          setError("Aucun paroissien trouvé pour cette paroisse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadParoissiens();
  }, [router]);

  // Calculer les paroissiens à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredParoissiens.slice(startIndex, endIndex);
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

  // Fonctions utilitaires
  const getTotalParoissiens = () => paroissiens.length;
  const getParoissiensAbonnes = () =>
    paroissiens.filter((p) => p.est_abonne).length;
  const getParoissiensNonAbonnes = () =>
    paroissiens.filter((p) => !p.est_abonne).length;

  // Formater les dates: 2023-05-15 -> 15/05/2023
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

  // Formater les numéros de téléphone: 0101020304 -> 01 01 02 03 04
  const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return "Non renseigné";

    const cleaned = phone.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      groups.push(cleaned.slice(i, i + 2));
    }

    return groups.join(" ");
  };

  // Obtenir le badge de statut pour un paroissien
  const getStatusBadge = (statut: string) => {
    const statusMap: Record<
      string,
      {
        className: string;
        label: string;
      }
    > = {
      Baptisé: {
        className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-200",
        label: "Baptisé",
      },
      Confirmé: {
        className:
          "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-200",
        label: "Confirmé",
      },
      Marié: {
        className:
          "bg-green-50 text-green-700 border-green-200 hover:bg-green-200",
        label: "Marié",
      },
      Aucun: {
        className:
          "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-200",
        label: "Aucun",
      },
    };

    const status = statusMap[statut] || {
      className: "bg-slate-50 text-slate-500 border-slate-200",
      label: statut || "Aucun",
    };

    return (
      <Badge
        className={`px-3 py-1 font-medium text-sm rounded-full ${status.className}`}
      >
        {status.label}
      </Badge>
    );
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedParoissien: Paroissien) => {
    // Mettre à jour la liste des paroissiens
    setParoissiens((prevParoissiens) =>
      prevParoissiens.map((p) =>
        p.id === updatedParoissien.id ? updatedParoissien : p
      )
    );

    // Réinitialiser l'état
    setSelectedParoissien(null);
  };

  // Ouvrir le modal en mode édition
  const openEditModal = (paroissien: Paroissien) => {
    setSelectedParoissien(paroissien);
    setShowEditDialog(true);
  };

  // Naviguer vers la page de détails d'un paroissien
  const navigateToDetails = (paroissienId: number) => {
    router.push(`/dashboard/paroisse/communautes/paroissiens/${paroissienId}`);
  };

  // Rendu en cas de chargement
  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <Skeleton className="h-10 w-full sm:w-96" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-10" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rendu en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Gestion des Paroissiens
            </h1>
            <p className="text-slate-500">
              Consultez et gérez les membres de votre paroisse
            </p>
          </div>
        </div>

        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-red-600 max-w-md mx-auto mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Gestion des Paroissiens
          </h1>
          <p className="text-slate-500">
            Consultez et gérez les membres de votre paroisse
          </p>
        </div>
      </div>

      {/* Statistiques avec nouveau design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Paroissiens"
          value={getTotalParoissiens()}
          icon={<Users size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Abonnés"
          value={getParoissiensAbonnes()}
          icon={<UserCheck size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Non Abonnés"
          value={getParoissiensNonAbonnes()}
          icon={<UserX size={24} />}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
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
              placeholder="Rechercher par nom, prénom, email, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-9 bg-white border-slate-200 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Section filtres et actions */}
          <div className="flex gap-3">
            {/* Filtre par statut moderne */}
            <div className="w-48">
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="h-9 bg-white border-slate-200 rounded-xl">
                  <div className="flex items-center cursor-pointer">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Filtrer par statut" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  {getUniqueStatuts().map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut === "TOUS" ? "Tous les statuts" : statut}
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
                  className="h-9 px-6 bg-white border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  disabled={exporting || filteredParoissiens.length === 0}
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
          </div>
        </div>
      </div>

      {/* Liste des paroissiens */}
      {filteredParoissiens.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun paroissien trouvé
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {searchQuery
              ? "Aucun paroissien ne correspond à votre recherche."
              : "Aucun paroissien n'est enregistré pour cette paroisse."}
          </p>
          {searchQuery ? (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Réinitialiser la recherche
            </Button>
          ) : (
            <Button
              onClick={() =>
                router.push("/dashboard/paroisse/paroissiens/ajouter")
              }
            ></Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header du tableau moderne */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Paroissiens
              </h3>
              <div className="text-sm text-slate-500">
                {filteredParoissiens.length} résultat
                {filteredParoissiens.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Date d'inscription
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Nom & Prénom
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Contact
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Statut
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Abonnement
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().map((paroissien) => (
                <TableRow
                  key={paroissien.id}
                  className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full opacity-60" />
                      <span className="text-slate-600 font-medium">
                        {formatDate(paroissien.created_at)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      {/* Photo de profil ou avatar par défaut */}
                      <div className="h-10 w-10 rounded-full mr-3 overflow-hidden flex-shrink-0">
                        {paroissien.photo?.url ? (
                          <img
                            src={paroissien.photo.url}
                            alt={`Photo de ${paroissien.prenoms} ${paroissien.nom}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // En cas d'erreur de chargement, afficher l'avatar par défaut
                              (e.target as HTMLImageElement).style.display = "none";
                              if ((e.target as HTMLImageElement).nextSibling instanceof HTMLElement) {
                                ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = "flex";
                              }
                            }}
                          />
                        ) : null}

                        {/* Avatar par défaut avec initiales */}
                        <div
                          className={`h-full w-full rounded-full flex items-center justify-center ${
                            paroissien.photo?.url ? "hidden" : "flex"
                          } ${
                            paroissien.genre === "M"
                              ? "bg-blue-100"
                              : "bg-pink-100"
                          }`}
                        >
                          <span
                            className={`text-sm font-semibold ${
                              paroissien.genre === "M"
                                ? "text-blue-600"
                                : "text-pink-600"
                            }`}
                          >
                            {paroissien.prenoms.charAt(0)}
                            {paroissien.nom.charAt(0)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-slate-900 text-base">
                          {paroissien.nom} {paroissien.prenoms}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Né(e) le {formatDate(paroissien.date_de_naissance)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="space-y-1">
                      {paroissien.num_de_telephone ? (
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <Phone className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {formatPhoneNumber(paroissien.num_de_telephone)}
                          </span>
                        </div>
                      ) : null}

                      {paroissien.email ? (
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <Mail className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm text-slate-600 truncate max-w-[150px]">
                            {paroissien.email}
                          </span>
                        </div>
                      ) : null}

                      {!paroissien.num_de_telephone && !paroissien.email && (
                        <span className="text-slate-400 text-sm italic">
                          Aucun contact
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    {getStatusBadge(paroissien.statut)}
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    {paroissien.est_abonne ? (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1 font-medium text-sm rounded-full hover:bg-green-100">
                            {paroissien.abonnement?.intitule || "Abonné"}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                          <UserX className="h-4 w-4 text-slate-400" />
                        </div>
                        <Badge className="bg-slate-50 text-slate-500 border-slate-200 px-3 py-1 font-medium text-sm rounded-full hover:bg-slate-200">
                          Aucun
                        </Badge>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToDetails(paroissien.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer du tableau moderne */}
          {filteredParoissiens.length > 0 && (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Affichage de {filteredParoissiens.length} résultats
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
          )}
        </div>
      )}
    </div>
  );
}

// <div className="overflow-x-auto">
//   <table className="w-full border-collapse">
//     <thead>
//       <tr className="border-b border-slate-200">
//         <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
//           Date d'ajout
//         </th>
//         <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
//           Nom
//         </th>
//         <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
//           Téléphone
//         </th>
//         <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
//           Statut
//         </th>
//         <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
//           Abonnement
//         </th>
//         <th className="py-3 px-4 text-right text-sm font-medium text-slate-500">
//           Actions
//         </th>
//       </tr>
//     </thead>
//     <tbody>
//       {getCurrentPageItems().map((paroissien) => (
//         <tr
//           key={paroissien.id}
//           className="border-b border-slate-100 hover:bg-slate-100 cursor-pointer"
//           onClick={() => navigateToDetails(paroissien.id)}
//         >
//           <td className="py-3 px-4">
//             <div className="text-sm text-slate-700">
//               {formatDate(paroissien.created_at)}
//             </div>
//           </td>

//           <td className="py-3 px-4">
//             <div className="font-medium text-xs text-slate-900">
//               {paroissien.nom} {paroissien.prenoms}
//             </div>
//             <div className="text-xs text-slate-500">
//               Né(e) le {formatDate(paroissien.date_de_naissance)}
//             </div>
//           </td>

//           <td className="py-3 px-4 text-xs text-slate-700">
//             {formatPhoneNumber(paroissien.num_de_telephone)}
//           </td>

//           <td className="py-3 px-4">
//             {getStatusBadge(paroissien.statut)}
//           </td>

//           <td className="py-3 px-4">
//             {paroissien.est_abonne ? (
//               <Badge variant="success" className="bg-green-800">
//                 {paroissien.abonnement?.intitule || "Abonné"}
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="text-slate-500">
//                 Aucun
//               </Badge>
//             )}
//           </td>

//           <td className="py-3 px-4 text-right">
//             <Button
//               variant="outline"
//               size="icon"
//               className="h-8 w-8 cursor-pointer"
//               onClick={() => navigateToDetails(paroissien.id)}
//             >
//               <Eye className="h-4 w-4 text-slate-500" />
//             </Button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>
