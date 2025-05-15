/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Edit, Trash, Calendar, Heart, 
  FileText, User, Loader2, XCircle, 
  MapPin, Clock, Mail, Phone 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SacrementDetailPageProps {
  params: {
    id: string;
  };
}

// Interface pour les données du sacrement
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
}

// Formatage de la date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "Date inconnue";
  }
};

// Extraction de l'heure depuis la description
const extractHeure = (description: string) => {
  const heureMatch = description.match(/\b(\d{1,2})[hH:](\d{2})?\b/);
  if (heureMatch) {
    const heure = heureMatch[1].padStart(2, '0');
    const minutes = heureMatch[2] ? heureMatch[2] : "00";
    return `${heure}:${minutes}`;
  }
  return "Heure non précisée";
};

// Extraction du lieu depuis la description
const extractLieu = (description: string) => {
  const lieuMatch = description.match(/(?:à|au|dans|en|église|chapelle|cathédrale)\s+([^.,;]+)/i);
  if (lieuMatch) {
    return lieuMatch[1].trim();
  }
  return "Lieu non précisé";
};

// Extraction des personnes concernées par le sacrement
const extractPersonnes = (description: string, type: string) => {
  const typeLC = type.toLowerCase();
  
  // Pour les sacrements d'union (comme le mariage)
  if (typeLC.includes("mariage")) {
    // Rechercher un modèle comme "Mariage de X et Y" ou "X & Y" dans la description
    const unionMatch = description.match(/(?:mariage|union)(?:\s+de)?\s+([^&]+)\s+(?:et|&)\s+([^.,;]+)/i);
    if (unionMatch) {
      return {
        primary: unionMatch[1].trim(),
        secondary: unionMatch[2].trim(),
        display: `${unionMatch[1].trim()} & ${unionMatch[2].trim()}`,
        isCouple: true
      };
    }
    
    // Si aucun match, retourner un placeholder
    return {
      primary: "Premier époux",
      secondary: "Second époux",
      display: "Couple",
      isCouple: true
    };
  } 
  // Pour les sacrements individuels
  else {
    // Chercher un nom dans la description
    const personneMatch = description.match(/(?:pour|de|à)\s+([^.,;]+)/i);
    if (personneMatch) {
      return {
        primary: personneMatch[1].trim(),
        secondary: "",
        display: personneMatch[1].trim(),
        isCouple: false
      };
    }
    
    // Si aucun match, retourner un placeholder selon le type
    return {
      primary: `Participant(e)`,
      secondary: "",
      display: `Participant(e)`,
      isCouple: false
    };
  }
};

// Extraire le statut à partir de la date
const extractStatut = (date: string) => {
  const dateObj = new Date(date);
  const now = new Date();
  
  if (dateObj < now) return "terminé";
  if (dateObj.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) return "confirmé";
  if (dateObj.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) return "en préparation";
  return "demande reçue";
};

// Formater type de sacrement pour Badge
const getSacrementTypeDetails = (type: string) => {
  const typeLC = type.toLowerCase();
  
  if (typeLC.includes("baptême") || typeLC === "bapteme") {
    return { 
      label: "Baptême", 
      variant: "default" as const, 
      icon: <Heart className="h-4 w-4 mr-1" />,
      isUnion: false
    };
  } else if (typeLC.includes("communion")) {
    return { 
      label: "Communion", 
      variant: "success" as const, 
      icon: <Heart className="h-4 w-4 mr-1" />,
      isUnion: false
    };
  } else if (typeLC.includes("confirmation")) {
    return { 
      label: "Confirmation", 
      variant: "secondary" as const, 
      icon: <Heart className="h-4 w-4 mr-1" />,
      isUnion: false
    };
  } else if (typeLC.includes("mariage")) {
    return { 
      label: "Mariage", 
      variant: "destructive" as const, 
      icon: <Heart className="h-4 w-4 mr-1" />,
      isUnion: true
    };
  } else if (typeLC.includes("onction") || typeLC.includes("malade")) {
    return { 
      label: "Onction des malades", 
      variant: "outline" as const, 
      icon: <Heart className="h-4 w-4 mr-1" />,
      isUnion: false
    };
  } else {
    return { 
      label: type, 
      variant: "default" as const, 
      icon: <Heart className="h-4 w-4 mr-1" />,
      isUnion: false
    };
  }
};

