// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useEffect, SetStateAction } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Church,
//   Users,
//   Search,
//   Plus,
//   Filter,
//   User,
//   ChevronRight,
//   Eye,
//   Trash2,
//   XCircle,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import {
//   fetchMouvements,
//   ApiError,
//   AuthenticationError,
//   ForbiddenError,
//   NotFoundError,
// } from "@/services/api";
// import { Download, FileSpreadsheet, FileDown } from "lucide-react";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// // Importer les nouveaux composants de formulaire
// import AjouterMouvementForm from "@/components/forms/AjouterMouvementForm";
// import DeleteConfirmationDialog from "@/components/forms/DeleteConfirmationDialog";
// import { TYPES_MOUVEMENT } from "@/lib/constants";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// // Types
// interface Mouvement {
//   [x: string]: any;
//   id: number;
//   created_at: string;
//   identifiant: string;
//   nom: string;
//   solde: number;
//   type: string;
//   responsable_id: number | null;
//   parrain_id: number | null;
//   aumonier_id: number | null;
//   paroisse_id: number;
//   chapelle_id: number | null;
// }

// // Types pour les filtres
// const TYPES_MOUVEMENT_FILTER = ["TOUS", ...TYPES_MOUVEMENT];

// export default function MouvementsAssociationsPage() {
//   const router = useRouter();
//   const [mouvements, setMouvements] = useState<Mouvement[]>([]);
//   const [filteredMouvements, setFilteredMouvements] = useState<Mouvement[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("TOUS");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

