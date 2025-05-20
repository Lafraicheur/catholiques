/* eslint-disable @typescript-eslint/no-unused-vars */
// Fichier: EvenementsPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

// Types pour les événements
type EventType = "ACTIVITE" | "COTISATION" | "MESSE" | "INSCRIPTION" | "DON";

type EventStatus = "programmé" | "confirmé" | "terminé" | "annulé";

// Structure correcte de l'API basée sur votre JSON
interface APIEventExtras {
  type_messe?: string;
  heure_de_fin?: number;
  heure_de_debut?: number;
  prix_demande_de_messe?: number;
  [key: string]: any;
}

interface APIEvent {
  id: number;
  created_at: number;
  libelle: string;
  type: EventType;
  solde: number;
  solde_cible: number | null;
  description: string | null;
  date_de_debut: number;
  date_de_fin: number | null;
  solde_est_visibe: boolean | null;
  type_visibilite_solde: string | null;
  est_limite_par_echeance: boolean | null;
  est_actif: boolean | null;
  extras: APIEventExtras;
  diocese_id: number | null;
  paroisse_id: number;
  mouvementassociation_id: number | null;
  ceb_id: number | null;
  image: string | null;
}

interface APIResponse {
  items: APIEvent[];
}

// Formatage de la date
const formatDate = (timestamp: number) => {
  try {
    // Ajuster si le timestamp est en secondes (10 chiffres ou moins)
    const adjustedTimestamp =
      String(timestamp).length <= 10
        ? timestamp * 1000 // En secondes, convertir en ms
        : timestamp; // Déjà en ms

    const date = new Date(adjustedTimestamp);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.warn("Date invalide:", timestamp);
      return "Date invalide";
    }

    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error, timestamp);
    return "Date inconnue";
  }
};

// Format heure
const formatHeure = (timestamp: number | undefined) => {
  if (timestamp === undefined) return "Heure non spécifiée";

  try {
    // Ajuster si le timestamp est en secondes
    const adjustedTimestamp =
      String(timestamp).length <= 10
        ? timestamp * 1000 // En secondes, convertir en ms
        : timestamp; // Déjà en ms

    const date = new Date(adjustedTimestamp);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return "Heure non spécifiée";
    }

    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  } catch (error) {
    console.error("Erreur lors du formatage de l'heure:", error, timestamp);
    return "Heure inconnue";
  }
};

// Formater type d'événement pour Badge
const getEventTypeDetails = (type: EventType) => {
  switch (type) {
    case "MESSE":
      return { label: "Messe", variant: "default" as const };
    case "ACTIVITE":
      return { label: "Activité", variant: "secondary" as const };
    case "COTISATION":
      return { label: "Cotisation", variant: "outline" as const };
    case "INSCRIPTION":
      return { label: "Inscription", variant: "destructive" as const };
    case "DON":
      return { label: "Don", variant: "success" as const };
    default:
      return { label: type, variant: "default" as const };
  }
};

// Obtenir la date sous format ISO à partir d'un timestamp
const getISODateFromTimestamp = (timestamp: number): string => {
  try {
    // Ajuster si le timestamp est en secondes
    const adjustedTimestamp =
      String(timestamp).length <= 10
        ? timestamp * 1000 // En secondes, convertir en ms
        : timestamp; // Déjà en ms

    const date = new Date(adjustedTimestamp);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.warn("Date invalide pour ISO:", timestamp);
      return "";
    }

    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error(
      "Erreur lors de la conversion ISO de la date:",
      error,
      timestamp
    );
    return "";
  }
};

// Déterminer le statut d'un événement
const getEventStatus = (dateDebut: number): EventStatus => {
  try {
    // Ajuster si le timestamp est en secondes
    const timestamp =
      String(dateDebut).length <= 10
        ? dateDebut * 1000 // En secondes, convertir en ms
        : dateDebut; // Déjà en ms

    const now = Date.now();

    if (timestamp < now) {
      return "terminé";
    } else if (timestamp - now < 7 * 24 * 60 * 60 * 1000) {
      // 7 jours
      return "confirmé";
    } else {
      return "programmé";
    }
  } catch (error) {
    console.error("Erreur lors de la détermination du statut:", error);
    return "programmé"; // Valeur par défaut
  }
};

