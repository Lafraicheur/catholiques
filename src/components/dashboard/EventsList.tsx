/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Interface pour les événements de l'API
interface ApiEvent {
  id: number;
  type: string;
  extras: Record<string, any>;
  libelle: string;
  created_at: number;
  date_de_debut: number;
}

interface EventsResponse {
  items: ApiEvent[];
}

// ✅ Composant Skeleton pour les événements
const EventSkeleton = () => (
  <div className="flex items-start p-3 rounded-md border border-slate-200">
    <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-md animate-pulse mr-4" />
    <div className="flex-grow min-w-0 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
      </div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
      </div>
    </div>
  </div>
);

export default function EventsList() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Variables d'environnement
  const API_URL_STATISTIQUE =
    process.env.NEXT_PUBLIC_API_URL_STATISTIQUE ||
    "https://api.cathoconnect.ci/api:HzF8fFua";

  // ✅ Fonction pour récupérer les événements à venir
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Récupérer l'ID de la paroisse depuis le profil utilisateur
      const profileResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "https://api.cathoconnect.ci/api:35Re9Rls"}/admin/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const paroisseId = profileResponse.data.item?.paroisse?.id;

      if (!paroisseId) {
        throw new Error("ID de paroisse non trouvé");
      }

      // Récupérer les événements
      const eventsResponse = await axios.get(
        `${API_URL_STATISTIQUE}/accueil/evenement-a-venir`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            paroisse_id: paroisseId,
          },
        }
      );

      // ✅ Gérer la structure de réponse de l'API
      const eventsData = eventsResponse.data.items || [];
      setEvents(
        Array.isArray(eventsData) ? eventsData : [eventsData].filter(Boolean)
      );
      setLoading(false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des événements:", error);
      setError(error.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Formatage de la date en français (timestamp vers date)
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp); // Pas besoin de multiplier par 1000
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // ✅ Formatage de l'heure (timestamp vers heure)
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Formater type d'événement pour Badge (types réels de l'API)
  const getEventTypeDetails = (type: string) => {
    switch (type.toUpperCase()) {
      case "MESSE":
        return { label: "Messe", variant: "default" as const };
      case "ACTIVITÉ":
        return { label: "Activité", variant: "secondary" as const };
      case "COTISATION":
        return { label: "Cotisation", variant: "outline" as const };
      case "INSCRIPTION":
        return { label: "Inscription", variant: "destructive" as const };
      case "DON":
        return { label: "Don", variant: "success" as const };
      default:
        return { label: type || "Événement", variant: "default" as const };
    }
  };

  // ✅ Affichage pendant le chargement
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <EventSkeleton key={index} />
        ))}
      </div>
    );
  }

  // ✅ Affichage en cas d'erreur
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-sm mb-2">Erreur de chargement</div>
        <button
          onClick={fetchEvents}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.map((event) => {
        const { label, variant } = getEventTypeDetails(event.type);
        return (
          <div
            key={event.id}
            className="flex items-start p-2 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center mr-4">
              <Calendar className="h-3 w-3 text-slate-700" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-medium text-xs text-slate-900 truncate">
                  {event?.libelle}
                </h5>
                <Badge variant={variant} className="text-xs px-2 py-0.5 h-5">
                  {label}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                {event?.date_de_debut && (
                  <div className="flex text-xs items-center">
                    {formatDate(event.date_de_debut)}
                  </div>
                )}
                {event?.extras?.heure_de_debut && (
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatTime(event.extras.heure_de_debut)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {events.length === 0 && !loading && (
        <div className="text-center py-8 text-slate-500">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">Aucun événement à venir.</p>
        </div>
      )}
    </div>
  );
}
