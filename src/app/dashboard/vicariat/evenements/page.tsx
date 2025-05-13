/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { Plus, Filter, Calendar, ChevronLeft, ChevronRight, Search, Download, Clock, MapPin, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Événements Vicariat | Dashboard Église Catholique",
};

// Données fictives pour les événements
const evenements = [
  {
    id: 1,
    titre: "Rencontre des responsables pastoraux",
    date: "2025-05-22",
    heure: "09:30",
    duree: "03h00",
    lieu: "Centre pastoral du vicariat",
    description: "Rencontre biannuelle des responsables pastoraux du vicariat pour faire le point sur les actions en cours et préparer l'année pastorale.",
    type: "reunion",
    statut: "confirmé",
    organisateur: "Père Michel Lefevre",
    participants: ["Curés", "Équipes d'animation pastorale", "Responsables de services"],
    nombreInscrits: 42,
    capaciteMax: 50
  },
  {
    id: 2,
    titre: "Formation des catéchistes",
    date: "2025-06-05",
    heure: "14:00",
    duree: "03h30",
    lieu: "Maison vicariale",
    description: "Formation à destination des catéchistes du vicariat sur le thème 'Accompagner les enfants dans leur découverte de la foi'.",
    type: "formation",
    statut: "programmé",
    organisateur: "Service de la catéchèse",
    participants: ["Catéchistes", "Responsables catéchèse"],
    nombreInscrits: 28,
    capaciteMax: 40
  },
  {
    id: 3,
    titre: "Pèlerinage vicarial",
    date: "2025-07-12",
    heure: "08:30",
    duree: "2 jours",
    lieu: "Sanctuaire Notre-Dame",
    description: "Pèlerinage annuel du vicariat au sanctuaire Notre-Dame. Programme: visites guidées, veillée de prière, messe dominicale, temps d'échange.",
    type: "pelerinage",
    statut: "en préparation",
    organisateur: "Équipe pastorale vicariale",
    participants: ["Ouverts à tous"],
    nombreInscrits: 95,
    capaciteMax: 200
  },
  {
    id: 4,
    titre: "Retraite des confirmands",
    date: "2025-06-21",
    heure: "09:00",
    duree: "2 jours",
    lieu: "Centre spirituel Saint-Ignace",
    description: "Retraite de préparation à la confirmation pour les jeunes du vicariat.",
    type: "retraite",
    statut: "programmé",
    organisateur: "Service des jeunes",
    participants: ["Confirmands", "Accompagnateurs"],
    nombreInscrits: 52,
    capaciteMax: 60
  },
  {
    id: 5,
    titre: "Messe du Vicariat",
    date: "2025-06-29",
    heure: "10:30",
    duree: "01h30",
    lieu: "Église Notre-Dame",
    description: "Messe solennelle présidée par le vicaire épiscopal, rassemblant les fidèles de tout le vicariat.",
    type: "celebration",
    statut: "confirmé",
    organisateur: "Père Michel Lefevre",
    participants: ["Ouverts à tous"],
    nombreInscrits: 0,
    capaciteMax: 500
  },
  {
    id: 6,
    titre: "Formation liturgique pour les servants d'autel",
    date: "2025-07-05",
    heure: "14:30",
    duree: "02h30",
    lieu: "Paroisse Saint-Joseph",
    description: "Formation destinée aux servants d'autel du vicariat, pour approfondir leur connaissance de la liturgie et améliorer leur service.",
    type: "formation",
    statut: "programmé",
    organisateur: "Service liturgique",
    participants: ["Servants d'autel", "Responsables liturgie"],
    nombreInscrits: 18,
    capaciteMax: 30
  },
  {
    id: 7,
    titre: "Rencontre œcuménique",
    date: "2025-07-18",
    heure: "18:30",
    duree: "02h00",
    lieu: "Centre pastoral du vicariat",
    description: "Rencontre avec les représentants des autres confessions chrétiennes présentes sur le territoire du vicariat.",
    type: "reunion",
    statut: "en préparation",
    organisateur: "Commission œcuménisme",
    participants: ["Commission œcuménisme", "Représentants des autres Églises"],
    nombreInscrits: 12,
    capaciteMax: 20
  }
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
const getEventTypeDetails = (type: string) => {
  switch (type) {
    case "reunion":
      return { label: "Réunion", variant: "outline" as const };
    case "formation":
      return { label: "Formation", variant: "secondary" as const };
    case "pelerinage":
      return { label: "Pèlerinage", variant: "default" as const };
    case "retraite":
      return { label: "Retraite", variant: "destructive" as const };
    case "celebration":
      return { label: "Célébration", variant: "success" as const };
    default:
      return { label: type, variant: "default" as const };
  }
};

// Formater statut d'événement pour Badge
const getEventStatusDetails = (statut: string) => {
  switch (statut) {
    case "programmé":
      return { label: "Programmé", variant: "outline" as const };
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "en préparation":
      return { label: "En préparation", variant: "secondary" as const };
    case "terminé":
      return { label: "Terminé", variant: "default" as const };
    case "annulé":
      return { label: "Annulé", variant: "destructive" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Fonction pour obtenir les mois en français
const getMois = () => {
  return [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
};

export default function EvenementsPage() {
  // Supposons que nous sommes en mai 2025
  const moisActuel = 4; // Mai (0-indexed)
  const anneeActuelle = 2025;
  
  // Filtrer les événements pour le mois actuel
  const evenementsMoisActuel = evenements.filter(event => {
    const date = new Date(event.date);
    return date.getMonth() === moisActuel && date.getFullYear() === anneeActuelle;
  });

  // Trier les événements par date
  const evenementsTries = [...evenementsMoisActuel].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Grouper les événements par date
  const evenementsGroupes = evenementsTries.reduce<Record<string, typeof evenements>>((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  const dates = Object.keys(evenementsGroupes).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Événements du Vicariat</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Vue Calendrier
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouvel événement
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">Mai 2025</h2>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <h3 className="font-medium text-slate-900 mb-1">Événements ce mois</h3>
              <p className="text-2xl font-bold">{evenementsMoisActuel.length}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <h3 className="font-medium text-slate-900 mb-1">Participants attendus</h3>
              <p className="text-2xl font-bold">{evenementsMoisActuel.reduce((sum, event) => sum + event.nombreInscrits, 0)}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber-500">
              <h3 className="font-medium text-slate-900 mb-1">Types d'événements</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {Array.from(new Set(evenementsMoisActuel.map(e => e.type))).map((type, index) => {
                  const { label, variant } = getEventTypeDetails(type);
                  return (
                    <Badge key={index} variant={variant}>
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {dates.length > 0 ? (
            dates.map((date) => (
              <div key={date} className="space-y-3">
                <h3 className="font-medium text-slate-900 bg-white py-2 sticky top-0 z-10">
                  {formatDate(date)}
                </h3>
                <div className="space-y-3">
                  {evenementsGroupes[date].map((event) => {
                    const { label: typeLabel, variant: typeVariant } = getEventTypeDetails(event.type);
                    const { label: statusLabel, variant: statusVariant } = getEventStatusDetails(event.statut);

                    return (
                      <div 
                        key={event.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-md hover:bg-slate-50"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 md:mb-0">
                          <div className="md:w-16 md:h-16 w-12 h-12 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-slate-700" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{event.titre}</h4>
                            <div className="flex items-center flex-wrap gap-2 mt-1">
                              <Badge variant={typeVariant}>{typeLabel}</Badge>
                              <Badge variant={statusVariant}>{statusLabel}</Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 mt-1 gap-2 sm:gap-4">
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {event.heure} ({event.duree})
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {event.lieu}
                              </div>
                              <div className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-1" />
                                {event.organisateur}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="flex flex-col items-center sm:items-end">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-slate-400" />
                              <span className="text-sm font-medium">{event.nombreInscrits}/{event.capaciteMax}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${Math.min(100, (event.nombreInscrits / event.capaciteMax) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <a 
                            href={`/dashboard/vicariat/evenements/${event.id}`}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-4 py-2"
                          >
                            Détails
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              Aucun événement pour ce mois.
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-8">
          <h3 className="w-full text-sm font-medium text-slate-500 mb-2">Navigation par mois</h3>
          {getMois().map((mois, index) => (
            <Button 
              key={index} 
              variant={index === moisActuel ? "default" : "outline"} 
              size="sm"
              className="min-w-20"
            >
              {mois}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}