/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AlarmClock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Types
type EventType = "ACTIVITÉ" | "MESSE";
type EventStatus = "programmé" | "confirmé" | "terminé" | "annulé";

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

interface EventCardProps {
  event: APIEvent;
  view?: "list" | "calendar";
  className?: string;
  onClick?: (event: APIEvent) => void;
}

// Utilitaires pour le formatage
const normalizeTimestamp = (timestamp: number): number => {
  return String(timestamp).length <= 10 ? timestamp * 1000 : timestamp;
};

const formatHeure = (timestamp: number | undefined): string => {
  if (timestamp === undefined) return "";

  try {
    const adjustedTimestamp = normalizeTimestamp(timestamp);
    const date = new Date(adjustedTimestamp);

    if (isNaN(date.getTime())) {
      return "";
    }

    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  } catch (error) {
    console.error("Erreur lors du formatage de l'heure:", error, timestamp);
    return "Heure inconnue";
  }
};

const getEventTypeDetails = (type: EventType) => {
  switch (type) {
    case "MESSE":
      return { label: "Messe", variant: "default" as const };
    case "ACTIVITÉ":
      return { label: "Activité", variant: "secondary" as const };
    default:
      return { label: type, variant: "default" as const };
  }
};

export default function EventCard({
  event,
  view = "list",
  className = "",
  onClick,
}: EventCardProps) {
  const { label: typeLabel, variant: typeVariant } = getEventTypeDetails(
    event.type
  );

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  // Vue liste (plus détaillée)
  if (view === "list") {
    return (
      <div
        className={`border border-slate-200 rounded-md hover:bg-slate-50 p-3 cursor-pointer transition-colors ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center">
            <Calendar className="h-5 w-5 text-slate-700" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 line-clamp-2">
              {event.libelle}
            </h4>
            {event.extras?.type_messe && (
              <h4 className="font-medium text-xs text-slate-400 line-clamp-2">
                {event.extras.type_messe}
              </h4>
            )}
          </div>
        </div>

        {(typeLabel ||
          event?.extras?.heure_de_debut ||
          event?.extras?.heure_de_fin) && (
          <div className="flex items-center justify-between mb-2">
            {/* Badges à gauche */}
            <div className="flex flex-wrap gap-2">
              {typeLabel && (
                <Badge
                  variant={typeVariant}
                  className="text-xs px-2 py-0.5 h-5"
                >
                  {typeLabel}
                </Badge>
              )}
            </div>

            {/* Heures à droite - seulement si au moins une heure existe */}
            {(event?.extras?.heure_de_debut || event?.extras?.heure_de_fin) && (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                {event?.extras?.heure_de_debut && (
                  <div className="flex text-xs items-center">
                    <AlarmClock className="h-3.5 w-3.5 mr-1" />
                    {formatHeure(event.extras.heure_de_debut)}
                  </div>
                )}{" "}
                -
                {event?.extras?.heure_de_fin && (
                  <div className="flex items-center text-xs">
                    {formatHeure(event.extras.heure_de_fin)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* <a
          href={`/dashboard/paroisse/evenements/${event.id}`}
          className="block w-full text-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 px-4 py-2 mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          Détails
        </a> */}
      </div>
    );
  }

  // Vue calendrier (plus compacte)
  return (
    <a
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
      } ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {getEventTypeDetails(event?.type).label}
    </a>
  );
}

// Export des types pour réutilisation
export type { APIEvent, EventType, EventStatus, APIEventExtras };
