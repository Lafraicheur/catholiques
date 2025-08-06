import { useState, useEffect } from "react";
import EventCard, { APIEvent } from "./EventCard";

interface DatePickerProps {
  // Données
  events: APIEvent[];
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;

  // Sélection multiple
  selectedDates: number[];
  onDatesChange: (dates: number[]) => void;

  // Configuration
  loading?: boolean;
  className?: string;
  allowPastDates?: boolean; // Nouvelle prop pour contrôler la sélection des dates passées

  // Callbacks
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: APIEvent) => void;
}

interface CalendarDay {
  date: number | null;
  timestamp: number;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean; // Nouvelle propriété pour identifier les dates passées
  isSelectable: boolean; // Nouvelle propriété pour savoir si la date est sélectionnable
  events: APIEvent[];
}

// Utilitaires pour le calendrier
const normalizeTimestamp = (timestamp: number): number => {
  return String(timestamp).length <= 10 ? timestamp * 1000 : timestamp;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isPastOrToday = (date: Date, today: Date): boolean => {
  // Réinitialiser les heures pour comparer uniquement les dates
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return dateOnly <= todayOnly;
};

const filterEventsForDay = (
  events: APIEvent[],
  targetDate: Date,
  filtreType: string
): APIEvent[] => {
  return events.filter((event) => {
    // Filtrer par type
    if (filtreType !== "tous" && event.type !== filtreType) {
      return false;
    }

    try {
      const timestamp = normalizeTimestamp(event.date_de_debut);
      const eventDate = new Date(timestamp);
      return isSameDay(eventDate, targetDate);
    } catch (error) {
      console.error("Erreur lors du filtrage des événements:", error, event);
      return false;
    }
  });
};

// Skeleton pour le chargement
const CalendarSkeleton = () => (
  <div className="grid grid-cols-7 gap-1">
    {/* En-têtes des jours */}
    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((jour, index) => (
      <div key={index} className="text-center font-medium py-2 text-slate-600">
        {jour}
      </div>
    ))}

    {/* Cases du calendrier */}
    {Array.from({ length: 35 }).map((_, index) => (
      <div
        key={index}
        className="h-24 bg-gray-200 border border-slate-200 animate-pulse rounded"
      />
    ))}
  </div>
);

