/* eslint-disable @typescript-eslint/no-unused-vars */
// Fichier: EvenementsPage.tsx
"use client";
import React, { useState } from "react";
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

// Types pour les événements
type EventType =
  | "messe"
  | "formation"
  | "reunion"
  | "sacrement"
  | "priere"
  | "preparation";
type EventStatus = "programmé" | "confirmé" | "terminé" | "annulé";

interface Evenement {
  id: number;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  description: string;
  type: EventType;
  statut: EventStatus;
  responsable: string;
}

// Créer un exemple d'événements couvrant plusieurs années
const evenements: Evenement[] = [
  {
    id: 1,
    titre: "Messe dominicale",
    date: "2025-05-18",
    heure: "10:30",
    lieu: "Église principale",
    description: "Messe du 6ème dimanche de Pâques",
    type: "messe",
    statut: "programmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 2,
    titre: "Catéchisme",
    date: "2025-05-21",
    heure: "16:00",
    lieu: "Salle paroissiale",
    description: "Préparation à la première communion",
    type: "formation",
    statut: "confirmé",
    responsable: "Sœur Marie",
  },
  {
    id: 3,
    titre: "Adoration eucharistique",
    date: "2025-05-22",
    heure: "19:00",
    lieu: "Chapelle",
    description: "Temps d'adoration et prière personnelle",
    type: "priere",
    statut: "programmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 4,
    titre: "Baptême",
    date: "2025-05-25",
    heure: "14:00",
    lieu: "Église principale",
    description: "Baptême de Léo Martin",
    type: "sacrement",
    statut: "confirmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 5,
    titre: "Réunion du conseil pastoral",
    date: "2025-05-27",
    heure: "18:30",
    lieu: "Bureau paroissial",
    description: "Planification des activités d'été",
    type: "reunion",
    statut: "programmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 6,
    titre: "Fête patronale",
    date: "2024-08-15",
    heure: "10:00",
    lieu: "Église principale et parvis",
    description: "Célébration de l'Assomption et fête paroissiale",
    type: "messe",
    statut: "confirmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 7,
    titre: "Première communion",
    date: "2024-06-09",
    heure: "10:30",
    lieu: "Église principale",
    description: "Célébration des premières communions",
    type: "sacrement",
    statut: "confirmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 8,
    titre: "Messe de Noël",
    date: "2024-12-25",
    heure: "00:00",
    lieu: "Église principale",
    description: "Messe de la Nativité",
    type: "messe",
    statut: "programmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 9,
    titre: "Pèlerinage diocésain",
    date: "2026-07-12",
    heure: "07:00",
    lieu: "Départ de l'église",
    description: "Pèlerinage à Lourdes",
    type: "priere",
    statut: "programmé",
    responsable: "Diacre Pierre Martin",
  },
  {
    id: 10,
    titre: "Confirmation",
    date: "2026-05-30",
    heure: "15:00",
    lieu: "Cathédrale",
    description: "Confirmation des jeunes de la paroisse",
    type: "sacrement",
    statut: "programmé",
    responsable: "Évêque diocésain",
  },
    {
    id: 11,
    titre: "Première communion",
    date: "2025-05-18",
    heure: "10:30",
    lieu: "Église principale",
    description: "Célébration des premières communions",
    type: "sacrement",
    statut: "confirmé",
    responsable: "Père Jean Dupont",
  },
];

