"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Données fictives d'événements
const events = [
  {
    id: 1,
    title: "Messe dominicale",
    date: "2025-05-18",
    time: "10:30",
    location: "Église principale",
    type: "messe",
  },
  {
    id: 2,
    title: "Catéchisme - Groupe enfants",
    date: "2025-05-17",
    time: "14:00",
    location: "Salle paroissiale",
    type: "formation",
  },
  {
    id: 3,
    title: "Conseil pastoral",
    date: "2025-05-16",
    time: "18:30",
    location: "Bureau du curé",
    type: "reunion",
  }
];

// Formatage de la date en français
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
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
    default:
      return { label: type, variant: "default" as const };
  }
};

export default function EventsList() {
  return (
    <div className="space-y-1">
      {events.map((event) => {
        const { label, variant } = getEventTypeDetails(event.type);
        return (
          <div
            key={event.id}
            className="flex items-start p-4 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-slate-700" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-slate-900 truncate">
                  {event.title}
                </h3>
                <Badge variant={variant}>{label}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 space-y-1 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {event.location}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {events.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Aucun événement à venir.
        </div>
      )}
    </div>
  );
}