// Formater statut pour Badge
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

export default function SacrementDetailPage({ params }: SacrementDetailPageProps) {
  const router = useRouter();
  const [sacrement, setSacrement] = useState<Sacrement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSacrement = async () => {
      setLoading(true);
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("auth_token");
        
        if (!token) {
          throw new Error("Token d'authentification non trouvé");
        }
        
        // Appel à l'API
        const response = await fetch(
          `https://api.cathoconnect.ci/api:HzF8fFua/sacrement/${params.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Sacrement non trouvé");
          } else {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
        }
        
        const data = await response.json();
        setSacrement(data);
      } catch (err) {
        console.error("Erreur lors du chargement du sacrement:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des données.");
        toast.error("Erreur", {
          description: "Impossible de charger les détails du sacrement.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSacrement();
  }, [params.id]);

  // Affichage du chargement
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-slate-300 mb-4" />
        <p className="text-slate-500">Chargement du sacrement...</p>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error || !sacrement) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Sacrement non trouvé</h1>
        <p className="text-slate-600 mb-6">{error || "Le sacrement que vous recherchez n'existe pas."}</p>
        <Link href="/dashboard/paroisse/sacrements" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  // Extraction des données supplémentaires à partir de la description
  const heure = extractHeure(sacrement.description);
  const lieu = extractLieu(sacrement.description);
  const personnes = extractPersonnes(sacrement.description, sacrement.type);
  const statut = extractStatut(sacrement.date);

  const { label: typeLabel, variant: typeVariant, icon: typeIcon, isUnion } = getSacrementTypeDetails(sacrement.type);
  const { label: statusLabel, variant: statusVariant } = getStatusDetails(statut);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/paroisse/sacrements" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {isUnion ? `${typeLabel} : ${personnes.display}` : `${typeLabel} : ${personnes.display}`}
          </h1>
          <Badge variant={typeVariant} className="flex items-center">
            {typeIcon} {typeLabel}
          </Badge>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Date</p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {formatDate(sacrement.date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Horaire</p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    {heure}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Lieu</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {lieu}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">ID Célébrant</p>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.celebrant_id}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Paroisse ID</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.paroisse_id}
                  </p>
                </div>
                {sacrement.chapelle_id && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Chapelle ID</p>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                      {sacrement.chapelle_id}
                    </p>
                  </div>
                )}
                {sacrement.certificateur_id && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Certificateur ID</p>
                    <p className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      {sacrement.certificateur_id}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informations sur les personnes concernées - diffère selon le type de sacrement */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isUnion ? "Informations sur les époux" : "Informations sur la personne"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isUnion ? (
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-md">
                    <h3 className="font-medium text-slate-900 mb-2">Premier époux</h3>
                    <p className="text-slate-700">{personnes.primary}</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-md">
                    <h3 className="font-medium text-slate-900 mb-2">Second époux</h3>
                    <p className="text-slate-700">{personnes.secondary}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-slate-200 rounded-md">
                  <h3 className="font-medium text-slate-900 mb-2">Personne concernée</h3>
                  <p className="text-slate-700">{personnes.display}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">{sacrement.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Créer un certificat
                </Button>
                <Button className="w-full justify-start" variant="destructive">
                  <Trash className="mr-2 h-4 w-4" /> Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations additionnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-md">
                  <p className="text-sm font-medium text-slate-700">ID du sacrement</p>
                  <p className="text-slate-900">{sacrement.id}</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-md">
                  <p className="text-sm font-medium text-slate-700">Date de création</p>
                  <p className="text-slate-900">{sacrement.created_at === "now" ? "Récemment" : formatDate(sacrement.created_at)}</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-md">
                  <p className="text-sm font-medium text-slate-700">Statut</p>
                  <Badge variant={statusVariant} className="mt-1">
                    {statusLabel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Type de sacrement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-slate-50 rounded-md">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                    {typeIcon}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{typeLabel}</h3>
                    <p className="text-xs text-slate-500">
                      {isUnion ? "Sacrement d'union" : "Sacrement individuel"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  {isUnion 
                    ? "Ce sacrement concerne l'union de deux personnes." 
                    : "Ce sacrement concerne une personne individuelle."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}