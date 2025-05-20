// Fichier: composants/EventComponents.tsx
// Contient les sous-composants Liste et Calendrier
import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Evenement, formatDate, getEventTypeDetails, getEventStatusDetails } from "../types";
import {
  Evenement,
  formatDate,
  getEventStatusDetails,
  getEventTypeDetails,
} from "@/services/types";

// Composant 1: Liste des événements
export const ListeEvenements = ({
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
  const groupedEvents = evenementsFiltres.reduce<Record<string, Evenement[]>>(
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
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="font-medium text-slate-900 sticky top-0 bg-white py-2 mb-4">
            {formatDate(date)}
          </h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            style={{ display: "grid" }}
          >
            {groupedEvents[date].map((event) => {
              const { label: typeLabel, variant: typeVariant } =
                getEventTypeDetails(event.type);
              const { label: statusLabel, variant: statusVariant } =
                getEventStatusDetails(event.statut);

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
export const CalendrierEvenements = ({
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
