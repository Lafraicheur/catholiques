/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Users,
  Search,
  ChevronRight,
  ChevronLeft,
  Eye,
  XCircle,
  Building2,
  Crown,
  Download,
  FileSpreadsheet,
  FileDown,
  Church,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  fetchVicariats,
  VicariatSecteur,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/VicariatSecteur";
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
            className={`h-3 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
        </div>

        {/* Titre */}

        {/* Valeur et tendance */}
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-slate-900">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function VicariatsPage() {
  const router = useRouter();
  const [vicariats, setVicariats] = useState<VicariatSecteur[]>([]);
  const [filteredVicariats, setFilteredVicariats] = useState<VicariatSecteur[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour l'exportation
  const [exporting, setExporting] = useState(false);

  // Récupérer l'ID du diocèse à partir du localStorage
  const getUserDioceseId = (): number => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.diocese_id || 0;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
    }
    return 0;
  };

  // Charger les vicariats au montage du composant
  useEffect(() => {
    const loadVicariats = async () => {
      setLoading(true);
      setError(null);

      try {
        const dioceseId = getUserDioceseId();
        if (!dioceseId) {
          throw new Error("ID de diocèse non disponible");
        }

        const data = await fetchVicariats(dioceseId);
        setVicariats(data);
        setFilteredVicariats(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des vicariats:", err);
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
          setError("Aucun vicariat/secteur trouvé pour ce diocèse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVicariats();
  }, [router, itemsPerPage]);

  // Filtrer les vicariats selon la recherche
  useEffect(() => {
    let results = vicariats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (vicariat) =>
          vicariat?.nom?.toLowerCase().includes(query) ||
          vicariat?.siege?.nom?.toLowerCase().includes(query) ||
          vicariat?.vicaire_episcopal?.nom?.toLowerCase().includes(query) ||
          vicariat?.vicaire_episcopal?.prenoms?.toLowerCase().includes(query)
      );
    }

    setFilteredVicariats(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, vicariats, itemsPerPage]);

  // Calculer les vicariats à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVicariats.slice(startIndex, endIndex);
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

  const getDioceseName = (): string => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.diocese_nom || "Diocèse";
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du nom du diocèse:", err);
    }
    return "Diocèse";
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

  const exportToExcel = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();
      const dioceseName = getDioceseName();

      const exportData = filteredVicariats.map((vicariat, index) => ({
        "N°": index + 1,
        "Date de création": formatDate(vicariat.created_at),
        "Nom du Vicariat/Secteur": vicariat.nom,
        Siège: vicariat?.siege?.nom,
        Localisation: vicariat?.siege?.localisation || "N/A",
        Ville: vicariat?.siege?.ville,
        Quartier: vicariat?.siege?.quartier,
        "Vicaire Episcopal": `${vicariat?.vicaire_episcopal?.nom} ${vicariat?.vicaire_episcopal?.prenoms}`,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [`Vicariats et Secteurs`],
          [`${dioceseName}`],
          [`Date d'exportation: ${exportDate}`],
          [`Nombre total: ${filteredVicariats.length}`],
          [],
        ],
        { origin: "A1" }
      );

      const colWidths = [
        { wch: 5 }, // N°
        { wch: 15 }, // Date
        { wch: 30 }, // Nom
        { wch: 25 }, // Siège
        { wch: 20 }, // Localisation
        { wch: 15 }, // Ville
        { wch: 20 }, // Quartier
        { wch: 30 }, // Vicaire Episcopal
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Vicariats");

      const fileName = `Vicariats_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const dioceseName = getDioceseName();

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
      doc.text("VICARIATS ET SECTEURS", 105, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(dioceseName, 105, 25, { align: "center" });

      // Informations
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(`Nombre total: ${filteredVicariats.length}`, 20, 52);

      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 190, 58);

      // Données du tableau
      const tableData = filteredVicariats.map((vicariat, index) => [
        (index + 1).toString(),
        vicariat.nom || "",
        vicariat?.siege?.nom || "",
        vicariat?.siege?.ville || "",
        `${vicariat?.vicaire_episcopal?.nom || ""} ${vicariat?.vicaire_episcopal?.prenoms || ""}`.trim(),
        formatDate(vicariat.created_at) || "",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [["N°", "Nom", "Siège", "Ville", "Vicaire Episcopal", "Date"]],
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
          1: { cellWidth: 35 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 35 },
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
        doc.text("Système de Gestion Diocésaine", 190, pageHeight - 12, {
          align: "right",
        });
      }

      const fileName = `Vicariats_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Vicariats et Secteurs
          </h1>
          <p className="text-slate-500">
            Gérez les vicariats et secteurs de votre diocèse
          </p>
        </div>
      </div>

      {/* Statistiques avec nouveau design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Vicariats"
          value={vicariats.length}
          icon={<Building2 size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Avec Vicaire Episcopal"
          value={vicariats.filter((v) => v.vicaire_episcopal_id).length}
          icon={<Crown size={24} />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />

        <StatsCard
          title="Sièges Actifs"
          value={vicariats.filter((v) => v.siege_id).length}
          icon={<Church size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Section filtres et actions */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Section recherche */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              placeholder="Rechercher un vicariat ou secteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-9 bg-white border-slate-200 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Bouton d'exportation */}
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-6 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                  disabled={exporting || filteredVicariats.length === 0}
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
      ) : filteredVicariats.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun vicariat ou secteur trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            {searchQuery
              ? "Aucun vicariat ou secteur ne correspond à vos critères de recherche."
              : "Aucun vicariat ou secteur n'est enregistré pour ce diocèse."}
          </p>
          {searchQuery && (
            <Button
              onClick={() => setSearchQuery("")}
              className="cursor-pointer"
            >
              Réinitialiser la recherche
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header du tableau moderne */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Vicariats et Secteurs
              </h3>
              <div className="text-sm text-slate-500">
                {filteredVicariats.length} résultat
                {filteredVicariats.length > 1 ? "s" : ""}
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
                  Nom du Vicariat/Secteur
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Siège
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Vicaire Episcopal
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Localisation
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().map((vicariat) => (
                <TableRow
                  key={vicariat.id}
                  className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <TableCell className="py-4 px-6">
                    <div className="text-slate-600 font-medium">
                      {formatDate(vicariat?.created_at)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-base">
                          {vicariat?.nom}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Church className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {vicariat?.siege?.nom}
                        </div>
                        <div className="text-sm text-slate-500">
                          {vicariat?.siege?.ville}, {vicariat?.siege?.quartier}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <Crown className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {vicariat?.vicaire_episcopal?.nom}
                          {vicariat?.vicaire_episcopal?.prenoms}
                        </div>
                        {/* <div className="text-sm text-slate-500">
                          Vicaire Episcopal
                        </div> */}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-600 text-sm">
                        {vicariat?.siege?.localisation || "Non spécifiée"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/dashboard/diocese/vicariats/${vicariat.id}`
                          )
                        }
                        title="Voir les détails"
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
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filteredVicariats.length)}{" "}
              sur {filteredVicariats.length} résultats
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
    </div>
  );
}
