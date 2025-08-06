// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-html-link-for-pages */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Plus, LayoutList, CalendarDays } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
// import axios from "axios";

// // Import des composants modulaires
// import EventCard, {
//   APIEvent,
//   EventType,
// } from "@/components/dashboard/EventCard";
// import EventFilters, {
//   useEventFilters,
// } from "@/components/dashboard/EventFilters";
// import DatePicker, {
//   useDateSelection,
// } from "@/components/dashboard/DatePicker";
// import CreateEventModal, {
//   useCreateEventModal,
// } from "@/components/dashboard/CreateEventModal";

// // Custom hook pour gérer les événements
// function useEvents() {
//   const [events, setEvents] = useState<APIEvent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [paroisseId, setParoisseId] = useState<number>(0);

//   // Récupérer l'ID de la paroisse depuis le profil utilisateur
//   const getUserParoisseId = (): number => {
//     try {
//       const userProfileStr = localStorage.getItem("user_profile");
//       if (userProfileStr) {
//         const userProfile = JSON.parse(userProfileStr);
//         return userProfile.paroisse_id || 0;
//       }
//     } catch (err) {
//       console.error("Erreur lors de la récupération du profil:", err);
//     }
//     return 0;
//   };

//   // Fonction pour charger les événements
//   const fetchEvents = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const API_URL_STATISTIQUE =
//         process.env.NEXT_PUBLIC_API_URL_STATISTIQUE ||
//         "https://api.cathoconnect.ci/api:HzF8fFua";
//       const token = localStorage.getItem("auth_token");

//       if (!token) {
//         throw new Error("Token d'authentification non trouvé");
//       }

//       const currentParoisseId = getUserParoisseId();
//       setParoisseId(currentParoisseId);

//       const response = await axios.get(
//         `${API_URL_STATISTIQUE}/evenements/obtenir-tous`,
//         {
//           params: { paroisse_id: currentParoisseId },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       console.log("Événements chargés:", response.data);

//       if (response.data?.items && Array.isArray(response.data.items)) {
//         setEvents(response.data.items);
//       } else {
//         console.error("Format de réponse inattendu:", response.data);
//         setEvents([]);
//       }
//     } catch (err: any) {
//       console.error("Erreur lors du chargement des événements:", err);
//       setError("Une erreur est survenue lors du chargement des événements.");
//       toast.error("Impossible de charger les événements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les événements au montage
//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   return {
//     events,
//     loading,
//     error,
//     paroisseId,
//     refreshEvents: fetchEvents,
//   };
// }

// // Composant pour la vue Liste
// interface EventsListViewProps {
//   events: APIEvent[];
//   moisActuel: number;
//   anneeActuelle: number;
//   filtreType: string;
//   loading: boolean;
// }

// const EventsListView: React.FC<EventsListViewProps> = ({
//   events,
//   moisActuel,
//   anneeActuelle,
//   filtreType,
//   loading,
// }) => {
//   // Normaliser le timestamp
//   const normalizeTimestamp = (timestamp: number): number => {
//     return String(timestamp).length <= 10 ? timestamp * 1000 : timestamp;
//   };

//   // Formatage de la date
//   const formatDate = (timestamp: number) => {
//     try {
//       const adjustedTimestamp = normalizeTimestamp(timestamp);
//       const date = new Date(adjustedTimestamp);

//       if (isNaN(date.getTime())) {
//         return "Date invalide";
//       }

//       return date.toLocaleDateString("fr-FR", {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });
//     } catch (error) {
//       console.error("Erreur lors du formatage de la date:", error);
//       return "Date inconnue";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         {/* Skeletons pour la vue liste */}
//         {Array.from({ length: 3 }).map((_, dateIndex) => (
//           <div key={dateIndex}>
//             <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {Array.from({ length: 4 }).map((_, eventIndex) => (
//                 <div
//                   key={eventIndex}
//                   className="border border-slate-200 rounded-md p-4 animate-pulse"
//                 >
//                   <div className="flex items-start gap-3 mb-3">
//                     <div className="w-10 h-10 bg-gray-200 rounded-md" />
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 bg-gray-200 rounded w-3/4" />
//                       <div className="h-3 bg-gray-200 rounded w-1/2" />
//                     </div>
//                   </div>
//                   <div className="flex gap-2 mb-2">
//                     <div className="h-5 bg-gray-200 rounded w-16" />
//                   </div>
//                   <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
//                   <div className="h-8 bg-gray-200 rounded" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (!events || events.length === 0) {
//     return (
//       <div className="text-center py-8 text-slate-500">
//         Aucun événement trouvé.
//       </div>
//     );
//   }

