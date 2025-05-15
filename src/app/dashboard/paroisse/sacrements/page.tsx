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
import NewSacrementForm from "@/components/forms/NewSacrementForm";

// Types pour les sacrements
interface Sacrement {
  id: number;
  created_at: string;
  type: string;
  date: string;
  description: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  certificateur_id: number | null;
  // Nous ajoutons des champs supplémentaires qui pourraient être retournés
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

// Extraire le statut à partir de la description ou de la date
const extractStatut = (sacrement: Sacrement) => {
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

// Formater type de sacrement pour Badge
// Mise à jour de la fonction pour obtenir les détails du type de sacrement
const getSacrementTypeDetails = (type: string) => {
  const typeLC = type.toLowerCase();

  // Sacrements individuels
  if (typeLC.includes("baptême") || typeLC === "bapteme") {
    return {
      label: "Baptême",
      variant: "default" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "baptemes",
      isUnion: false,
    };
  } else if (typeLC.includes("communion")) {
    return {
      label: "Communion",
      variant: "success" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "communions",
      isUnion: false,
    };
  } else if (typeLC.includes("confirmation")) {
    return {
      label: "Confirmation",
      variant: "secondary" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "confirmations",
      isUnion: false,
    };
  }
  // Sacrements d'union
  else if (typeLC.includes("mariage")) {
    return {
      label: "Mariage",
      variant: "destructive" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "mariages",
      isUnion: true,
    };
  } else if (typeLC.includes("onction") || typeLC.includes("malade")) {
    return {
      label: "Onction des malades",
      variant: "outline" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "onctions",
      isUnion: false,
    };
  } else {
    return {
      label: type,
      variant: "default" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
      category: "autres",
      isUnion: false,
    };
  }
};

// Fonction pour extraire les noms des personnes concernées
const extractPersonnes = (sacrement: Sacrement) => {
  // Pour les sacrements d'union (comme le mariage)
  if (getSacrementTypeDetails(sacrement.type).isUnion) {
    // Rechercher un modèle comme "Mariage de X et Y" ou "X & Y" dans la description
    const unionMatch = sacrement.description.match(
      /(?:mariage|union)(?:\s+de)?\s+([^&]+)\s+(?:et|&)\s+([^.,;]+)/i
    );
    if (unionMatch) {
      return {
        primary: unionMatch[1].trim(),
        secondary: unionMatch[2].trim(),
        display: `${unionMatch[1].trim()} & ${unionMatch[2].trim()}`,
      };
    }

    // Si aucun match, retourner un placeholder
    return {
      primary: "Couple",
      secondary: "",
      display: "Couple",
    };
  }
  // Pour les sacrements individuels
  else {
    // Chercher un nom dans la description
    const personneMatch = sacrement.description.match(
      /(?:pour|de|à)\s+([^.,;]+)/i
    );
    if (personneMatch) {
      return {
        primary: personneMatch[1].trim(),
        secondary: "",
        display: personneMatch[1].trim(),
      };
    }

    // Si aucun match, retourner un placeholder selon le type
    const typeInfo = getSacrementTypeDetails(sacrement.type);
    return {
      primary: `Participant(e)`,
      secondary: "",
      display: `Participant(e)`,
    };
  }
};

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

// Composant SacrementItem mis à jour
const SacrementItem = ({ sacrement }: { sacrement: Sacrement }) => {
  const {
    label: typeLabel,
    variant: typeVariant,
    icon: typeIcon,
    isUnion,
  } = getSacrementTypeDetails(sacrement.type);

  const statut = extractStatut(sacrement);
  const { label: statusLabel, variant: statusVariant } =
    getStatusDetails(statut);
  const personnes = extractPersonnes(sacrement);

  return (
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
        <p className="text-2xs text-slate-600 line-clamp-2 mb-3">
          {sacrement.description.substring(0, 80)}
          {sacrement.description.length > 80 ? "..." : ""}
        </p>
      </div>

      {/* Pied de carte */}
      <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center">
        <div className="text-xs text-slate-500 flex items-center">
          <User className="h-3 w-3 mr-1" />
          Célébrant: {sacrement.celebrant_id}
        </div>
        <Button
          variant="default"
          size="sm"
          className="h-7 text-xs px-2.5"
          asChild
        >
          <a href={`/dashboard/paroisse/sacrements/${sacrement.id}`}>Détails</a>
        </Button>
      </div>
    </div>
  );
};

export default function SacrementsPage() {
  const router = useRouter();
  const [sacrements, setSacrements] = useState<Sacrement[]>([]);
  const [filteredSacrements, setFilteredSacrements] = useState<Sacrement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tous");

  // Récupérer les sacrements depuis l'API
  useEffect(() => {
    const fetchSacrements = async () => {
      setLoading(true);
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new Error("Token d'authentification non trouvé");
        }

        // Appel à l'API
        const response = await fetch(
          "https://api.cathoconnect.ci/api:HzF8fFua/sacrement",
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
        setSacrements(data);
        setFilteredSacrements(data);
      } catch (err) {
        console.error("Erreur lors du chargement des sacrements:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données."
        );
        toast.error("Erreur", {
          description: "Impossible de charger les sacrements.",
        });
      } finally {
        setLoading(false);
      }
    };

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
          sacrement.type.toLowerCase().includes(query) ||
          sacrement.description.toLowerCase().includes(query) ||
          formatDate(sacrement.date).toLowerCase().includes(query)
      );
    }

    // Filtrer par type de sacrement selon l'onglet actif
    if (activeTab !== "tous") {
      results = results.filter(
        (sacrement) =>
          getSacrementTypeDetails(sacrement.type).category === activeTab
      );
    }

    // Trier par date
    results.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setFilteredSacrements(results);
  }, [searchQuery, activeTab, sacrements]);

  // Compter les sacrements à venir par catégorie
  const countFutureSacrements = () => {
    const now = new Date();

    const counts = {
      baptemes: 0,
      communions: 0,
      confirmations: 0,
      mariages: 0,
      onctions: 0,
      autres: 0,
    };

    sacrements.forEach((sacrement) => {
      if (new Date(sacrement.date) >= now) {
        const category = getSacrementTypeDetails(sacrement.type).category;
        counts[category]++;
      }
    });

    return counts;
  };

  const counts = countFutureSacrements();
  const totalSacrements = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Gestion des Sacrements
        </h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <p className="text-sm font-medium text-slate-500">Communions</p>
          <p className="text-2xl font-bold">{counts.communions}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Confirmations</p>
          <p className="text-2xl font-bold">{counts.confirmations}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Mariages</p>
          <p className="text-2xl font-bold">{counts.mariages}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Onctions</p>
          <p className="text-2xl font-bold">{counts.onctions}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">
            Sacrements à venir ({totalSacrements})
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <NewSacrementForm />
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
            <TabsTrigger value="communions">Communions</TabsTrigger>
            <TabsTrigger value="confirmations">Confirmations</TabsTrigger>
            <TabsTrigger value="mariages">Mariages</TabsTrigger>
            <TabsTrigger value="onctions">Onctions</TabsTrigger>
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
                <Button onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
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
                    : "Aucun sacrement n'est prévu pour le moment."}
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
                  <SacrementItem key={sacrement.id} sacrement={sacrement} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