// Formater statut d'événement pour Badge
const getEventStatusDetails = (statut: EventStatus) => {
  switch (statut) {
    case "programmé":
      return { label: "Programmé", variant: "outline" as const };
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "terminé":
      return { label: "Terminé", variant: "secondary" as const };
    case "annulé":
      return { label: "Annulé", variant: "destructive" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Composant 1: Liste des événements
const ListeEvenements = ({
  apiEvents,
  moisActuel,
  anneeActuelle,
  filtreType,
  loading,
}: {
  apiEvents: APIEvent[];
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-2 text-slate-500">
          Chargement des événements...
        </span>
      </div>
    );
  }

  if (!apiEvents || apiEvents.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucun événement trouvé.
      </div>
    );
  }

  // Filtrer et grouper les événements par date
  const groupedEvents: Record<string, APIEvent[]> = {};

  apiEvents.forEach((event) => {
    // Filtrer par type
    if (filtreType !== "tous" && event.type !== filtreType) {
      return;
    }

    try {
      // Ajuster si le timestamp est en secondes
      const timestamp =
        String(event.date_de_debut).length <= 10
          ? event.date_de_debut * 1000
          : event.date_de_debut;

      const date = new Date(timestamp);

      // Filtrer par mois et année
      if (
        date.getMonth() !== moisActuel ||
        date.getFullYear() !== anneeActuelle
      ) {
        return;
      }

      // Créer un identifiant de date pour le regroupement
      const dateKey = date.toISOString().split("T")[0];

      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }

      groupedEvents[dateKey].push(event);
    } catch (error) {
      console.error("Erreur lors du traitement de l'événement:", error, event);
    }
  });

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <h3 className="font-medium text-slate-900 sticky top-0 bg-white py-2 mb-4">
            {formatDate(new Date(dateKey).getTime())}
          </h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            style={{ display: "grid" }}
          >
            {groupedEvents[dateKey].map((event) => {
              const { label: typeLabel, variant: typeVariant } =
                getEventTypeDetails(event.type);
              const statut = getEventStatus(event.date_de_debut);
              const { label: statusLabel, variant: statusVariant } =
                getEventStatusDetails(statut);

              return (
                <div
                  key={event.id}
                  className="border border-slate-200 rounded-md hover:bg-slate-50 p-4"
                  style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-slate-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 line-clamp-2">
                        {event.libelle}
                      </h4>
                      <h4 className="font-medium text-xs text-slate-400 line-clamp-2">
                        {event.extras?.type_messe}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant={typeVariant}>{typeLabel}</Badge>
                    {/* <Badge variant={statusVariant}>{statusLabel}</Badge> */}
                  </div>

                  <p className="text-sm text-slate-500 mb-3">
                    {formatHeure(event.extras?.heure_de_debut)} - {formatHeure(event.extras?.heure_de_fin)}
                  </p>

                  <a
                    href={`/dashboard/paroisse/evenements/${event.id}`}
                    className="block w-full text-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 px-4 py-2"
                  >
                    Détails
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {sortedDates.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Aucun événement prévu pour cette période.
        </div>
      )}
    </div>
  );
};

// Composant 2: Calendrier des événements
const CalendrierEvenements = ({
  apiEvents,
  moisActuel,
  anneeActuelle,
  filtreType,
  loading,
}: {
  apiEvents: APIEvent[];
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-2 text-slate-500">Chargement du calendrier...</span>
      </div>
    );
  }

  // Obtenir le nombre de jours dans le mois
  const nbJoursDansMois = new Date(anneeActuelle, moisActuel + 1, 0).getDate();

  // Obtenir le jour de la semaine du premier jour du mois (0 = dimanche, 1 = lundi, ...)
  const premierJourDuMois = new Date(anneeActuelle, moisActuel, 1).getDay();
  // Ajuster pour que la semaine commence le lundi (0 = lundi, 6 = dimanche)
  const premierJourAjuste = premierJourDuMois === 0 ? 6 : premierJourDuMois - 1;

  // Créer un tableau pour tous les jours du mois
  const jours = [];
  for (let i = 0; i < premierJourAjuste; i++) {
    jours.push(null); // Jours vides avant le début du mois
  }
  for (let i = 1; i <= nbJoursDansMois; i++) {
    jours.push(i);
  }

  // Obtenir les noms des jours de la semaine
  const joursDelaSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {joursDelaSemaine.map((jour, index) => (
          <div
            key={index}
            className="text-center font-medium py-2 text-slate-600"
          >
            {jour}
          </div>
        ))}

        {jours.map((jour, index) => {
          if (jour === null) {
            return (
              <div
                key={`empty-${index}`}
                className="h-24 bg-slate-50 border border-slate-200"
              />
            );
          }

          // Récupérer les événements pour ce jour
          const eventsForDay = apiEvents.filter((event) => {
            // Vérifier d'abord le type
            if (filtreType !== "tous" && event.type !== filtreType) {
              return false;
            }

            try {
              // Ajuster si le timestamp est en secondes
              const timestamp =
                String(event.date_de_debut).length <= 10
                  ? event.date_de_debut * 1000
                  : event.date_de_debut;

              const eventDate = new Date(timestamp);

              return (
                eventDate.getDate() === jour &&
                eventDate.getMonth() === moisActuel &&
                eventDate.getFullYear() === anneeActuelle
              );
            } catch (error) {
              console.error(
                "Erreur lors de la vérification de la date:",
                error,
                event
              );
              return false;
            }
          });

          const isToday =
            new Date().getDate() === jour &&
            new Date().getMonth() === moisActuel &&
            new Date().getFullYear() === anneeActuelle;

          return (
            <div
              key={`day-${jour}`}
              className={`h-24 p-1 border border-slate-200 overflow-y-auto relative ${
                isToday ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div
                className={`text-right p-1 ${
                  isToday
                    ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                    : ""
                }`}
              >
                {jour}
              </div>
              <div className="mt-1 space-y-1">
                {eventsForDay.map((event) => {
                  const { variant: typeVariant } = getEventTypeDetails(
                    event.type
                  );
                  return (
                    <a
                      key={event.id}
                      href={`/dashboard/paroisse/evenements/${event.id}`}
                      className={`block text-xs p-1 truncate rounded-sm hover:bg-slate-100 ${
                        typeVariant === "default"
                          ? "bg-blue-100 text-blue-800"
                          : typeVariant === "secondary"
                            ? "bg-slate-100 text-slate-800"
                            : typeVariant === "outline"
                              ? "bg-gray-100 text-gray-800"
                              : typeVariant === "destructive"
                                ? "bg-red-100 text-red-800"
                                : typeVariant === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {formatHeure(event.extras?.heure_de_debut)} -{formatHeure(event.extras?.heure_de_fin)}{" "}
                      {event.libelle}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Obtenir les types d'événements pour les filtres
const getTypesEvenements = () => {
  return [
    { value: "tous", label: "Tous les types" },
    { value: "MESSE", label: "Messe" },
    { value: "ACTIVITE", label: "Activité" },
    { value: "COTISATION", label: "Cotisation" },
    { value: "INSCRIPTION", label: "Inscription" },
    { value: "DON", label: "Don" },
  ];
};

// Obtenir les mois pour les filtres
const getMois = () => {
  return [
    { value: "0", label: "Janvier" },
    { value: "1", label: "Février" },
    { value: "2", label: "Mars" },
    { value: "3", label: "Avril" },
    { value: "4", label: "Mai" },
    { value: "5", label: "Juin" },
    { value: "6", label: "Juillet" },
    { value: "7", label: "Août" },
    { value: "8", label: "Septembre" },
    { value: "9", label: "Octobre" },
    { value: "10", label: "Novembre" },
    { value: "11", label: "Décembre" },
  ];
};

// Composant principal qui intègre les deux vues
export default function EvenementsPage() {
  // État pour le mois actuel (0-11) et l'année
  const dateCourante = new Date();
  const [moisActuel, setMoisActuel] = useState<number>(dateCourante.getMonth());
  const [anneeActuelle, setAnneeActuelle] = useState<number>(
    dateCourante.getFullYear()
  );
  const [filtreType, setFiltreType] = useState<string>("tous");

  // États pour les données de l'API
  const [apiEvents, setApiEvents] = useState<APIEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ID de la paroisse (à remplacer par la valeur réelle)
  const paroisseId = 1; // À adapter selon votre contexte

  // Charger les événements depuis l'API
  useEffect(() => {
    const fetchEvenements = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new Error("Token d'authentification non trouvé");
        }

        const response = await axios.get(`${API_URL}/evenements/obtenir-tous`, {
          params: { paroisse_id: paroisseId },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        // Vérifier que response.data.items existe et est un tableau
        if (
          response.data &&
          response.data.items &&
          Array.isArray(response.data.items)
        ) {
          setApiEvents(response.data.items);
        } else {
          console.error("Format de réponse inattendu:", response.data);
          setApiEvents([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des événements:", err);
        setError("Une erreur est survenue lors du chargement des événements.");
        toast.error("Impossible de charger les événements");
      } finally {
        setLoading(false);
      }
    };

    fetchEvenements();
  }, [paroisseId]);

  // Années disponibles pour le filtre (5 ans avant et après l'année actuelle)
  const annees = Array.from(
    { length: 11 },
    (_, i) => dateCourante.getFullYear() - 5 + i
  );

  // Changer de mois
  const moisPrecedent = () => {
    if (moisActuel === 0) {
      setMoisActuel(11);
      setAnneeActuelle(anneeActuelle - 1);
    } else {
      setMoisActuel(moisActuel - 1);
    }
  };

  const moisSuivant = () => {
    if (moisActuel === 11) {
      setMoisActuel(0);
      setAnneeActuelle(anneeActuelle + 1);
    } else {
      setMoisActuel(moisActuel + 1);
    }
  };

  // Obtenir le nom du mois actuel
  const nomMoisActuel = new Date(
    anneeActuelle,
    moisActuel,
    1
  ).toLocaleDateString("fr-FR", { month: "long" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Événements
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button className="w-full xs:w-auto" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
          <Button
            variant="link"
            className="ml-2 text-red-700 p-0 h-auto"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      )}

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={moisPrecedent}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {nomMoisActuel} {anneeActuelle}
            </h2>
            <Button variant="outline" size="icon" onClick={moisSuivant}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={String(anneeActuelle)}
              onValueChange={(value) => setAnneeActuelle(Number(value))}
            >
              <SelectTrigger className="w-[100px] sm:w-[120px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {annees.map((annee) => (
                  <SelectItem key={annee} value={String(annee)}>
                    {annee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(moisActuel)}
              onValueChange={(value) => setMoisActuel(Number(value))}
            >
              <SelectTrigger className="w-[140px] sm:w-[160px]">
                <SelectValue placeholder="Mois" />
              </SelectTrigger>
              <SelectContent>
                {getMois().map((mois) => (
                  <SelectItem key={mois.value} value={mois.value}>
                    {mois.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtreType} onValueChange={setFiltreType}>
              <SelectTrigger className="w-[150px] sm:w-[180px]">
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                {getTypesEvenements().map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="liste" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="liste" className="flex items-center">
              <LayoutList className="h-4 w-4 mr-2" /> Liste
            </TabsTrigger>
            <TabsTrigger value="calendrier" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" /> Calendrier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liste">
            <ListeEvenements
              apiEvents={apiEvents}
              moisActuel={moisActuel}
              anneeActuelle={anneeActuelle}
              filtreType={filtreType}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="calendrier">
            <CalendrierEvenements
              apiEvents={apiEvents}
              moisActuel={moisActuel}
              anneeActuelle={anneeActuelle}
              filtreType={filtreType}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