export default function DatePicker({
  events,
  moisActuel,
  anneeActuelle,
  filtreType,
  selectedDates,
  onDatesChange,
  loading = false,
  className = "",
  allowPastDates = false, // Par défaut, on n'autorise pas les dates passées
  onDateClick,
  onEventClick,
}: DatePickerProps) {
  const today = new Date();

  // Générer les jours du calendrier
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];

    // Obtenir le nombre de jours dans le mois
    const nbJoursDansMois = new Date(
      anneeActuelle,
      moisActuel + 1,
      0
    ).getDate();

    // Obtenir le jour de la semaine du premier jour du mois (ajusté pour lundi = 0)
    const premierJourDuMois = new Date(anneeActuelle, moisActuel, 1).getDay();
    const premierJourAjuste =
      premierJourDuMois === 0 ? 6 : premierJourDuMois - 1;

    // Ajouter les jours vides avant le début du mois
    for (let i = 0; i < premierJourAjuste; i++) {
      days.push({
        date: null,
        timestamp: 0,
        isToday: false,
        isSelected: false,
        isPast: false,
        isSelectable: false,
        events: [],
      });
    }

    // Ajouter tous les jours du mois
    for (let jour = 1; jour <= nbJoursDansMois; jour++) {
      const currentDate = new Date(anneeActuelle, moisActuel, jour);
      const timestamp = currentDate.getTime();
      const isPastDate = isPastOrToday(currentDate, today);
      const isSelectableDate = allowPastDates || !isPastDate;

      days.push({
        date: jour,
        timestamp,
        isToday: isSameDay(currentDate, today),
        isSelected: selectedDates.includes(timestamp),
        isPast: isPastDate,
        isSelectable: isSelectableDate,
        events: filterEventsForDay(events, currentDate, filtreType),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const joursDelaSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Gérer la sélection/désélection d'une date
  const toggleDateSelection = (timestamp: number, isSelectable: boolean) => {
    // Empêcher la sélection si la date n'est pas sélectionnable
    if (!isSelectable) {
      return;
    }

    if (selectedDates.includes(timestamp)) {
      onDatesChange(selectedDates.filter((d) => d !== timestamp));
    } else {
      onDatesChange([...selectedDates, timestamp]);
    }

    // Callback optionnel pour le clic sur une date
    if (onDateClick) {
      onDateClick(new Date(timestamp));
    }
  };

  // Gérer le clic sur un événement
  const handleEventClick = (event: APIEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // Éviter la sélection de la date
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Nettoyer les dates sélectionnées si elles ne sont plus valides
  useEffect(() => {
    if (!allowPastDates) {
      const validDates = selectedDates.filter((timestamp) => {
        const date = new Date(timestamp);
        return !isPastOrToday(date, today);
      });

      if (validDates.length !== selectedDates.length) {
        onDatesChange(validDates);
      }
    }
  }, [selectedDates, allowPastDates, onDatesChange]);

  if (loading) {
    return (
      <div className={className}>
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1">
        {/* En-têtes des jours de la semaine */}
        {joursDelaSemaine.map((jour, index) => (
          <div
            key={index}
            className="text-center font-medium py-2 text-slate-600 text-sm"
          >
            {jour}
          </div>
        ))}

        {/* Cases du calendrier */}
        {calendarDays.map((day, index) => {
          if (day.date === null) {
            return (
              <div
                key={`empty-${index}`}
                className="h-24 bg-slate-50 border border-slate-200"
              />
            );
          }

          // Déterminer les classes CSS selon l'état de la date
          const dayClasses = `h-24 p-1 border border-slate-200 overflow-y-auto relative transition-colors
            ${day.isToday ? "bg-blue-200" : "bg-white"}
            ${day.isSelected ? "ring-2 ring-blue-500" : ""}
            ${!day.isSelectable ? "bg-slate-100 opacity-60" : ""}
            ${day.isSelectable ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed"}
          `;

          return (
            <div
              key={`day-${day.date}`}
              className={dayClasses}
              onClick={() =>
                toggleDateSelection(day.timestamp, day.isSelectable)
              }
              title={
                !day.isSelectable
                  ? "Cette date ne peut pas être sélectionnée"
                  : undefined
              }
            >
              {/* Numéro du jour */}
              <div
                className={`text-right p-1 text-sm ${
                  day.isToday
                    ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                    : day.isSelected
                      ? "bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                      : !day.isSelectable
                        ? "text-slate-400"
                        : "text-slate-700"
                }`}
              >
                {day.date}
              </div>

              {/* Indicateur de date non sélectionnable */}
              {!day.isSelectable && !day.isToday && (
                <div className="absolute top-1 left-1">
                  <span className="text-xs text-slate-400">🚫</span>
                </div>
              )}

              {/* Événements du jour */}
              <div className="mt-1 space-y-1">
                {day.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <EventCard
                      event={event}
                      view="calendar"
                      className={`transition-colors ${!day.isSelectable ? "opacity-70" : ""}`}
                    />
                  </div>
                ))}
              </div>

              {/* Indicateur si plus d'événements */}
              {/* {day.events.length > 3 && (
                <div className="text-xs text-slate-400 text-center mt-1">
                  +{day.events.length - 3} autres
                </div>
              )} */}
            </div>
          );
        })}
      </div>

      {/* Message si aucun événement */}
      {events.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <div className="text-sm">Aucun événement pour cette période.</div>
        </div>
      )}
    </div>
  );
}

// Hook pour gérer la sélection de dates (mis à jour)
export function useDateSelection(
  initialDates: number[] = [],
  allowPastDates: boolean = false
) {
  const [selectedDates, setSelectedDates] = useState<number[]>(initialDates);
  const today = new Date();

  // Fonction pour vérifier si une date est valide
  const isValidDate = (timestamp: number): boolean => {
    if (allowPastDates) return true;
    const date = new Date(timestamp);
    return !isPastOrToday(date, today);
  };

  const addDate = (timestamp: number) => {
    if (!selectedDates.includes(timestamp) && isValidDate(timestamp)) {
      setSelectedDates([...selectedDates, timestamp]);
    }
  };

  const removeDate = (timestamp: number) => {
    setSelectedDates(selectedDates.filter((d) => d !== timestamp));
  };

  const toggleDate = (timestamp: number) => {
    if (!isValidDate(timestamp)) return;

    if (selectedDates.includes(timestamp)) {
      removeDate(timestamp);
    } else {
      addDate(timestamp);
    }
  };

  const clearSelection = () => {
    setSelectedDates([]);
  };

  const selectRange = (startDate: number, endDate: number) => {
    const start = Math.min(startDate, endDate);
    const end = Math.max(startDate, endDate);
    const range: number[] = [];

    for (
      let d = new Date(start);
      d <= new Date(end);
      d.setDate(d.getDate() + 1)
    ) {
      const timestamp = d.getTime();
      if (isValidDate(timestamp)) {
        range.push(timestamp);
      }
    }

    setSelectedDates(range);
  };

  // Nettoyer automatiquement les dates invalides
  useEffect(() => {
    const validDates = selectedDates.filter(isValidDate);
    if (validDates.length !== selectedDates.length) {
      setSelectedDates(validDates);
    }
  }, [selectedDates, allowPastDates]);

  return {
    selectedDates,
    setSelectedDates: (dates: number[]) => {
      const validDates = dates.filter(isValidDate);
      setSelectedDates(validDates);
    },
    addDate,
    removeDate,
    toggleDate,
    clearSelection,
    selectRange,
    hasSelection: selectedDates.length > 0,
    selectionCount: selectedDates.length,
    isValidDate,
  };
}

export type { CalendarDay };
