/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import EventsList from "@/components/dashboard/EventsList";
import {
  Calendar,
  User,
  Heart,
  CreditCard,
  Church,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  ChevronDown,
  Building,
  HandHelping,
  Flower2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChartAreaInteractive } from "@/components/ui/section-cards";

export default function ParoisseDashboardPage() {
  const [showDetails, setShowDetails] = useState(false);
  type Paroisse = {
    nom?: string;
    statut?: string;
    quartier?: string;
    ville?: string;
    pays?: string;
    created_at?: string;
  };

  type UserProfile = {
    prenoms?: string;
    nom?: string;
    email?: string;
    role?: string;
    paroisse?: Paroisse;
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://api.cathoconnect.ci/api:35Re9Rls";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new Error("Token d'authentification non trouvé");
        }

        const response = await axios.get(`${API_URL}/admin/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserProfile(response.data.item); // Supposant que les données se trouvent dans 'item'
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        setError(error.message || "Une erreur est survenue");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fonction pour formater la date
  const formatDate = (timestamp: string | number | Date | undefined) => {
    if (!timestamp) return "Non disponible";

    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  // Afficher l'erreur s'il y en a une
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg max-w-md">
          <h3 className="font-medium text-lg mb-2">Erreur de chargement</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Si les données sont chargées, mais qu'il n'y a pas de profil
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg max-w-md">
          <h3 className="font-medium text-lg mb-2">Aucune donnée disponible</h3>
          <p>Impossible de récupérer les informations de profil.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  // Données de la paroisse issues du profil utilisateur
  const paroisseData = userProfile.paroisse || {};

  // Numéro de téléphone et email fictifs (à remplacer par des données réelles si disponibles)
  const contactInfo = {
    adresse: paroisseData.quartier + ", " + paroisseData.ville,
    cure: "Père François Koffi", // Données fictives à remplacer
    doyenne: "Doyenné " + (paroisseData.quartier || "Centre"), // Données fictives à remplacer
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center">
          <Church className="h-12 w-12 text-slate-700 mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {paroisseData.nom || "Ma Paroisse"}
            </h1>
            <p className="text-sm font-medium text-slate-600">
              {paroisseData.statut || "Paroisse"}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 md:mt-0">
          <div className="flex items-start">
            <User className="h-8 w-8 text-slate-700 mr-3 shrink-0" />
            <div>
              <p className="text-xs text-slate-700 font-medium">Curé</p>
              <p className="font-medium">
                {contactInfo.cure || "Non spécifié"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="h-8 w-8 text-slate-700 mr-3 shrink-0" />
            <div>
              <p className="text-xs text-slate-700 font-medium">Localisation</p>
              <p className="font-medium">
                {paroisseData.quartier || "Non spécifié"},{" "}
                {paroisseData.ville || "Non spécifié"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Les cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-6 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Mouvements et Associations"
          value="1234"
          icon={<User className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Communauté Ecclesiastique de Base"
          value="28"
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Demandes de Messes"
          value="18"
          icon={<HandHelping className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Denier de culte"
          value="4"
          icon={<Flower2 className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Paroissiens"
          // value={
          //   <div className="flex flex-col">
          //     <span className="text-2xl font-bold">1,234</span>
          //     <div className="flex items-center text-xs mt-1 space-x-3">
          //       <span className="inline-flex items-center">
          //         <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
          //         <span className="text-base">789 Abonnés</span>
          //       </span>
          //       <span className="inline-flex items-center">
          //         <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
          //         <span className="text-base">445 Non-abonnés</span>
          //       </span>
          //     </div>
          //   </div>
          // }
          value="5000"
          icon={<User className="h-5 w-5 text-blue-600" />}
        />

        <StatsCard
          title="Sacrements"
          value="28"
          icon={<Heart className="h-5 w-5 text-red-600" />}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-6">
        <div className="w-full lg:w-1/2">
          <ChartAreaInteractive />
        </div>

        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Événements à venir</h2>
            <EventsList />
          </Card>
        </div>
      </div>
    </div>
  );
}