// Formatage de la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Formater type d'événement pour Badge
const getEventTypeDetails = (type: EventType) => {
  switch (type) {
    case "messe":
      return { label: "Messe", variant: "default" as const };
    case "formation":
      return { label: "Formation", variant: "secondary" as const };
    case "reunion":
      return { label: "Réunion", variant: "outline" as const };
    case "sacrement":
      return { label: "Sacrement", variant: "destructive" as const };
    case "priere":
      return { label: "Prière", variant: "success" as const };
    case "preparation":
      return { label: "Préparation", variant: "secondary" as const };
    default:
      return { label: type, variant: "default" as const };
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
  evenements,
  moisActuel,
  anneeActuelle,
  filtreType,
}: {
  evenements: Evenement[];
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;
}) => {
  // Filtrer les événements par mois, année et type
  const evenementsFiltres = evenements.filter((event) => {
    const eventDate = new Date(event.date);
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();

    const matchDate = eventMonth === moisActuel && eventYear === anneeActuelle;
    const matchType = filtreType === "tous" || event.type === filtreType;

    return matchDate && matchType;
  });

  // Grouper les événements par date
  const groupedEvents = evenementsFiltres.reduce<
    Record<string, typeof evenements>
  >((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="font-medium text-slate-900 sticky top-0 bg-white py-2 mb-4">
            {formatDate(date)}
          </h3>
          {/* Utilisation d'une grille explicite avec des breakpoints clairs */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            style={{ display: "grid" }}
          >
            {groupedEvents[date].map((event) => {
              const { label: typeLabel, variant: typeVariant } =
                getEventTypeDetails(event.type as EventType);
              const { label: statusLabel, variant: statusVariant } =
                getEventStatusDetails(event.statut as EventStatus);

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
                        {event.titre}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant={typeVariant}>{typeLabel}</Badge>
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </div>

                  <p className="text-sm text-slate-500 mb-3">
                    {event.heure} - {event.lieu}
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
          Aucun événement prévu.
        </div>
      )}
    </div>
  );
};

// Composant 2: Calendrier des événements
const CalendrierEvenements = ({
  evenements,
  moisActuel,
  anneeActuelle,
  filtreType,
}: {
  evenements: Evenement[];
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;
}) => {
  // Filtrer les événements par mois et type
  const evenementsFiltres = evenements.filter((event) => {
    const eventDate = new Date(event.date);
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();

    const matchDate = eventMonth === moisActuel && eventYear === anneeActuelle;
    const matchType = filtreType === "tous" || event.type === filtreType;

    return matchDate && matchType;
  });

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

  // Obtenir le nom du mois actuel
  const nomMois = new Date(anneeActuelle, moisActuel, 1).toLocaleDateString(
    "fr-FR",
    { month: "long" }
  );

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

          // Formater la date au format YYYY-MM-DD pour la comparaison
          const jourFormatte = `${anneeActuelle}-${String(moisActuel + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;

          // Trouver les événements pour ce jour
          const eventsForDay = evenementsFiltres.filter(
            (event) => event.date === jourFormatte
          );

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
                    event.type as EventType
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
                      {event.heure} - {event.titre}
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
    { value: "messe", label: "Messe" },
    { value: "formation", label: "Formation" },
    { value: "reunion", label: "Réunion" },
    { value: "sacrement", label: "Sacrement" },
    { value: "priere", label: "Prière" },
    { value: "preparation", label: "Préparation" },
  ];
};

// Obtenir les mois pour les filtres
const getMois = () => {
  return [
    { value: 0, label: "Janvier" },
    { value: 1, label: "Février" },
    { value: 2, label: "Mars" },
    { value: 3, label: "Avril" },
    { value: 4, label: "Mai" },
    { value: 5, label: "Juin" },
    { value: 6, label: "Juillet" },
    { value: 7, label: "Août" },
    { value: 8, label: "Septembre" },
    { value: 9, label: "Octobre" },
    { value: 10, label: "Novembre" },
    { value: 11, label: "Décembre" },
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
                  <SelectItem key={mois.value} value={String(mois.value)}>
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
              evenements={evenements}
              moisActuel={moisActuel}
              anneeActuelle={anneeActuelle}
              filtreType={filtreType}
            />
          </TabsContent>

          <TabsContent value="calendrier">
            <CalendrierEvenements
              evenements={evenements}
              moisActuel={moisActuel}
              anneeActuelle={anneeActuelle}
              filtreType={filtreType}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