//   // Filtrer et grouper les événements par date
//   const groupedEvents: Record<string, APIEvent[]> = {};

//   events.forEach((event) => {
//     // Filtrer par type
//     if (filtreType !== "tous" && event.type !== filtreType) {
//       return;
//     }

//     try {
//       const timestamp = normalizeTimestamp(event.date_de_debut);
//       const date = new Date(timestamp);

//       // Filtrer par mois et année
//       if (
//         date.getMonth() !== moisActuel ||
//         date.getFullYear() !== anneeActuelle
//       ) {
//         return;
//       }

//       // Créer un identifiant de date pour le regroupement
//       const dateKey = date.toISOString().split("T")[0];

//       if (!groupedEvents[dateKey]) {
//         groupedEvents[dateKey] = [];
//       }

//       groupedEvents[dateKey].push(event);
//     } catch (error) {
//       console.error("Erreur lors du traitement de l'événement:", error, event);
//     }
//   });

//   const sortedDates = Object.keys(groupedEvents).sort();

//   return (
//     <div className="space-y-6">
//       {sortedDates.map((dateKey) => (
//         <div key={dateKey}>
//           <h3 className="font-medium text-slate-900 sticky top-0 bg-white py-2 mb-4">
//             {formatDate(new Date(dateKey).getTime())}
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {groupedEvents[dateKey].map((event) => (
//               <EventCard
//                 key={event.id}
//                 event={event}
//                 view="list"
//                 onClick={(event) => {
//                   window.location.href = `/dashboard/paroisse/evenements/${event.id}`;
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       ))}

//       {sortedDates.length === 0 && (
//         <div className="text-center py-8 text-slate-500">
//           Aucun événement prévu pour cette période.
//         </div>
//       )}
//     </div>
//   );
// };

// // Composant principal
// export default function EvenementsPage() {
//   // Hooks personnalisés
//   const eventsData = useEvents();
//   const filters = useEventFilters();
//   const dateSelection = useDateSelection();
//   const createModal = useCreateEventModal();

//   const { events, loading, error, paroisseId, refreshEvents } = eventsData;

//   // Gestionnaire pour la création d'événements
//   const handleEventsCreated = () => {
//     dateSelection.clearSelection();
//     refreshEvents();
//   };

//   // Ouvrir la modal de création
//   const handleOpenCreateModal = () => {
//     if (dateSelection.selectionCount === 0) {
//       toast.error("Veuillez sélectionner au moins une date dans le calendrier");
//       return;
//     }
//     createModal.openModal();
//   };

//   return (
//     <div className="space-y-6">
//       {/* En-tête de la page */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
//         <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
//           Événements
//         </h1>
//         <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
//           {/* <Button
//             className="w-full xs:w-auto"
//             size="sm"
//             // onClick={handleOpenCreateModal}
//             disabled={loading}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Créer événement
//           </Button> */}
//         </div>
//       </div>

//       {/* Affichage des erreurs */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
//           {error}
//           <Button
//             variant="link"
//             className="ml-2 text-red-700 p-0 h-auto"
//             onClick={refreshEvents}
//           >
//             Réessayer
//           </Button>
//         </div>
//       )}

//       {/* Contenu principal */}
//       <Card className="p-6">
//         {/* Filtres */}
//         <EventFilters
//           moisActuel={filters.moisActuel}
//           anneeActuelle={filters.anneeActuelle}
//           filtreType={filters.filtreType}
//           onMoisChange={filters.setMoisActuel}
//           onAnneeChange={filters.setAnneeActuelle}
//           onTypeChange={filters.setFiltreType}
//           onMoisPrecedent={filters.moisPrecedent}
//           onMoisSuivant={filters.moisSuivant}
//           className="mb-6"
//         />

//         {/* Onglets Liste/Calendrier */}
//         <Tabs defaultValue="liste" className="w-full">
//           <TabsList className="mb-4">
//             <TabsTrigger value="liste" className="flex items-center">
//               <LayoutList className="h-4 w-4 mr-2" /> Liste
//             </TabsTrigger>
//             <TabsTrigger value="calendrier" className="flex items-center">
//               <CalendarDays className="h-4 w-4 mr-2" /> Calendrier
//             </TabsTrigger>
//           </TabsList>

