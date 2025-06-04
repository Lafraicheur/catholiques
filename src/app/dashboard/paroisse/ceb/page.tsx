/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  Church,
  Users,
  Search,
  Plus,
  FileText,
  Filter,
  Wallet,
  User,
  MoreHorizontal,
  XCircle,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { fetchCebs } from "@/services/ceb-services";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importer les composants de formulaire
import AjouterCebForm from "@/components/forms/AjouterCebForm";
import ModifierCebForm from "@/components/forms/ModifierCebForm";
import DeleteCebConfirmation from "@/components/forms/DeleteCebConfirmation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
interface Ceb {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  paroisse_id: number;
  chapelle_id: number | null;
  president_id: number | null;
  president?: {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
    // Autres champs du président...
  };
}

export default function CebsPage() {
  const router = useRouter();
  const [cebs, setCebs] = useState<Ceb[]>([]);
  const [filteredCebs, setFilteredCebs] = useState<Ceb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les dialogues
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCeb, setSelectedCeb] = useState<Ceb | null>(null);

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

  // Fonction pour obtenir le nom de la paroisse
  const getParoisseName = (): string => {
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

  // Fonction utilitaire pour formater la date
  const formatExportDate = (): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  };

  // Exportation vers Excel
  const exportToExcel = async () => {
    try {
      setExporting(true);
      
      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();
      
      // Préparer les données pour l'exportation
      const exportData = filteredCebs.map((ceb, index) => ({
        'N°': index + 1,
        'Date d\'ajout': formatDate(ceb.created_at),
        'Nom de la CEB': ceb.nom,
        'Identifiant': ceb.identifiant || 'N/A',
        'Président': ceb.president 
          ? `${ceb.president.nom} ${ceb.president.prenoms}` 
          : 'Aucun',
        'Téléphone Président': ceb.president?.num_de_telephone || 'N/A',
        'Solde (FCFA)': ceb.solde || 0,
        'Nombre de Membres': 0, // À remplacer par la vraie valeur
      }));

      // Créer le workbook
      const wb = XLSX.utils.book_new();
      
      // Créer la feuille principale avec les données
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Ajouter des informations d'en-tête
      XLSX.utils.sheet_add_aoa(ws, [
        [`Liste des Communautés Ecclésiales de Base`],
        [`${paroisseName}`],
        [`Date d'exportation: ${exportDate}`],
        [`Nombre total de CEB: ${filteredCebs.length}`],
        [], // Ligne vide
      ], { origin: 'A1' });
      
      // Ajuster les largeurs des colonnes
      const colWidths = [
        { wch: 5 },  // N°
        { wch: 15 }, // Date
        { wch: 25 }, // Nom CEB
        { wch: 15 }, // Identifiant
        { wch: 20 }, // Président
        { wch: 15 }, // Téléphone
        { wch: 12 }, // Solde
        { wch: 10 }, // Membres
      ];
      ws['!cols'] = colWidths;
      
      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'CEB');
      
      // Sauvegarder le fichier
      const fileName = `CEB_${paroisseName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Exportation Excel réussie', {
        description: `Le fichier ${fileName} a été téléchargé.`
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'exportation Excel:', error);
      toast.error('Erreur lors de l\'exportation Excel');
    } finally {
      setExporting(false);
    }
  };

  // Exportation vers PDF
  const exportToPDF = async () => {
    try {
      setExporting(true);
      
      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();
      
      // Créer le document PDF
      const doc = new jsPDF();
      
      // Configuration des couleurs
      const primaryColor: [number, number, number] = [59, 130, 246]; // Blue-500
      const secondaryColor: [number, number, number] = [148, 163, 184]; // Slate-400
      const textColor: [number, number, number] = [15, 23, 42]; // Slate-900
      
      // En-tête du document avec design moderne
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 35, 'F');
      
      // Titre principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('COMMUNAUTÉS ECCLÉSIALES DE BASE', 105, 15, { align: 'center' });
      
      // Sous-titre
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(paroisseName, 105, 25, { align: 'center' });
      
      // Informations d'exportation
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(`Nombre total de CEB: ${filteredCebs.length}`, 20, 52);
      
      // Ligne de séparation
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 190, 58);
      
      // Préparer les données pour le tableau
      const tableData = filteredCebs.map((ceb, index) => [
        (index + 1).toString(),
        formatDate(ceb.created_at),
        ceb.nom,
        ceb.president 
          ? `${ceb.president.nom} ${ceb.president.prenoms}` 
          : 'Aucun',
        ceb.president?.num_de_telephone || 'N/A',
        '0', // Nombre de membres
      ]);
      
      // Créer le tableau avec autoTable
      autoTable(doc, {
        startY: 65,
        head: [['N°', 'Date d\'ajout', 'Nom de la CEB', 'Président', 'Téléphone', 'Membres']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: textColor,
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Slate-50
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' }, // N°
          1: { cellWidth: 25 }, // Date
          2: { cellWidth: 45 }, // Nom
          3: { cellWidth: 40 }, // Président
          4: { cellWidth: 30 }, // Téléphone
          5: { cellWidth: 20, halign: 'center' }, // Membres
        },
        margin: { left: 20, right: 20         },
      });
      
      // Pied de page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Ligne de séparation du pied de page
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(...secondaryColor);
        doc.line(20, pageHeight - 20, 190, pageHeight - 20);
        
        // Informations du pied de page
        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);
        doc.text(`Page ${i} sur ${pageCount}`, 105, pageHeight - 12, { align: 'center' });
        doc.text(`Généré le ${exportDate}`, 20, pageHeight - 12);
        doc.text('Système de Gestion Paroissiale', 190, pageHeight - 12, { align: 'right' });
      }
      
      // Sauvegarder le fichier
      const fileName = `CEB_${paroisseName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('Exportation PDF réussie', {
        description: `Le fichier ${fileName} a été téléchargé.`
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'exportation PDF:', error);
      toast.error('Erreur lors de l\'exportation PDF');
    } finally {
      setExporting(false);
    }
  };

  // Charger les CEB au montage du composant
  useEffect(() => {
    const loadCebs = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchCebs(paroisseId);
        setCebs(data);
        setFilteredCebs(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des CEB:", err);
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
          setError("Aucune CEB trouvée pour cette paroisse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCebs();
  }, [router, itemsPerPage]);

  // Filtrer les CEB selon la recherche
  useEffect(() => {
    let results = cebs;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter((ceb) => ceb.nom.toLowerCase().includes(query));
    }

    setFilteredCebs(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, cebs, itemsPerPage]);

  // Calculer les CEB à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCebs.slice(startIndex, endIndex);
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

  // Gérer le succès de la création
  const handleCreateSuccess = (newCeb: Ceb) => {
    // Ajouter la nouvelle CEB à la liste
    setCebs((prevCebs) => [newCeb, ...prevCebs]);
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedCeb: Ceb) => {
    // Remplacer la CEB existante dans la liste
    setCebs((prevCebs) =>
      prevCebs.map((c) => (c.id === updatedCeb.id ? updatedCeb : c))
    );
    // Réinitialiser l'état
    setSelectedCeb(null);
  };

  // Gérer le succès de la suppression
  const handleDeleteSuccess = (deletedId: number) => {
    // Filtrer la CEB supprimée de la liste
    const updatedList = cebs.filter((c) => c.id !== deletedId);
    setCebs(updatedList);

    // Réinitialiser l'état
    setSelectedCeb(null);
  };

  // Ouvrir le modal en mode édition
  const openEditModal = (ceb: SetStateAction<Ceb | null>) => {
    setSelectedCeb(ceb);
    setShowEditDialog(true);
  };

  // Ouvrir le modal en mode suppression
  const openDeleteModal = (ceb: SetStateAction<Ceb | null>) => {
    setSelectedCeb(ceb);
    setShowDeleteDialog(true);
  };

  // Ouvrir le modal en mode création
  const openAddModal = () => {
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Communautés Ecclésiales de Base (CEB)
          </h1>
          <p className="text-slate-500">
            Gérez les communautés ecclésiales de base de votre paroisse
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
                <h3 className="text-2xl font-bold">{cebs.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Church className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Sans président
                </p>
                <h3 className="text-2xl font-bold">
                  {cebs.filter((c) => !c.president_id).length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche + boutons */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher une CEB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {/* Bouton d'exportation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="cursor-pointer"
                disabled={exporting || filteredCebs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exportation...' : 'Exporter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                Exporter en Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                <FileDown className="h-4 w-4 mr-2 text-red-600" />
                Exporter en PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={openAddModal} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle CEB
          </Button>
        </div>
      </div>

      {/* Affichage conditionnel */}
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
      ) : filteredCebs.length === 0 ? (
        <div className="text-center py-12">
          <Church className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucune CEB trouvée
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            {searchQuery
              ? "Aucune CEB ne correspond à vos critères de recherche."
              : "Aucune CEB n'est enregistrée pour cette paroisse."}
          </p>
          {searchQuery ? (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Réinitialiser la recherche
            </Button>
          ) : (
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une CEB
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
          <Table className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-100 border-slate-200">
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Date d'ajout
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Nom Complets
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Président
                </TableHead>
                <TableHead className="font-semibold text-center text-slate-600 py-3 px-4">
                  Total Membres
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4 text-right">
                  Détails
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().map((ceb) => (
                <TableRow
                  key={ceb.id}
                  className="hover:bg-slate-50/80 border-slate-200"
                >
                  <TableCell className="text-slate-500 py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full mr-2 " />
                      {formatDate(ceb.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-slate-900">
                    {ceb.nom}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {ceb.president ? (
                      <div className="flex items-center text-sm">
                        <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                        <span>
                          {ceb.president.nom} {ceb.president.prenoms}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <span>Aucun</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="font-medium text-center">0</div>
                  </TableCell>
                  <TableCell className="text-right py-2 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/paroisse/ceb/${ceb.id}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {currentPage} sur {totalPages}
            </p>
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

      {/* Dialog d'ajout */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              Nouvelle Communauté Ecclésiale de Base
            </DialogTitle>
          </DialogHeader>
          <AjouterCebForm
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
          if (!open) setSelectedCeb(null);
        }}
      >
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg text-blue-800 font-semibold flex items-center">
              Modifier la CEB
            </DialogTitle>
          </DialogHeader>
          {selectedCeb && (
            <ModifierCebForm
              onClose={() => setShowEditDialog(false)}
              cebData={selectedCeb}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}