//   // États pour les dialogues
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [selectedMouvement, setSelectedMouvement] = useState<Mouvement | null>(
//     null
//   );
//   const [exporting, setExporting] = useState(false);

//   // Récupérer l'ID de la paroisse à partir du localStorage
//   const getUserParoisseId = (): number => {
//     try {
//       const userProfileStr = localStorage.getItem("user_profile");
//       if (userProfileStr) {
//         const userProfile = JSON.parse(userProfileStr);
//         return userProfile.paroisse_id || 0;
//       }
//     } catch (err) {
//       console.error("Erreur lors de la récupération du profil:", err);
//     }
//     return 0;
//   };

//   // Charger les mouvements au montage du composant
//   useEffect(() => {
//     const loadMouvements = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const paroisseId = getUserParoisseId();
//         if (!paroisseId) {
//           throw new Error("ID de paroisse non disponible");
//         }

//         const data = await fetchMouvements(paroisseId);
//         setMouvements(data);
//         setFilteredMouvements(data);
//         setTotalPages(Math.ceil(data.length / itemsPerPage));
//       } catch (err) {
//         console.error("Erreur lors du chargement des mouvements:", err);
//         if (err instanceof AuthenticationError) {
//           toast.error("Session expirée", {
//             description: "Veuillez vous reconnecter pour continuer.",
//           });
//           router.push("/login");
//         } else if (err instanceof ForbiddenError) {
//           setError(
//             "Vous n'avez pas les droits nécessaires pour accéder à cette ressource."
//           );
//         } else if (err instanceof NotFoundError) {
//           setError(
//             "Aucun mouvement ou association trouvé pour cette paroisse."
//           );
//         } else {
//           setError("Une erreur est survenue lors du chargement des données.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMouvements();
//   }, [router, itemsPerPage]);

//   // Filtrer les mouvements selon la recherche et le type
//   useEffect(() => {
//     let results = mouvements;

//     // Filtrer par type
//     if (typeFilter !== "TOUS") {
//       results = results.filter((mouv) => mouv.type === typeFilter);
//     }

//     // Filtrer par recherche
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim();
//       results = results.filter((mouv) =>
//         mouv.nom.toLowerCase().includes(query)
//       );
//     }

//     setFilteredMouvements(results);
//     setCurrentPage(1);
//     setTotalPages(Math.ceil(results.length / itemsPerPage));
//   }, [searchQuery, typeFilter, mouvements, itemsPerPage]);

//   // Calculer les mouvements à afficher pour la pagination
//   const getCurrentPageItems = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredMouvements.slice(startIndex, endIndex);
//   };

//   // Navigation de pagination
//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Formater la monnaie en FCFA
//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat("fr-FR", {
//       style: "currency",
//       currency: "XOF",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Formater les dates: 2023-05-15 -> 15/05/2023
//   const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return "Non renseignée";

//     try {
//       const date = new Date(dateString);
//       return new Intl.DateTimeFormat("fr-FR").format(date);
//     } catch (err) {
//       console.error("Erreur lors du formatage de la date:", err);
//       return dateString;
//     }
//   };

//   const getParoisseName = (): string => {
//     try {
//       const userProfileStr = localStorage.getItem("user_profile");
//       if (userProfileStr) {
//         const userProfile = JSON.parse(userProfileStr);
//         return userProfile.paroisse_nom || "Paroisse";
//       }
//     } catch (err) {
//       console.error(
//         "Erreur lors de la récupération du nom de la paroisse:",
//         err
//       );
//     }
//     return "Paroisse";
//   };

//   const formatExportDate = (): string => {
//     return new Intl.DateTimeFormat("fr-FR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(new Date());
//   };

//   const exportToExcel = async () => {
//     try {
//       setExporting(true);

//       const exportDate = formatExportDate();
//       const paroisseName = getParoisseName();

//       const exportData = filteredMouvements.map((mouvement, index) => ({
//         "N°": index + 1,
//         "Date d'ajout": formatDate(mouvement.created_at),
//         "Nom du Mouvement": mouvement.nom,
//         Type: mouvement.type,
//         Identifiant: mouvement.identifiant || "N/A",
//         Responsable: mouvement.responsable
//           ? `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
//           : "Aucun",
//         "Solde (FCFA)": mouvement.solde || 0,
//         "Nombre de Membres": 0, // À remplacer par la vraie valeur
//       }));

//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(exportData);

//       XLSX.utils.sheet_add_aoa(
//         ws,
//         [
//           [`Liste des Mouvements et Associations`],
//           [`${paroisseName}`],
//           [`Date d'exportation: ${exportDate}`],
//           [`Nombre total: ${filteredMouvements.length}`],
//           [],
//         ],
//         { origin: "A1" }
//       );

//       const colWidths = [
//         { wch: 5 }, // N°
//         { wch: 15 }, // Date
//         { wch: 30 }, // Nom
//         { wch: 20 }, // Type
//         { wch: 15 }, // Identifiant
//         { wch: 25 }, // Responsable
//         { wch: 12 }, // Solde
//         { wch: 10 }, // Membres
//       ];
//       ws["!cols"] = colWidths;

//       XLSX.utils.book_append_sheet(wb, ws, "Mouvements");

//       const fileName = `Mouvements_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
//       XLSX.writeFile(wb, fileName);

//       toast.success("Exportation Excel réussie", {
//         description: `Le fichier ${fileName} a été téléchargé.`,
//       });
//     } catch (error) {
//       console.error("Erreur lors de l'exportation Excel:", error);
//       toast.error("Erreur lors de l'exportation Excel");
//     } finally {
//       setExporting(false);
//     }
//   };

//   const exportToPDF = async () => {
//     try {
//       setExporting(true);

//       const exportDate = formatExportDate();
//       const paroisseName = getParoisseName();

//       const doc = new jsPDF();

//       const primaryColor: [number, number, number] = [59, 130, 246];
//       const secondaryColor: [number, number, number] = [148, 163, 184];
//       const textColor: [number, number, number] = [15, 23, 42];

//       // En-tête
//       doc.setFillColor(...primaryColor);
//       doc.rect(0, 0, 210, 35, "F");

//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(18);
//       doc.setFont("helvetica", "bold");
//       doc.text("MOUVEMENTS ET ASSOCIATIONS", 105, 15, { align: "center" });

//       doc.setFontSize(12);
//       doc.setFont("helvetica", "normal");
//       doc.text(paroisseName, 105, 25, { align: "center" });

//       // Informations
//       doc.setTextColor(...textColor);
//       doc.setFontSize(10);
//       doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
//       doc.text(`Nombre total: ${filteredMouvements.length}`, 20, 52);

//       doc.setDrawColor(...secondaryColor);
//       doc.setLineWidth(0.5);
//       doc.line(20, 58, 190, 58);

//       // Données du tableau
//       const tableData = filteredMouvements.map((mouvement, index) => [
//         (index + 1).toString(),
//         formatDate(mouvement.created_at),
//         mouvement.nom.length > 25
//           ? mouvement.nom
//           : mouvement.nom,
//         mouvement.type,
//         mouvement.responsable
//           ? `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
//               .length > 20
//             ? `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
//             : `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
//           : "Aucun",
//         "0", // Membres
//       ]);

//       autoTable(doc, {
//         startY: 65,
//         head: [
//           ["N°", "Date", "Nom du Mouvement", "Type", "Responsable", "Membres"],
//         ],
//         body: tableData,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           textColor: textColor,
//         },
//         headStyles: {
//           fillColor: primaryColor,
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//           fontSize: 10,
//         },
//         alternateRowStyles: {
//           fillColor: [248, 250, 252],
//         },
//         columnStyles: {
//           0: { cellWidth: 15, halign: "center" },
//           1: { cellWidth: 25 },
//           2: { cellWidth: 45 },
//           3: { cellWidth: 25 },
//           4: { cellWidth: 35 },
//           5: { cellWidth: 20, halign: "center" },
//         },
//         margin: { left: 20, right: 20 },
//       });

//       // Pied de page (même logique que CEB)
//       const pageCount = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         const pageHeight = doc.internal.pageSize.height;
//         doc.setDrawColor(...secondaryColor);
//         doc.line(20, pageHeight - 20, 190, pageHeight - 20);

//         doc.setFontSize(8);
//         doc.setTextColor(...secondaryColor);
//         doc.text(`Page ${i} sur ${pageCount}`, 105, pageHeight - 12, {
//           align: "center",
//         });
//         doc.text(`Généré le ${exportDate}`, 20, pageHeight - 12);
//         doc.text("Système de Gestion Paroissiale", 190, pageHeight - 12, {
//           align: "right",
//         });
//       }

//       const fileName = `Mouvements_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
//       doc.save(fileName);

//       toast.success("Exportation PDF réussie", {
//         description: `Le fichier ${fileName} a été téléchargé.`,
//       });
//     } catch (error) {
//       console.error("Erreur lors de l'exportation PDF:", error);
//       toast.error("Erreur lors de l'exportation PDF");
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Gérer le succès de la création
//   const handleCreateSuccess = (newMouvement: Mouvement) => {
//     // Ajouter le nouveau mouvement à la liste
//     setMouvements((prevMouvements) => [newMouvement, ...prevMouvements]);
//   };

//   // Gérer le succès de la mise à jour
//   const handleUpdateSuccess = (updatedMouvement: Mouvement) => {
//     // Remplacer le mouvement existant dans la liste
//     setMouvements((prevMouvements) =>
//       prevMouvements.map((m) =>
//         m.id === updatedMouvement.id ? updatedMouvement : m
//       )
//     );
//     // Réinitialiser les états
//     setSelectedMouvement(null);
//   };

//   // Gérer le succès de la suppression
//   const handleDeleteSuccess = (deletedId: string | number) => {
//     // Filtrer le mouvement supprimé de la liste
//     const updatedList = mouvements.filter((m) => m.id !== deletedId);
//     setMouvements(updatedList);

//     // Réinitialiser l'état
//     setSelectedMouvement(null);
//   };

//   // Ouvrir le modal en mode édition
//   const openEditModal = (mouvement: SetStateAction<Mouvement | null>) => {
//     setSelectedMouvement(mouvement);
//     setShowEditDialog(true);
//   };

//   // Ouvrir le modal en mode suppression
//   const openDeleteModal = (mouvement: SetStateAction<Mouvement | null>) => {
//     setSelectedMouvement(mouvement);
//     setShowDeleteDialog(true);
//   };

//   // Ouvrir le modal en mode création
//   const openAddModal = () => {
//     setShowAddDialog(true);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 mb-1">
//             Mouvements et Associations
//           </h1>
//           <p className="text-slate-500">
//             Gérez les mouvements et associations de votre paroisse
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-500">Total</p>
//                 <h3 className="text-2xl font-bold">{mouvements.length}</h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                 <Users className="h-5 w-5 text-blue-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-500">
//                   Sans responsable
//                 </p>
//                 <h3 className="text-2xl font-bold">
//                   {mouvements.filter((m) => !m.responsable_id).length}
//                 </h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
//                 <User className="h-5 w-5 text-amber-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="mb-6 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder="Rechercher un mouvement ou une association..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//         <div className="w-full md:w-120">
//           <Select value={typeFilter} onValueChange={setTypeFilter}>
//             <SelectTrigger>
//               <div className="flex items-center cursor-pointer">
//                 <Filter className="h-4 w-4 mr-2 text-slate-400" />
//                 <SelectValue placeholder="Filtrer par type" />
//               </div>
//             </SelectTrigger>
//             <SelectContent className="max-h-72 overflow-y-auto">
//               {TYPES_MOUVEMENT_FILTER.map((type) => (
//                 <SelectItem key={type} value={type} className="cursor-pointer">
//                   {type === "TOUS" ? "TOUS LES TYPES" : type}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className="cursor-pointer"
//               disabled={exporting || filteredMouvements.length === 0}
//             >
//               <Download className="h-4 w-4 mr-2" />
//               {exporting ? "Exportation..." : "Exporter"}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem
//               onClick={exportToExcel}
//               className="cursor-pointer"
//             >
//               <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
//               Exporter en Excel
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
//               <FileDown className="h-4 w-4 mr-2 text-red-600" />
//               Exporter en PDF
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <Button onClick={openAddModal} className="cursor-pointer">
//           <Plus className="h-4 w-4 mr-2" />
//           Nouveau Mouvement
//         </Button>
//       </div>

//       {loading ? (
//         <div className="space-y-4">
//           {Array(6)
//             .fill(0)
//             .map((_, index) => (
//               <div key={index} className="border-b pb-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                   <div>
//                     <Skeleton className="h-6 w-48 mb-2" />
//                     <Skeleton className="h-4 w-32" />
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Skeleton className="h-8 w-20" />
//                     <Skeleton className="h-8 w-10" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       ) : error ? (
//         <div className="text-center py-12">
//           <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//           <h3 className="text-lg font-medium text-slate-900 mb-2">
//             Impossible de charger les données
//           </h3>
//           <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
//             {error}
//           </p>
//           <Button variant="outline" onClick={() => window.location.reload()}>
//             Réessayer
//           </Button>
//         </div>
//       ) : filteredMouvements.length === 0 ? (
//         <div className="text-center py-12">
//           <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//           <h3 className="text-lg font-medium text-slate-900 mb-2">
//             Aucun mouvement trouvé
//           </h3>
//           <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
//             {searchQuery || typeFilter !== "TOUS"
//               ? "Aucun mouvement ou association ne correspond à vos critères de recherche."
//               : "Aucun mouvement ou association n'est enregistré pour cette paroisse."}
//           </p>
//           {searchQuery || typeFilter !== "TOUS" ? (
//             <Button
//               onClick={() => {
//                 setSearchQuery("");
//                 setTypeFilter("TOUS");
//               }}
//               className="cursor-pointer"
//             >
//               Réinitialiser les filtres
//             </Button>
//           ) : (
//             <Button onClick={openAddModal}>
//               <Plus className="h-4 w-4 mr-2" />
//               Créer un mouvement
//             </Button>
//           )}
//         </div>
//       ) : (
//         <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
//           <Table className="w-full">
//             <TableHeader className="bg-slate-50">
//               <TableRow className="hover:bg-slate-100 border-slate-200">
//                 <TableHead className="font-semibold text-slate-600 py-3 px-4">
//                   Date d'ajout
//                 </TableHead>
//                 <TableHead className="font-semibold text-slate-600 py-3 px-4">
//                   Nom Complets
//                 </TableHead>
//                 <TableHead className="font-semibold text-slate-600 py-3 px-4">
//                   Type
//                 </TableHead>
//                 <TableHead className="font-semibold text-slate-600 py-3 px-4">
//                   Responsable
//                 </TableHead>
//                 <TableHead className="font-semibold text-center text-slate-600 py-3 px-4">
//                   Total Membres
//                 </TableHead>
//                 <TableHead className="font-semibold text-slate-600 py-3 px-4 text-right">
//                   Détails
//                 </TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {getCurrentPageItems().map((mouvement) => (
//                 <TableRow
//                   key={mouvement.id}
//                   className="hover:bg-slate-50/80 border-slate-200"
//                 >
//                   <TableCell className="text-slate-500 py-3 px-4">
//                     <div className="flex items-center">
//                       <div className="h-2 w-2 rounded-full mr-2 " />
//                       {formatDate(mouvement.created_at)}{" "}
//                     </div>
//                   </TableCell>
//                   <TableCell className="py-3 px-4 font-medium text-slate-900">
//                     {mouvement.nom}
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline" className="font-normal">
//                       {mouvement.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     {mouvement.responsable_id ? (
//                       <div className="flex items-center text-sm">
//                         <User className="h-3.5 w-3.5 mr-1 opacity-70" />
//                         <span>
//                           {mouvement.responsable.nom}{" "}
//                           {mouvement.responsable.prenoms}
//                         </span>
//                       </div>
//                     ) : (
//                       <span className="text-sm">Aucun</span>
//                     )}
//                   </TableCell>
//                   <TableCell className="text-center font-medium">0</TableCell>
//                   <TableCell className="text-right py-2 px-4">
//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
//                         onClick={() =>
//                           router.push(`/dashboard/paroisse/m&a/${mouvement.id}`)
//                         }
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
//             <p className="text-sm text-slate-500">
//               Page {currentPage} sur {totalPages}
//             </p>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 Précédent
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={goToNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 Suivant
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <DialogContent>
//           {selectedMouvement && (
//             <DeleteConfirmationDialog
//               mouvement={selectedMouvement}
//               onClose={() => setShowDeleteDialog(false)}
//               onSuccess={handleDeleteSuccess}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//         <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
//           <DialogHeader className="pb-2">
//             <DialogTitle className="text-lg font-semibold flex items-center">
//               Nouveau Mouvement ou Association
//             </DialogTitle>
//           </DialogHeader>
//           <AjouterMouvementForm
//             onClose={() => setShowAddDialog(false)}
//             onSuccess={handleCreateSuccess}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// <div className="container mx-auto py-6">

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  Church,
  Users,
  Search,
  Plus,
  Filter,
  User,
  ChevronRight,
  ChevronLeft,
  Eye,
  Trash2,
  XCircle,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Download,
  FileSpreadsheet,
  FileDown,
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
  fetchMouvements,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Importer les nouveaux composants de formulaire
import AjouterMouvementForm from "@/components/forms/AjouterMouvementForm";
import DeleteConfirmationDialog from "@/components/forms/DeleteConfirmationDialog";
import { TYPES_MOUVEMENT } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
interface Mouvement {
  [x: string]: any;
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  type: string;
  responsable_id: number | null;
  parrain_id: number | null;
  aumonier_id: number | null;
  paroisse_id: number;
  chapelle_id: number | null;
}

// Types pour les filtres
const TYPES_MOUVEMENT_FILTER = ["TOUS", ...TYPES_MOUVEMENT];

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
          <div className="text-xl font-bold text-slate-900">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MouvementsAssociationsPage() {
  const router = useRouter();
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [filteredMouvements, setFilteredMouvements] = useState<Mouvement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("TOUS");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les dialogues
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMouvement, setSelectedMouvement] = useState<Mouvement | null>(
    null
  );
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

  // Charger les mouvements au montage du composant
  useEffect(() => {
    const loadMouvements = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchMouvements(paroisseId);
        setMouvements(data);
        setFilteredMouvements(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des mouvements:", err);
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
          setError(
            "Aucun mouvement ou association trouvé pour cette paroisse."
          );
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMouvements();
  }, [router, itemsPerPage]);

  // Filtrer les mouvements selon la recherche et le type
  useEffect(() => {
    let results = mouvements;

    // Filtrer par type
    if (typeFilter !== "TOUS") {
      results = results.filter((mouv) => mouv.type === typeFilter);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter((mouv) =>
        mouv.nom.toLowerCase().includes(query)
      );
    }

    setFilteredMouvements(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, typeFilter, mouvements, itemsPerPage]);

  // Calculer les mouvements à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMouvements.slice(startIndex, endIndex);
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

  const exportToExcel = async () => {
    try {
      setExporting(true);

      const exportDate = formatExportDate();
      const paroisseName = getParoisseName();

      const exportData = filteredMouvements.map((mouvement, index) => ({
        "N°": index + 1,
        "Date d'ajout": formatDate(mouvement.created_at),
        "Nom du Mouvement": mouvement.nom,
        Type: mouvement.type,
        Identifiant: mouvement.identifiant || "N/A",
        Responsable: mouvement.responsable
          ? `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
          : "Aucun",
        "Solde (FCFA)": mouvement.solde || 0,
        "Nombre de Membres": 0, // À remplacer par la vraie valeur
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [`Liste des Mouvements et Associations`],
          [`${paroisseName}`],
          [`Date d'exportation: ${exportDate}`],
          [`Nombre total: ${filteredMouvements.length}`],
          [],
        ],
        { origin: "A1" }
      );

      const colWidths = [
        { wch: 5 }, // N°
        { wch: 15 }, // Date
        { wch: 30 }, // Nom
        { wch: 20 }, // Type
        { wch: 15 }, // Identifiant
        { wch: 25 }, // Responsable
        { wch: 12 }, // Solde
        { wch: 10 }, // Membres
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Mouvements");

      const fileName = `Mouvements_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
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
      doc.text("MOUVEMENTS ET ASSOCIATIONS", 105, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(paroisseName, 105, 25, { align: "center" });

      // Informations
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
      doc.text(`Nombre total: ${filteredMouvements.length}`, 20, 52);

      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 190, 58);

      // Données du tableau
      const tableData = filteredMouvements.map((mouvement, index) => [
        (index + 1).toString(),
        formatDate(mouvement.created_at),
        mouvement.nom.length > 25 ? mouvement.nom : mouvement.nom,
        mouvement.type,
        mouvement.responsable
          ? `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
              .length > 20
            ? `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
            : `${mouvement.responsable.nom} ${mouvement.responsable.prenoms}`
          : "Aucun",
        "0", // Membres
      ]);

      autoTable(doc, {
        startY: 65,
        head: [
          ["N°", "Date", "Nom du Mouvement", "Type", "Responsable", "Membres"],
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
          1: { cellWidth: 25 },
          2: { cellWidth: 45 },
          3: { cellWidth: 25 },
          4: { cellWidth: 35 },
          5: { cellWidth: 20, halign: "center" },
        },
        margin: { left: 20, right: 20 },
      });

      // Pied de page (même logique que CEB)
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

      const fileName = `Mouvements_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
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

  // Gérer le succès de la création
  const handleCreateSuccess = (newMouvement: Mouvement) => {
    // Ajouter le nouveau mouvement à la liste
    setMouvements((prevMouvements) => [newMouvement, ...prevMouvements]);
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedMouvement: Mouvement) => {
    // Remplacer le mouvement existant dans la liste
    setMouvements((prevMouvements) =>
      prevMouvements.map((m) =>
        m.id === updatedMouvement.id ? updatedMouvement : m
      )
    );
    // Réinitialiser les états
    setSelectedMouvement(null);
  };

  // Gérer le succès de la suppression
  const handleDeleteSuccess = (deletedId: string | number) => {
    // Filtrer le mouvement supprimé de la liste
    const updatedList = mouvements.filter((m) => m.id !== deletedId);
    setMouvements(updatedList);

    // Réinitialiser l'état
    setSelectedMouvement(null);
  };

  // Ouvrir le modal en mode édition
  const openEditModal = (mouvement: SetStateAction<Mouvement | null>) => {
    setSelectedMouvement(mouvement);
    setShowEditDialog(true);
  };

  // Ouvrir le modal en mode suppression
  const openDeleteModal = (mouvement: SetStateAction<Mouvement | null>) => {
    setSelectedMouvement(mouvement);
    setShowDeleteDialog(true);
  };

  // Ouvrir le modal en mode création
  const openAddModal = () => {
    setShowAddDialog(true);
  };

  // Fonction pour obtenir le badge de type avec couleurs
  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { className: string; label: string }> = {
      MOUVEMENT: {
        className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-200",
        label: "Mouvement",
      },
      ASSOCIATION: {
        className: "bg-green-50 text-green-700 border-green-200",
        label: "Association",
      },
      GROUPE: {
        className: "bg-purple-50 text-purple-700 border-purple-200",
        label: "Groupe",
      },
      CHORALE: {
        className: "bg-pink-50 text-pink-700 border-pink-200",
        label: "Chorale",
      },
    };

    const typeInfo = typeMap[type] || {
      className:
        "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-200",
      label: type,
    };

    return (
      <Badge
        className={`px-3 py-1 font-medium text-sm rounded-full ${typeInfo.className}`}
      >
        {typeInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Mouvements et Associations
          </h1>
          <p className="text-slate-500">
            Gérez les mouvements et associations de votre paroisse
          </p>
        </div>
      </div>

      {/* Statistiques avec nouveau design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Mouvements"
          value={mouvements.length}
          icon={<Users size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Avec Responsable"
          value={mouvements.filter((m) => m.responsable_id).length}
          icon={<UserCheck size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Sans Responsable"
          value={mouvements.filter((m) => !m.responsable_id).length}
          icon={<UserX size={24} />}
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
              placeholder="Rechercher un mouvement ou une association..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-9 bg-white border-slate-200 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Section filtres et actions */}
          <div className="flex gap-4">
            {/* Filtre par type moderne */}
            <div className="w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Filtrer par type" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg rounded-xl max-h-72 overflow-y-auto">
                  {TYPES_MOUVEMENT_FILTER.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="cursor-pointer"
                    >
                      {type === "TOUS" ? "TOUS LES TYPES" : type}
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
                  className="h-9 px-6 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  disabled={exporting || filteredMouvements.length === 0}
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

            {/* Bouton d'ajout moderne */}
            <Button
              onClick={openAddModal}
              className="h-9 px-6 bg-slate-800 text-white rounded-xl shadow-sm transition-all duration-200 font-medium cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Mouvement
            </Button>
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
      ) : filteredMouvements.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun mouvement trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            {searchQuery || typeFilter !== "TOUS"
              ? "Aucun mouvement ou association ne correspond à vos critères de recherche."
              : "Aucun mouvement ou association n'est enregistré pour cette paroisse."}
          </p>
          {searchQuery || typeFilter !== "TOUS" ? (
            <Button
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("TOUS");
              }}
              className="cursor-pointer"
            >
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un mouvement
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header du tableau moderne */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Mouvements & Associations
              </h3>
              <div className="text-sm text-slate-500">
                {filteredMouvements.length} résultat
                {filteredMouvements.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Date d'ajout
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Nom du Mouvement
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
                  Responsable
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-center">
                  Membres
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
                  Détails
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().map((mouvement) => (
                <TableRow
                  key={mouvement.id}
                  className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-fullopacity-60" />
                      <span className="text-slate-600 font-medium">
                        {formatDate(mouvement.created_at)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-base">
                          {mouvement.nom}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    {getTypeBadge(mouvement.type)}
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    {mouvement.responsable_id ? (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">
                            {mouvement.responsable.nom}{" "}
                            {mouvement.responsable.prenoms}
                          </div>
                          {mouvement.responsable.num_de_telephone && (
                            <div className="text-xs text-slate-500">
                              {mouvement.responsable.num_de_telephone}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="text-amber-600 font-medium text-sm">
                          Aucun responsable
                        </span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 px-6 text-center">
                    <div className="inline-flex items-center justify-center h-8 w-12 bg-slate-100 rounded-lg font-semibold text-slate-700">
                      0
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/paroisse/m&a/${mouvement.id}`)
                        }
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
              {Math.min(currentPage * itemsPerPage, filteredMouvements.length)}{" "}
              sur {filteredMouvements.length} résultats
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

      {/* Dialogs */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          {selectedMouvement && (
            <DeleteConfirmationDialog
              mouvement={selectedMouvement}
              onClose={() => setShowDeleteDialog(false)}
              onSuccess={handleDeleteSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-slate-800" />
              Nouveau Mouvement ou Association
            </DialogTitle>
          </DialogHeader>
          <AjouterMouvementForm
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
