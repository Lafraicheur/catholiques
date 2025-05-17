/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  Download,
  Calendar,
  Heart,
  FileText,
  User,
  Loader2,
  XCircle,
  Users,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Components
import NewSacrementUnionForm from "@/components/forms/NewSacrementUnionForm";

// Types pour les sacrements union
interface Personne {
  id: number;
  nom: string;
  prenoms: string;
  num_de_telephone: string;
  email?: string;
  date_de_naissance?: string;
}

interface SacrementUnion {
  id: number;
  created_at: string;
  type: string;
  date: string;
  description: string;
  statut: string;
  temoin_marie: string;
  temoin_mariee: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  marie_id: number;
  mariee_id: number;
  images?: Array<any>;
  celebrant?: Personne;
  marie?: Personne;
  mariee?: Personne;
}

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return "Date inconnue";
  }
};

// Obtenir les détails du statut
const getStatusDetails = (statut: string) => {
  const normalizedStatus = statut.toUpperCase();
  
  switch (normalizedStatus) {
    case "CONFIRMÉ":
    case "CONFIRME":
    case "VALIDÉ":
    case "VALIDE":
      return { label: "Confirmé", variant: "success" as const };
    case "EN PRÉPARATION":
    case "EN PREPARATION":
    case "PREPARATION":
      return { label: "En préparation", variant: "secondary" as const };
    case "EN ATTENTE":
    case "ATTENTE":
      return { label: "En attente", variant: "warning" as const };
    case "TERMINÉ":
    case "TERMINE":
      return { label: "Terminé", variant: "default" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Composant pour afficher un élément de la liste des sacrements union
const SacrementUnionItem = ({
  sacrement,
  onDelete,
}: {
  sacrement: SacrementUnion;
  onDelete: (id: number) => void;
}) => {
  const router = useRouter();
  const { label: statusLabel, variant: statusVariant } = getStatusDetails(sacrement.statut);

  // Déterminer si la date est passée
  const isDatePassed = new Date(sacrement.date) < new Date();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 space-y-3">
        {/* En-tête avec badges */}
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className="flex items-center text-xs px-2 py-0.5"
            >
              <Heart className="h-3 w-3 mr-1" /> {sacrement.type}
            </Badge>
            <Badge variant={statusVariant} className="text-xs px-2 py-0.5">
              {statusLabel}
            </Badge>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center text-sm text-slate-500">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span className="font-medium">
            {formatDate(sacrement.date)}
          </span>
          {isDatePassed && (
            <Badge variant="outline" className="ml-2 text-xs">
              Passé
            </Badge>
          )}
        </div>

        {/* Couple */}
        <div className="mt-2">
          <h3 className="font-medium text-slate-900 flex items-center">
            <Users className="h-4 w-4 mr-1.5 text-blue-500" />
            {sacrement.marie?.nom 
              ? `${sacrement.marie?.prenoms} ${sacrement.marie?.nom} &` 
              : "Marié & "}
            {sacrement.mariee?.nom 
              ? ` ${sacrement.mariee?.prenoms} ${sacrement.mariee?.nom}` 
              : " Mariée"}
          </h3>
        </div>

        {/* Description abrégée */}
        {sacrement.description && (
          <p className="text-sm text-slate-600 line-clamp-2 mt-1">
            {sacrement.description.substring(0, 80)}
            {sacrement.description.length > 80 ? "..." : ""}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center px-2 h-8"
            onClick={() => router.push(`/dashboard/paroisse/sacrements/unions/${sacrement.id}`)}
          >
            Voir les détails
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="text-xs h-8"
            onClick={() => onDelete(sacrement.id)}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Page principale
export default function SacrementsUnionPage() {
  const router = useRouter();
  const [sacrements, setSacrements] = useState<SacrementUnion[]>([]);
  const [filteredSacrements, setFilteredSacrements] = useState<SacrementUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tous");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSacrementId, setSelectedSacrementId] = useState<number | null>(null);

  // Récupérer les sacrements union depuis l'API
  const fetchSacrements = async () => {
    setLoading(true);
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Obtenir l'ID de la paroisse
      const userProfileStr = localStorage.getItem("user_profile");
      let paroisse_id = "1"; // Valeur par défaut
      
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        paroisse_id = userProfile.paroisse_id || "1";
      }

      // Appel à l'API
      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/obtenir-tous?paroisse_id=${paroisse_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSacrements(data.items || []);
      setFilteredSacrements(data.items || []);
    } catch (err: any) {
      console.error("Erreur lors du chargement des sacrements:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors du chargement des données."
      );
      toast.error("Erreur", {
        description: "Impossible de charger les sacrements d'union.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSacrements();
  }, []);

  // Filtrer les sacrements selon la recherche et l'onglet actif
  useEffect(() => {
    let results = [...sacrements];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (sacrement) =>
          (sacrement.marie?.nom && sacrement.marie.nom.toLowerCase().includes(query)) ||
          (sacrement.marie?.prenoms && sacrement.marie.prenoms.toLowerCase().includes(query)) ||
          (sacrement.mariee?.nom && sacrement.mariee.nom.toLowerCase().includes(query)) ||
          (sacrement.mariee?.prenoms && sacrement.mariee.prenoms.toLowerCase().includes(query)) ||
          (sacrement.description && sacrement.description.toLowerCase().includes(query)) ||
          formatDate(sacrement.date).toLowerCase().includes(query)
      );
    }

    // Filtrer par statut selon l'onglet actif
    if (activeTab !== "tous") {
      switch (activeTab) {
        case "en-attente":
          results = results.filter(
            (sacrement) => sacrement.statut.toUpperCase() === "EN ATTENTE"
          );
          break;
        case "en-preparation":
          results = results.filter(
            (sacrement) => 
              sacrement.statut.toUpperCase() === "EN PRÉPARATION" || 
              sacrement.statut.toUpperCase() === "EN PREPARATION"
          );
          break;
        case "confirmes":
          results = results.filter(
            (sacrement) => 
              sacrement.statut.toUpperCase() === "CONFIRMÉ" || 
              sacrement.statut.toUpperCase() === "CONFIRME" ||
              sacrement.statut.toUpperCase() === "VALIDÉ" || 
              sacrement.statut.toUpperCase() === "VALIDE"
          );
          break;
        case "termines":
          results = results.filter(
            (sacrement) => 
              sacrement.statut.toUpperCase() === "TERMINÉ" || 
              sacrement.statut.toUpperCase() === "TERMINE"
          );
          break;
      }
    }

    // Trier par date (les plus récents en premier)
    results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredSacrements(results);
  }, [searchQuery, activeTab, sacrements]);

  // Supprimer un sacrement
  const handleDeleteSacrement = async (id: number) => {
    setSelectedSacrementId(id);
    setShowDeleteDialog(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!selectedSacrementId) return;
    
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }
      
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sacrement_id: selectedSacrementId }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      toast.success("Succès", {
        description: "Le sacrement d'union a été supprimé avec succès.",
      });
      
      // Mettre à jour la liste des sacrements
      fetchSacrements();
    } catch (err: any) {
      console.error("Erreur lors de la suppression du sacrement:", err);
      toast.error("Erreur", {
        description: "Impossible de supprimer le sacrement d'union.",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedSacrementId(null);
    }
  };

  // Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    // Créer les en-têtes du CSV
    let csvContent = "ID,Type,Date,Marié,Mariée,Statut,Description\n";
    
    // Ajouter les données
    filteredSacrements.forEach((sacrement) => {
      const marie = sacrement.marie 
        ? `${sacrement.marie.prenoms} ${sacrement.marie.nom}` 
        : "Non spécifié";
      const mariee = sacrement.mariee 
        ? `${sacrement.mariee.prenoms} ${sacrement.mariee.nom}` 
        : "Non spécifié";
      
      // Échapper les virgules et les guillemets dans la description
      const safeDescription = sacrement.description 
        ? sacrement.description.replace(/"/g, '""') 
        : "";
      
      csvContent += `${sacrement.id},"${sacrement.type}","${sacrement.date}","${marie}","${mariee}","${sacrement.statut}","${safeDescription}"\n`;
    });
    
    // Créer un Blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `sacrements_union_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compter les sacrements par statut
  const countSacrements = () => {
    const counts = {
      enAttente: 0,
      enPreparation: 0,
      confirmes: 0,
      termines: 0,
    };

    sacrements.forEach((sacrement) => {
      const status = sacrement.statut.toUpperCase();
      if (status === "EN ATTENTE") {
        counts.enAttente++;
      } else if (status === "EN PRÉPARATION" || status === "EN PREPARATION") {
        counts.enPreparation++;
      } else if (status === "CONFIRMÉ" || status === "CONFIRME" || status === "VALIDÉ" || status === "VALIDE") {
        counts.confirmes++;
      } else if (status === "TERMINÉ" || status === "TERMINE") {
        counts.termines++;
      }
    });

    return counts;
  };

  const counts = countSacrements();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Gestion des Sacrements d'Union
        </h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-2">
            <Calendar className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">En attente</p>
          <p className="text-2xl font-bold">{counts.enAttente}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">En préparation</p>
          <p className="text-2xl font-bold">{counts.enPreparation}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Confirmés</p>
          <p className="text-2xl font-bold">{counts.confirmes}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Calendar className="h-4 w-4 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Terminés</p>
          <p className="text-2xl font-bold">{counts.termines}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">
            Sacrements d'Union ({sacrements.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              title="Exporter en CSV"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <NewSacrementUnionForm onSuccess={fetchSacrements} />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="en-attente">En attente</TabsTrigger>
            <TabsTrigger value="en-preparation">En préparation</TabsTrigger>
            <TabsTrigger value="confirmes">Confirmés</TabsTrigger>
            <TabsTrigger value="termines">Terminés</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <span className="ml-3 text-slate-500">
                  Chargement des sacrements...
                </span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <XCircle className="h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Une erreur est survenue
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
                <Button onClick={() => fetchSacrements()}>
                  Réessayer
                </Button>
              </div>
            ) : filteredSacrements.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
                <Users className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucun sacrement trouvé
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  {searchQuery
                    ? "Aucun sacrement ne correspond à votre recherche."
                    : "Aucun sacrement d'union n'est enregistré pour le moment."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Effacer la recherche
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSacrements.map((sacrement) => (
                  <SacrementUnionItem 
                    key={sacrement.id} 
                    sacrement={sacrement} 
                    onDelete={handleDeleteSacrement}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialog de confirmation de suppression */}
      {selectedSacrementId && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce sacrement d'union ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
              >
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}