//           {/* Vue Liste */}
//           <TabsContent value="liste">
//             {/* <div className="flex justify-between items-center">
//               <span className="text-sm text-slate-500"></span>
//               <div className="flex gap-2">
//                 <Button
//                   onClick={handleOpenCreateModal}
//                   disabled={!dateSelection.hasSelection}
//                   size="sm"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer événements
//                 </Button>
//               </div>
//             </div> */}
//             <EventsListView
//               events={events}
//               moisActuel={filters.moisActuel}
//               anneeActuelle={filters.anneeActuelle}
//               filtreType={filters.filtreType}
//               loading={loading}
//             />
//           </TabsContent>

//           {/* Vue Calendrier */}
//           <TabsContent value="calendrier">
//             <div className="space-y-4">
//               {/* Informations sur la sélection */}
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-500"></span>
//                 <div className="flex gap-2">
//                   {dateSelection.hasSelection && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={dateSelection.clearSelection}
//                     >
//                       Désélectionner tout
//                     </Button>
//                   )}
//                   <Button
//                     onClick={handleOpenCreateModal}
//                     disabled={!dateSelection.hasSelection}
//                     size="sm"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Créer événements ({dateSelection.selectionCount})
//                   </Button>
//                 </div>
//               </div>

//               {/* Calendrier */}
//               <DatePicker
//                 events={events}
//                 moisActuel={filters.moisActuel}
//                 anneeActuelle={filters.anneeActuelle}
//                 filtreType={filters.filtreType}
//                 selectedDates={dateSelection.selectedDates}
//                 onDatesChange={dateSelection.setSelectedDates}
//                 loading={loading}
//                 onEventClick={(event) => {
//                   window.location.href = `/dashboard/paroisse/evenements/${event.id}`;
//                 }}
//               />
//             </div>
//           </TabsContent>
//         </Tabs>
//       </Card>

//       {/* Modal de création d'événements */}
//       <CreateEventModal
//         isOpen={createModal.isOpen}
//         onOpenChange={createModal.setIsOpen}
//         selectedDates={dateSelection.selectedDates}
//         paroisseId={paroisseId}
//         onEventsCreated={handleEventsCreated}
//       />
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  LayoutList,
  CalendarDays,
  Calendar,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";

// Import des composants modulaires
import EventCard, {
  APIEvent,
  EventType,
} from "@/components/dashboard/EventCard";
import EventFilters, {
  useEventFilters,
} from "@/components/dashboard/EventFilters";
import DatePicker, {
  useDateSelection,
} from "@/components/dashboard/DatePicker";
import CreateEventModal, {
  useCreateEventModal,
} from "@/components/dashboard/CreateEventModal";

// Fonctions utilitaires modifiées pour exclure aujourd'hui

const getRemainingDaysOfWeek = (startDate: Date = new Date()): number[] => {
  const dates: number[] = [];
  const today = new Date(startDate);
  const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, etc.

  // Calculer combien de jours il reste jusqu'à dimanche (en excluant aujourd'hui)
  const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay; // Si dimanche, pas de jours restants

  // Commencer à partir de demain (i = 1 au lieu de i = 0)
  for (let i = 1; i <= daysUntilSunday; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Définir l'heure à 23:59:59 pour être cohérent avec le format existant
    date.setHours(23, 59, 59, 999);
    dates.push(date.getTime());
  }

  return dates;
};

const getRemainingDaysOfMonth = (startDate: Date = new Date()): number[] => {
  const dates: number[] = [];
  const today = new Date(startDate);
  const year = today.getFullYear();
  const month = today.getMonth();

  // Dernier jour du mois
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const currentDate = today.getDate();

  // Commencer à partir de demain (currentDate + 1)
  for (let day = currentDate + 1; day <= lastDayOfMonth; day++) {
    const date = new Date(year, month, day, 23, 59, 59, 999);
    dates.push(date.getTime());
  }

  return dates;
};

const getRemainingWeekdaysOfMonth = (
  startDate: Date = new Date()
): number[] => {
  const dates: number[] = [];
  const today = new Date(startDate);
  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const currentDate = today.getDate();

  // Commencer à partir de demain (currentDate + 1)
  for (let day = currentDate + 1; day <= lastDayOfMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    // Exclure samedi (6) et dimanche (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      date.setHours(23, 59, 59, 999);
      dates.push(date.getTime());
    }
  }

  return dates;
};

