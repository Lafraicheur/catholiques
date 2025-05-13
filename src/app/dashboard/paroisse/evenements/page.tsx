import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import {
  Plus,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Événements | Dashboard Église Catholique",
};

// Données fictives pour les événements
const evenements = [
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
    titre: "Catéchisme - Groupe enfants",
    date: "2025-05-17",
    heure: "14:00",
    lieu: "Salle paroissiale",
    description: "Séance de catéchisme pour les enfants de 8-10 ans",
    type: "formation",
    statut: "programmé",
    responsable: "Marie Martin",
  },
  {
    id: 3,
    titre: "Conseil pastoral",
    date: "2025-05-16",
    heure: "18:30",
    lieu: "Bureau du curé",
    description: "Réunion mensuelle du conseil pastoral",
    type: "reunion",
    statut: "programmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 4,
    titre: "Baptême - Marie Durand",
    date: "2025-05-19",
    heure: "11:00",
    lieu: "Église principale",
    description: "Baptême de Marie Durand",
    type: "sacrement",
    statut: "confirmé",
    responsable: "Père Jean Dupont",
  },
  {
    id: 5,
    titre: "Groupe de prière",
    date: "2025-05-15",
    heure: "19:00",
    lieu: "Chapelle",
    description: "Rencontre hebdomadaire du groupe de prière",
    type: "priere",
    statut: "terminé",
    responsable: "Sophie Petit",
  },
  {
    id: 6,
    titre: "Préparation au mariage",
    date: "2025-05-20",
    heure: "19:30",
    lieu: "Salle paroissiale",
    description: "Session 2 de la préparation au mariage",
    type: "formation",
    statut: "programmé",
    responsable: "Père Michel Bernard",
  },
  {
    id: 7,
    titre: "Répétition de la chorale",
    date: "2025-05-16",
    heure: "20:00",
    lieu: "Église principale",
    description: "Répétition des chants pour la messe dominicale",
    type: "preparation",
    statut: "programmé",
    responsable: "Lucie Dubois",
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
const getEventTypeDetails = (type: string) => {
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
const getEventStatusDetails = (statut: string) => {
  switch (statut) {
    case "programmé":
      return { label: "Programmé", variant: "outline" as const };
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "terminé":
      return { label: "Terminé", variant: "secondary" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

export default function EvenementsPage() {
  // Grouper les événements par date
  const groupedEvents = evenements.reduce<Record<string, typeof evenements>>(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Événements
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full xs:w-auto" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Vue Calendrier
          </Button>
          <Button className="w-full xs:w-auto" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              <h3 className="font-medium text-slate-900 sticky top-0 bg-white py-2">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {groupedEvents[date].map((event) => {
                  const { label: typeLabel, variant: typeVariant } =
                    getEventTypeDetails(event.type);
                  const { label: statusLabel, variant: statusVariant } =
                    getEventStatusDetails(event.statut);

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
                          <h4 className="font-medium text-slate-900">
                            {event.titre}
                          </h4>
                          <div className="flex items-center flex-wrap gap-2 mt-1">
                            <Badge variant={typeVariant}>{typeLabel}</Badge>
                            <Badge variant={statusVariant}>{statusLabel}</Badge>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            {event.heure} - {event.lieu}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={`/dashboard/paroisse/evenements/${event.id}`}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
                        >
                          Détails
                        </a>
                      </div>
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
      </Card>
    </div>
  );
}
