/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  Crown,
  Church,
  Calendar,
  XCircle,
  Eye,
  Phone,
  Mail,
  Download,
  FileSpreadsheet,
  FileDown,
  Home,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  fetchVicariatDetails,
  VicariatDetails,
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

// Fonction pour formater l'organisation
const formatOrganisation = (organisation: any): string => {
  if (!organisation) return "N/A";

  if (typeof organisation === "string") return organisation;

  if (typeof organisation === "object") {
    const parts: string[] = [];

    // Gestion du vicaire épiscopal
    if (organisation.vicaire_episcopal) {
      const vicaire = organisation.vicaire_episcopal;
      if (vicaire.nom && vicaire.prenoms) {
        parts.push(`Vicaire: ${vicaire.prenoms} ${vicaire.nom}`);
      }
    }

    // Gestion des curés doyens
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

// Fonction pour formater la localisation
const formatLocalisation = (localisation: any): string => {
  if (!localisation) return "Non spécifiée";

  if (typeof localisation === "string") return localisation;

  if (typeof localisation === "object") {
    // Cas spécifique pour {type: "point", data: {lng, lat}}
    if (localisation.type === "point" && localisation.data) {
      const { lng, lat } = localisation.data;
      return `Coordonnées: ${lat}°, ${lng}°`;
    }

    // Autres cas d'objets
    return "[Localisation géographique]";
  }

  return String(localisation);
};

// Fonction pour nettoyer les données avant le rendu
const sanitizeForRender = (value: any): string | number => {
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
    // Cas spécifique pour la localisation {type, data}
    if (value.type && value.data) {
      return formatLocalisation(value);
    }

    // Cas pour les objets photo
    if (value.url) {
      return value.url;
    }

    // Cas pour les objets avec nom
    if (value.nom) {
      return value.nom;
    }

    // Cas pour l'organisation complexe
    if (value.vicaire_episcopal || value.cure_doyens) {
      return formatOrganisation(value);
    }

    // Cas général
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

// Fonction pour formater les timestamps
const formatDate = (timestamp: string | number | null | undefined): string => {
  if (!timestamp) return "Non renseignée";

  try {
    // Convertir le timestamp en date
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

// Composant pour les cartes de statistiques modernes
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const SafeStatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  const safeValue = sanitizeForRender(value);

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
          <div className="text-xl font-bold text-slate-900">{safeValue}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant pour afficher les valeurs de manière sécurisée
const SafeValue = ({
  children,
  className = "",
}: {
  children: any;
  className?: string;
}) => {
  const safeContent = sanitizeForRender(children);
  return <span className={className}>{safeContent}</span>;
};

// Composant pour afficher les informations du vicaire épiscopal
const VicariatOrganisationCard = ({ organisation }: { organisation: any }) => {
  if (!organisation || typeof organisation !== "object") {
    return (
      <div className="text-slate-500 text-sm">
        <SafeValue>{organisation}</SafeValue>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vicaire Épiscopal */}
      {organisation.vicaire_episcopal && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <Crown className="h-4 w-4 mr-2" />
            Vicaire Épiscopal
          </h4>
          <div className="text-sm text-blue-800">
            <div className="font-medium">
              {organisation.vicaire_episcopal.prenoms}{" "}
              {organisation.vicaire_episcopal.nom}
            </div>
            {organisation.vicaire_episcopal.num_de_telephone && (
              <div className="flex items-center mt-1">
                <Phone className="h-3 w-3 mr-1" />
                {organisation.vicaire_episcopal.num_de_telephone}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Curés Doyens */}
      {organisation.cure_doyens &&
        Array.isArray(organisation.cure_doyens) &&
        organisation.cure_doyens.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Curés Doyens ({organisation.cure_doyens.length})
            </h4>
            <div className="space-y-2">
              {organisation.cure_doyens.map((cure: any, index: number) => (
                <div
                  key={cure.id || index}
                  className="text-sm text-green-800 bg-white p-2 rounded"
                >
                  <div className="font-medium">
                    {cure.prenoms} {cure.nom}
                  </div>
                  {cure.num_de_telephone && (
                    <div className="flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {cure.num_de_telephone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default function VicariatDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const vicariatId = params?.id as string;

  const [vicariatDetails, setVicariatDetails] =
    useState<VicariatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Charger les détails du vicariat au montage du composant
  useEffect(() => {
    const loadVicariatDetails = async () => {
      if (!vicariatId) {
        setError("ID du vicariat non spécifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchVicariatDetails(parseInt(vicariatId));

        console.log("📊 Données reçues:", data);

        setVicariatDetails(data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
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
          setError("Vicariat/secteur non trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVicariatDetails();
  }, [vicariatId, router]);

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
    if (!vicariatDetails) return;

    try {
      setExporting(true);

      const exportDate = formatExportDate();

      // Données des doyennés
      const doyennesData = vicariatDetails.doyennes.map((doyenne, index) => ({
        "N°": index + 1,
        "Nom du Doyenné": sanitizeForRender(doyenne.nom),
        "Date de création": formatDate(doyenne.created_at),
        "ID Siège": sanitizeForRender(doyenne.siege_id),
        "ID Doyen": sanitizeForRender(doyenne.doyen_id) || "N/A",
      }));

      // Données des paroisses
      const paroissesData = vicariatDetails.paroisses.map(
        (paroisse, index) => ({
          "N°": index + 1,
          "Nom de la Paroisse": sanitizeForRender(paroisse.nom),
          Ville: sanitizeForRender(paroisse.ville),
          Quartier: sanitizeForRender(paroisse.quartier),
          Statut: sanitizeForRender(paroisse.statut),
          Localisation: formatLocalisation(paroisse.localisation),
          "Date de création": formatDate(paroisse.created_at),
        })
      );

      const wb = XLSX.utils.book_new();

      // Feuille Informations générales
      const infoData = [
        ["INFORMATIONS DU VICARIAT/SECTEUR"],
        [""],
        ["Nom", sanitizeForRender(vicariatDetails.vicariat.nom)],
        ["Date de création", formatDate(vicariatDetails.vicariat.created_at)],
        ["Organisation", formatOrganisation(vicariatDetails.organisation)],
        [""],
        ["STATISTIQUES"],
        ["Nombre de doyennés", vicariatDetails.doyennes.length],
        ["Nombre de paroisses", vicariatDetails.paroisses.length],
        [""],
        [`Date d'exportation: ${exportDate}`],
      ];

      const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
      XLSX.utils.book_append_sheet(wb, wsInfo, "Informations");

      // Feuille Doyennés
      if (doyennesData.length > 0) {
        const wsDoyennes = XLSX.utils.json_to_sheet(doyennesData);
        XLSX.utils.book_append_sheet(wb, wsDoyennes, "Doyennés");
      }

      // Feuille Paroisses
      if (paroissesData.length > 0) {
        const wsParoisses = XLSX.utils.json_to_sheet(paroissesData);
        XLSX.utils.book_append_sheet(wb, wsParoisses, "Paroisses");
      }

      const fileName = `Vicariat_${String(vicariatDetails.vicariat.nom).replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
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
    if (!vicariatDetails) return;

    try {
      setExporting(true);

      const exportDate = formatExportDate();
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
      doc.text("DÉTAILS DU VICARIAT/SECTEUR", 105, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        String(sanitizeForRender(vicariatDetails.vicariat.nom)),
        105,
        25,
        { align: "center" }
      );

      // Informations générales
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(
        `Organisation: ${formatOrganisation(vicariatDetails.organisation)}`,
        20,
        52
      );

      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 190, 58);

      let yPos = 70;

      // Tableau des doyennés
      if (vicariatDetails.doyennes.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("DOYENNÉS", 20, yPos);
        yPos += 10;

        const doyennesTableData = vicariatDetails.doyennes.map(
          (doyenne, index) => [
            (index + 1).toString(),
            String(sanitizeForRender(doyenne.nom)),
            formatDate(doyenne.created_at),
          ]
        );

        autoTable(doc, {
          startY: yPos,
          head: [["N°", "Nom", "Date de création"]],
          body: doyennesTableData,
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
          margin: { left: 20, right: 20 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Nouvelle page si nécessaire pour les paroisses
      if (yPos > 200) {
        doc.addPage();
        yPos = 30;
      }

      // Tableau des paroisses
      if (vicariatDetails.paroisses.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("PAROISSES", 20, yPos);
        yPos += 10;

        const paroissesTableData = vicariatDetails.paroisses.map(
          (paroisse, index) => [
            (index + 1).toString(),
            String(sanitizeForRender(paroisse.nom)),
            String(sanitizeForRender(paroisse.ville)),
            String(sanitizeForRender(paroisse.quartier)),
            String(sanitizeForRender(paroisse.statut)),
          ]
        );

        autoTable(doc, {
          startY: yPos,
          head: [["N°", "Nom", "Ville", "Quartier", "Statut"]],
          body: paroissesTableData,
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
          columnStyles: {
            0: { cellWidth: 15, halign: "center" },
            1: { cellWidth: 45 },
            2: { cellWidth: 30 },
            3: { cellWidth: 35 },
            4: { cellWidth: 25 },
          },
          margin: { left: 20, right: 20 },
        });
      }

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

      const fileName = `Vicariat_${String(vicariatDetails.vicariat.nom).replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Impossible de charger les données
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!vicariatDetails) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              <SafeValue>{vicariatDetails.vicariat.nom}</SafeValue>
            </h1>
            <p className="text-slate-500">
              Détails du vicariat/secteur et de son organisation
            </p>
          </div>
        </div>

        {/* Bouton d'exportation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
              disabled={exporting}
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SafeStatsCard
          title="Doyennés"
          value={vicariatDetails.doyennes.length}
          icon={<Building2 size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <SafeStatsCard
          title="Paroisses"
          value={vicariatDetails.paroisses.length}
          icon={<Church size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        {/* Card Organisation */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Organisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VicariatOrganisationCard
              organisation={vicariatDetails.organisation}
            />
          </CardContent>
        </Card>
      </div>

      {/* Liste des Doyennés */}
      {vicariatDetails.doyennes.length > 0 && (
        <Card className="bg-white border-slate-200 shadow-sm mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Doyennés ({vicariatDetails.doyennes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-700 py-3 px-4">
                      Nom du Doyenné
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3 px-4">
                      Date de création
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vicariatDetails.doyennes.map((doyenne) => (
                    <TableRow
                      key={doyenne.id}
                      className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900">
                            <SafeValue>{doyenne.nom}</SafeValue>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-slate-600">
                        {formatDate(doyenne.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des Paroisses */}
      {vicariatDetails.paroisses.length > 0 && (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
              <Church className="h-5 w-5 mr-2 text-green-600" />
              Paroisses ({vicariatDetails.paroisses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-700 py-3 px-4">
                      Nom de la Paroisse
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3 px-4">
                      Localisation
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3 px-4">
                      Statut
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3 px-4">
                      Date de création
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vicariatDetails.paroisses.map((paroisse) => (
                    <TableRow
                      key={paroisse.id}
                      className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <Church className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-900">
                              <SafeValue>
                                {paroisse.nom || "Aucune paroisse définie"}
                              </SafeValue>
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="text-slate-600">
                          <div className="font-medium">
                            <SafeValue>{paroisse.ville}</SafeValue>
                          </div>
                          <div className="text-sm text-slate-500">
                            <SafeValue>{paroisse.quartier}</SafeValue>
                          </div>
                          {paroisse.localisation && (
                            <div className="text-xs text-slate-400 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <SafeValue>
                                {formatLocalisation(paroisse.localisation)}
                              </SafeValue>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge
                          className={
                            paroisse.statut === "Paroisse"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          <SafeValue>{paroisse.statut}</SafeValue>
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-slate-600">
                        {formatDate(paroisse.created_at)}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() =>
                            router.push(
                              `/dashboard/diocese/paroisses/${paroisse.id}`
                            )
                          }
                          title="Voir les détails de la paroisse"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucune donnée */}
      {vicariatDetails.doyennes.length === 0 &&
        vicariatDetails.paroisses.length === 0 && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Aucune structure trouvée
              </h3>
              <p className="text-sm text-slate-500">
                Ce vicariat/secteur ne contient encore aucun doyenné ou
                paroisse.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