const getRemainingWeekendsOfMonth = (
  startDate: Date = new Date()
): number[] => {
  const dates: number[] = [];
  const today = new Date(startDate);
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const currentDate = today.getDate();

  // Commencer à partir de demain (currentDate + 1)
  for (let day = currentDate + 1; day <= lastDayOfMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    // Samedi (6) et dimanche (0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      date.setHours(23, 59, 59, 999);
      dates.push(date.getTime());
    }
  }

  return dates;
};

// Composant de sélection rapide
interface QuickSelectionProps {
  onSelectDates: (dates: number[]) => void;
  currentMonth: number;
  currentYear: number;
  selectedDates: number[];
  onClearSelection: () => void;
}

const QuickSelection: React.FC<QuickSelectionProps> = ({
  onSelectDates,
  currentMonth,
  currentYear,
  selectedDates,
  onClearSelection,
}) => {
  // const handleSelectRemainingWeek = () => {
  //   const today = new Date();
  //   const remainingDays = getRemainingDaysOfWeek(today);
  //   onSelectDates(remainingDays);
  //   toast.success(
  //     `${remainingDays.length} jour${remainingDays.length > 1 ? "s" : ""} sélectionné${remainingDays.length > 1 ? "s" : ""} pour le reste de la semaine`
  //   );
  // };

  // const handleSelectRemainingMonth = () => {
  //   const today = new Date();
  //   const remainingDays = getRemainingDaysOfMonth(today);
  //   onSelectDates(remainingDays);
  //   toast.success(
  //     `${remainingDays.length} jour${remainingDays.length > 1 ? "s" : ""} sélectionné${remainingDays.length > 1 ? "s" : ""} pour le reste du mois`
  //   );
  // };

  // const handleSelectRemainingWeekdays = () => {
  //   const today = new Date();
  //   const remainingWeekdays = getRemainingWeekdaysOfMonth(today);
  //   onSelectDates(remainingWeekdays);
  //   toast.success(
  //     `${remainingWeekdays.length} jour${remainingWeekdays.length > 1 ? "s" : ""} ouvrable${remainingWeekdays.length > 1 ? "s" : ""} sélectionné${remainingWeekdays.length > 1 ? "s" : ""}`
  //   );
  // };

  // const handleSelectWeekend = () => {
  //   const today = new Date();
  //   const weekendDays = getRemainingWeekendsOfMonth(today);
  //   onSelectDates(weekendDays);
  //   toast.success(
  //     `${weekendDays.length} jour${weekendDays.length > 1 ? "s" : ""} de week-end sélectionné${weekendDays.length > 1 ? "s" : ""}`
  //   );
  // };
  // Handlers modifiés avec meilleurs messages
  const handleSelectRemainingWeek = () => {
    const today = new Date();
    const remainingDays = getRemainingDaysOfWeek(today);
    onSelectDates(remainingDays);

    if (remainingDays.length === 0) {
      toast.info("Aucun jour restant dans cette semaine");
    } else {
      toast.success(
        `${remainingDays.length} jour${remainingDays.length > 1 ? "s" : ""} sélectionné${remainingDays.length > 1 ? "s" : ""} pour le reste de la semaine (à partir de demain)`
      );
    }
  };

  const handleSelectRemainingMonth = () => {
    const today = new Date();
    const remainingDays = getRemainingDaysOfMonth(today);
    onSelectDates(remainingDays);

    if (remainingDays.length === 0) {
      toast.info("Aucun jour restant dans ce mois");
    } else {
      toast.success(
        `${remainingDays.length} jour${remainingDays.length > 1 ? "s" : ""} sélectionné${remainingDays.length > 1 ? "s" : ""} pour le reste du mois (à partir de demain)`
      );
    }
  };

  const handleSelectRemainingWeekdays = () => {
    const today = new Date();
    const remainingWeekdays = getRemainingWeekdaysOfMonth(today);
    onSelectDates(remainingWeekdays);

    if (remainingWeekdays.length === 0) {
      toast.info("Aucun jour ouvrable restant dans ce mois");
    } else {
      toast.success(
        `${remainingWeekdays.length} jour${remainingWeekdays.length > 1 ? "s" : ""} ouvrable${remainingWeekdays.length > 1 ? "s" : ""} sélectionné${remainingWeekdays.length > 1 ? "s" : ""} (à partir de demain)`
      );
    }
  };

  const handleSelectWeekend = () => {
    const today = new Date();
    const weekendDays = getRemainingWeekendsOfMonth(today);
    onSelectDates(weekendDays);

    if (weekendDays.length === 0) {
      toast.info("Aucun week-end restant dans ce mois");
    } else {
      toast.success(
        `${weekendDays.length} jour${weekendDays.length > 1 ? "s" : ""} de week-end sélectionné${weekendDays.length > 1 ? "s" : ""} (à partir de demain)`
      );
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <h3 className="font-medium text-blue-900">Sélection rapide</h3>
        </div>
        {selectedDates.length > 0 && (
          <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
            {selectedDates.length} date{selectedDates.length > 1 ? "s" : ""}{" "}
            sélectionnée{selectedDates.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectRemainingWeek}
          className="text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 cursor-pointer"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Reste semaine
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectRemainingMonth}
          className="text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 cursor-pointer"
        >
          <CalendarDays className="h-3 w-3 mr-1" />
          Reste du mois
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectRemainingWeekdays}
          className="text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 cursor-pointer"
        >
          <Clock className="h-3 w-3 mr-1" />
          Jours ouvrables
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectWeekend}
          className="text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 cursor-pointer"
        >
          <Users className="h-3 w-3 mr-1" />
          Week-ends
        </Button>
      </div>

      {/* {selectedDates.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="w-full text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100"
        >
          Désélectionner tout
        </Button>
      )} */}
    </div>
  );
};

