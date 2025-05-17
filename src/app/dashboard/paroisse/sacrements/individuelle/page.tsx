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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NewSacrementIndividuelForm from "@/components/forms/NewSacrementIndividuelForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Fonction pour récupérer l'ID de la paroisse depuis le profil utilisateur
const getUserParoisseId = () => {
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

// Types pour les sacrements individuels
interface SacrementIndividuel {
  id: number;
  created_at: string;
  type: string;
  soustype: string;
  date: string;
  description: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  certificateur_id: number | null;
  celebrant?: {
    id: number;
    nom: string;
    prenoms: string;
  };
  // Champs supplémentaires qui pourraient être utiles
  lieu?: string;
  heure?: string;
  personne?: string;
  statut?: string;
  preparation?: string;
}

// Formatage de la date
const formatDate = (dateString: string) => {
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
const extractStatut = (sacrement: SacrementIndividuel) => {
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
const getSacrementSoustypeDetails = (soustype: string) => {
  const soustypeLC = soustype.toLowerCase();

  if (soustypeLC.includes("baptême") || soustypeLC === "bapteme") {
    return {
      label: "Baptême",
      variant: "default" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "baptemes",
    };
  } else if (soustypeLC.includes("communion")) {
    return {
      label: "Première Communion",
      variant: "success" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "firstcommunions",
    };
  } else if (soustypeLC.includes("profession")) {
    return {
      label: "Profession de Foi",
      variant: "contained",
      color: "error",
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "professiondefoi",
    };
  } else if (soustypeLC.includes("malade")) {
    return {
      label: "Sacrement de Malade",
      variant: "primary" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "sacrementdemalade",
    };
  } else {
    return {
      label: soustype,
      variant: "default" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "autres",
    };
  }
};

// Fonction pour extraire le nom de la personne concernée depuis la description
const extractPersonne = (sacrement: SacrementIndividuel) => {
  // Chercher un nom dans la description
  const personneMatch = sacrement.description.match(
    /(?:pour|de|à)\s+([^.,;]+)/i
  );
  if (personneMatch) {
    return personneMatch[1].trim();
  }

  // Si aucun match, retourner un placeholder
  return "Participant(e)";
};

// Détails du statut
const getStatusDetails = (statut: string) => {
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

// Composant SacrementIndividuelItem
const SacrementIndividuelItem = ({
  sacrement,
  onDelete,
}: {
  sacrement: SacrementIndividuel;
  onDelete: (id: number) => void;
}) => {
  const {
    label: typeLabel,
    variant: typeVariant,
    icon: typeIcon,
  } = getSacrementSoustypeDetails(sacrement.soustype);

  const statut = extractStatut(sacrement);
  const { label: statusLabel, variant: statusVariant } =
    getStatusDetails(statut);
  const personne = extractPersonne(sacrement);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(sacrement.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 h-full flex flex-col">
        {/* En-tête avec badges */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={typeVariant}
              className="flex items-center text-xs px-2 py-0.5"
            >
              {typeIcon} {typeLabel}
            </Badge>
            <Badge variant={statusVariant} className="text-xs px-2 py-0.5">
              {statusLabel}
            </Badge>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-grow">
          {/* Date */}
          <div className="flex items-center text-xs text-slate-500 mb-1.5">
            <Calendar className="h-3 w-3 mr-1.5" />
            <span className="truncate">{formatDate(sacrement.date)}</span>
          </div>

          {/* Description courte */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
            {sacrement.description.substring(0, 80)}
            {sacrement.description.length > 80 ? "..." : ""}
          </p>
        </div>

        {/* Pied de carte */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-1">
            <Button
              variant="default"
              size="sm"
              className="h-7 text-xs px-2.5"
              asChild
            >
              <a
                href={`/dashboard/paroisse/sacrements/individuelle/${sacrement.id}`}
              >
                Détails
              </a>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce sacrement ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default function SacrementsIndividuelsPage() {
  const router = useRouter();
  const [sacrements, setSacrements] = useState<SacrementIndividuel[]>([]);
  const [filteredSacrements, setFilteredSacrements] = useState<
    SacrementIndividuel[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tous");

  // Récupérer les sacrements individuels depuis l'API
  const fetchSacrements = async () => {
    setLoading(true);
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Obtenir l'ID de la paroisse avec la fonction fournie
      const paroisse_id = getUserParoisseId();

      if (!paroisse_id) {
        throw new Error("ID de paroisse non trouvé");
      }

      // Appel à l'API
      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/obtenir-tous?paroisse_id=${paroisse_id}`,
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
        err.message || "Une erreur est survenue lors du chargement des données."
      );
      toast.error("Erreur", {
        description: "Impossible de charger les sacrements individuels.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSacrements();
  }, []);

  // Fonction pour filtrer les sacrements selon la recherche et l'onglet actif
  useEffect(() => {
    let results = [...sacrements];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (sacrement) =>
          sacrement.soustype.toLowerCase().includes(query) ||
          sacrement.description.toLowerCase().includes(query) ||
          formatDate(sacrement.date).toLowerCase().includes(query) ||
          (sacrement.celebrant &&
            `${sacrement.celebrant.prenoms} ${sacrement.celebrant.nom}`
              .toLowerCase()
              .includes(query))
      );
    }

    // Filtrer par type de sacrement selon l'onglet actif
    if (activeTab !== "tous") {
      results = results.filter(
        (sacrement) =>
          getSacrementSoustypeDetails(sacrement.soustype).category === activeTab
      );
    }

    // Trier par date (les plus récents en premier)
    results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredSacrements(results);
  }, [searchQuery, activeTab, sacrements]);

  // Supprimer un sacrement
  const handleDeleteSacrement = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sacrement_id: id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      await response.json();
      toast.success("Succès", {
        description: "Le sacrement a été supprimé avec succès.",
      });

      // Mettre à jour la liste des sacrements
      fetchSacrements();
    } catch (err: any) {
      console.error("Erreur lors de la suppression du sacrement:", err);
      toast.error("Erreur", {
        description: "Impossible de supprimer le sacrement.",
      });
    }
  };

  // Compter les sacrements par catégorie
  const countSacrements = () => {
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

  const counts = countSacrements();
  const totalSacrements = sacrements.length;

  // Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    // Créer les en-têtes du CSV
    let csvContent = "ID,Type,Date,Description,Célébrant,Statut\n";

    // Ajouter les données
    filteredSacrements.forEach((sacrement) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Gestion des Sacrements Individuels
        </h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Baptêmes</p>
          <p className="text-2xl font-bold">{counts.baptemes}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Première Communion
          </p>
          <p className="text-2xl font-bold">{counts.firstcommunions}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Profession de Foi
          </p>
          <p className="text-2xl font-bold">{counts.professiondefoi}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Sacrement de Malade
          </p>
          <p className="text-2xl font-bold">{counts.sacrementdemalade}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">
            Sacrements Individuels ({totalSacrements})
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
              onClick={exportToCSV}
              title="Exporter en CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <NewSacrementIndividuelForm onSuccess={fetchSacrements} />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="baptemes">Baptêmes</TabsTrigger>
            <TabsTrigger value="firstcommunions">
              Première Communion
            </TabsTrigger>
            <TabsTrigger value="professiondefoi">Profession de Foi</TabsTrigger>
            <TabsTrigger value="sacrementdemalade">
              Sacrement de Malade
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <XCircle className="h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Une erreur est survenue
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
                <Button onClick={() => fetchSacrements()}>Réessayer</Button>
              </div>
            ) : filteredSacrements.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
                <Calendar className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucun sacrement trouvé
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  {searchQuery
                    ? "Aucun sacrement ne correspond à votre recherche."
                    : "Aucun sacrement individuel n'est enregistré pour le moment."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Effacer la recherche
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSacrements.map((sacrement) => (
                  <SacrementIndividuelItem
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
    </div>
  );
}