// Custom hook pour gérer les événements
function useEvents() {
  const [events, setEvents] = useState<APIEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paroisseId, setParoisseId] = useState<number>(0);

  // Récupérer l'ID de la paroisse depuis le profil utilisateur
  const getUserParoisseId = (): number => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.paroisse_id || 0;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
    }
    return 0;
  };

  // Fonction pour charger les événements
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL_STATISTIQUE =
        process.env.NEXT_PUBLIC_API_URL_STATISTIQUE ||
        "https://api.cathoconnect.ci/api:HzF8fFua";
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const currentParoisseId = getUserParoisseId();
      setParoisseId(currentParoisseId);

      const response = await axios.get(
        `${API_URL_STATISTIQUE}/evenements/obtenir-tous`,
        {
          params: { paroisse_id: currentParoisseId },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Événements chargés:", response.data);

      if (response.data?.items && Array.isArray(response.data.items)) {
        setEvents(response.data.items);
      } else {
        console.error("Format de réponse inattendu:", response.data);
        setEvents([]);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des événements:", err);
      setError("Une erreur est survenue lors du chargement des événements.");
      toast.error("Impossible de charger les événements");
    } finally {
      setLoading(false);
    }
  };

  // Charger les événements au montage
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    paroisseId,
    refreshEvents: fetchEvents,
  };
}

// Composant pour la vue Liste
interface EventsListViewProps {
  events: APIEvent[];
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;
  loading: boolean;
}

const EventsListView: React.FC<EventsListViewProps> = ({
  events,
  moisActuel,
  anneeActuelle,
  filtreType,
  loading,
}) => {
  // Normaliser le timestamp
  const normalizeTimestamp = (timestamp: number): number => {
    return String(timestamp).length <= 10 ? timestamp * 1000 : timestamp;
  };

  // Formatage de la date
  const formatDate = (timestamp: number) => {
    try {
      const adjustedTimestamp = normalizeTimestamp(timestamp);
      const date = new Date(adjustedTimestamp);

      if (isNaN(date.getTime())) {
        return "Date invalide";
      }

      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return "Date inconnue";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeletons pour la vue liste */}
        {Array.from({ length: 3 }).map((_, dateIndex) => (
          <div key={dateIndex}>
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, eventIndex) => (
                <div
                  key={eventIndex}
                  className="border border-slate-200 rounded-md p-4 animate-pulse"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucun événement trouvé.
      </div>
    );
  }

  // Filtrer et grouper les événements par date
  const groupedEvents: Record<string, APIEvent[]> = {};

  events.forEach((event) => {
    // Filtrer par type
    if (filtreType !== "tous" && event.type !== filtreType) {
      return;
    }

    try {
      const timestamp = normalizeTimestamp(event.date_de_debut);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedEvents[dateKey].map((event) => (
              <EventCard
                key={event.id}
                event={event}
                view="list"
                onClick={(event) => {
                  window.location.href = `/dashboard/paroisse/evenements/${event.id}`;
                }}
              />
            ))}
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

// Composant principal
function EvenementsPage() {
  // Hooks personnalisés
  const eventsData = useEvents();
  const filters = useEventFilters();
  const dateSelection = useDateSelection();
  const createModal = useCreateEventModal();

  const { events, loading, error, paroisseId, refreshEvents } = eventsData;

  // Gestionnaire pour la création d'événements
  const handleEventsCreated = () => {
    dateSelection.clearSelection();
    refreshEvents();
  };

  // Ouvrir la modal de création
  const handleOpenCreateModal = () => {
    if (dateSelection.selectionCount === 0) {
      toast.error("Veuillez sélectionner au moins une date dans le calendrier");
      return;
    }
    createModal.openModal();
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Événements
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          {/* Bouton de création d'événement (optionnel) */}
          {/* <Button
            className="w-full xs:w-auto"
            size="sm"
            onClick={handleOpenCreateModal}
            disabled={loading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer événement
          </Button> */}
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
          <Button
            variant="link"
            className="ml-2 text-red-700 p-0 h-auto"
            onClick={refreshEvents}
          >
            Réessayer
          </Button>
        </div>
      )}

      {/* Contenu principal */}
      <Card className="p-6">
        {/* Filtres */}
        <EventFilters
          moisActuel={filters.moisActuel}
          anneeActuelle={filters.anneeActuelle}
          filtreType={filters.filtreType}
          onMoisChange={filters.setMoisActuel}
          onAnneeChange={filters.setAnneeActuelle}
          onTypeChange={filters.setFiltreType}
          onMoisPrecedent={filters.moisPrecedent}
          onMoisSuivant={filters.moisSuivant}
          className="mb-6"
        />

        {/* Onglets Liste/Calendrier */}
        <Tabs defaultValue="liste" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="liste" className="flex items-center">
              <LayoutList className="h-4 w-4 mr-2" /> Liste
            </TabsTrigger>
            <TabsTrigger value="calendrier" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" /> Calendrier
            </TabsTrigger>
          </TabsList>

          {/* Vue Liste */}
          <TabsContent value="liste">
            <EventsListView
              events={events}
              moisActuel={filters.moisActuel}
              anneeActuelle={filters.anneeActuelle}
              filtreType={filters.filtreType}
              loading={loading}
            />
          </TabsContent>

          {/* Vue Calendrier */}
          <TabsContent value="calendrier">
            <div className="space-y-4">
              {/* Composant de sélection rapide */}
              <QuickSelection
                onSelectDates={dateSelection.setSelectedDates}
                currentMonth={filters.moisActuel}
                currentYear={filters.anneeActuelle}
                selectedDates={dateSelection.selectedDates}
                onClearSelection={dateSelection.clearSelection}
              />

              {/* Informations sur la sélection */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500"></span>
                <div className="flex gap-2">
                  {dateSelection.hasSelection && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={dateSelection.clearSelection}
                    >
                      Désélectionner tout
                    </Button>
                  )}
                  <Button
                    onClick={handleOpenCreateModal}
                    disabled={!dateSelection.hasSelection}
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer événements ({dateSelection.selectionCount})
                  </Button>
                </div>
              </div>

              {/* Calendrier */}
              <DatePicker
                events={events}
                moisActuel={filters.moisActuel}
                anneeActuelle={filters.anneeActuelle}
                filtreType={filters.filtreType}
                selectedDates={dateSelection.selectedDates}
                onDatesChange={dateSelection.setSelectedDates}
                loading={loading}
                onEventClick={(event) => {
                  window.location.href = `/dashboard/paroisse/evenements/${event.id}`;
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Modal de création d'événements */}
      <CreateEventModal
        isOpen={createModal.isOpen}
        onOpenChange={createModal.setIsOpen}
        selectedDates={dateSelection.selectedDates}
        paroisseId={paroisseId}
        onEventsCreated={handleEventsCreated}
      />
    </div>
  );
}

// Export par défaut du composant
export default EvenementsPage;
