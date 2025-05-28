/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
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
  PiggyBank,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChartAreaInteractive } from "@/components/ui/section-cards";

// ✅ Interface pour les statistiques de l'API
interface StatsData {
  mas: {
    today: number;
    total: number;
  };
  cebs: {
    today: number;
    total: number;
  };
  solde: {
    today: number;
    total: number;
  };
  abonnes: {
    today: number;
    total: number;
  };
  chapelles: {
    today: number;
    total: number;
  };
  evenements: {
    today: number;
    total: number;
  };
  paroissiens: {
    today: number;
    total: number;
  };
  demande_de_messes: {
    today: number;
    total: number;
  };
}

export default function ParoisseDashboardPage() {
  const [showDetails, setShowDetails] = useState(false);

  type Paroisse = {
    [x: string]: any;
    nom?: string;
    statut?: string;
    quartier?: string;
    ville?: string;
    pays?: string;
    created_at?: string;
    id?: number; // ✅ Ajout de l'ID pour l'API stats
    cure?: {
      nom?: string;
      prenoms?: string;
    };
  };

  type UserProfile = {
    prenoms?: string;
    nom?: string;
    email?: string;
    role?: string;
    paroisse?: Paroisse;
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null); // ✅ Nouvel état pour les stats
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true); // ✅ Loading séparé pour les stats
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.cathoconnect.ci/api:35Re9Rls";
  const API_URL_STATISTIQUE =
    process.env.NEXT_PUBLIC_API_URL_STATISTIQUE ||
    "https://api.cathoconnect.ci/api:HzF8fFua";

  // ✅ Fonction pour récupérer les statistiques
  const fetchStats = async (paroisseId: number) => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await axios.get(`${API_URL_STATISTIQUE}/accueil/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          paroisse_id: paroisseId,
        },
      });

      setStatsData(response.data);
      setStatsLoading(false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des stats:", error);
      // On ne bloque pas l'interface si les stats échouent
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new Error("Token d'authentification non trouvé");
        }

        const response = await axios.get(`${API_URL}/admin/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.item;
        setUserProfile(profile);

        // ✅ Récupérer les stats après avoir obtenu le profil
        if (profile?.paroisse?.id) {
          fetchStats(profile.paroisse.id);
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Erreur lors de la récupération du profil:", error);
        setError(error.message || "Une erreur est survenue");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Fonction pour formater les montants en FCFA
  const formatCurrency = (amount: number | string | undefined) => {
    if (!amount && amount !== 0) return "0 FCFA";

    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    // Arrondir à 2 décimales pour éviter les problèmes de précision
    const roundedAmount = Math.round(numericAmount * 100) / 100;

    // Option 1 : Espaces (format français) - ACTUEL
    return (
      new Intl.NumberFormat("en-US", {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(roundedAmount) + " FCFA"
    );

    // Option 2 : Virgules (format américain) - décommentez si vous préférez
    // return new Intl.NumberFormat('en-US', {
    //   useGrouping: true,
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 2,
    // }).format(roundedAmount) + ' FCFA';
    // Résultat : "71,818.24 FCFA"

    // Option 3 : Points (format allemand) - décommentez si vous préférez
    // return new Intl.NumberFormat('de-DE', {
    //   useGrouping: true,
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 2,
    // }).format(roundedAmount).replace(',', '.') + ' FCFA';
    // Résultat : "71.818.24 FCFA"
  };

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

  // ✅ Composant Skeleton réutilisable
  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

  // ✅ Skeleton pour les cartes de stats
  const StatsCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );

  // ✅ Skeleton pour l'en-tête
  const HeaderSkeleton = () => (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
      <div className="flex items-center p-4">
        <Skeleton className="h-8 w-8 rounded-full mr-4" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 md:mt-0">
        <div className="flex items-start p-4">
          <Skeleton className="h-8 w-8 rounded-full mr-1" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <div className="flex items-start p-4">
          <Skeleton className="h-8 w-8 rounded-full mr-1" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );

  // Afficher les skeletons pendant le chargement
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <HeaderSkeleton />

        {/* Stats cards skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 px-6 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          <div className="lg:col-span-9">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
        <div className="flex items-center p-4">
          <Church className="h-8 w-8 text-slate-700 mr-4" />
          <div>
            <p className="text-xs font-medium text-slate-600">
              {paroisseData.statut || "Paroisse"}
            </p>
            <h1 className="text-[16px] font-bold text-slate-800">
              {paroisseData.nom || "Ma Paroisse"}
            </h1>
          </div>
        </div>

        <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 md:mt-0">
          <div className="flex items-start p-4">
            <User className="h-8 w-8 text-slate-700 mr-1 shrink-0" />
            <div>
              <p className="text-xs text-slate-700 font-medium">Curé</p>
              <h1 className="text-[16px] font-bold text-slate-800">
                {paroisseData.cure
                  ? `Père ${paroisseData.cure.nom} ${paroisseData.cure.prenoms}`
                  : "Non assigné"}
              </h1>
            </div>
          </div>

          <div className="flex items-start p-4">
            <MapPin className="h-8 w-8 text-slate-700 mr-1 shrink-0" />
            <div>
              <p className="text-xs text-slate-700 font-medium">Localisation</p>
              <h1 className="text-[16px] font-bold text-slate-800">
                {paroisseData.quartier || "Non spécifié"},{" "}
                {paroisseData.ville || "Non spécifié"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Les cartes de statistiques avec données réelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-6 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Paroissiens"
          value={
            statsLoading
              ? "..."
              : statsData?.paroissiens.total.toString() || "0"
          }
          trend="up"
          trendValue={statsData?.paroissiens.today.toString() || "0"}
          icon={<User className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Paroissiens Abonnés"
          value={
            statsLoading ? "..." : statsData?.abonnes.total.toString() || "0"
          }
          trend="up"
          trendValue={statsData?.abonnes.today.toString() || "0"}
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="M&A"
          value={statsLoading ? "..." : statsData?.mas.total.toString() || "0"}
          trend="up"
          trendValue={statsData?.mas.today.toString() || "0"}
          icon={<HandHelping className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="CEB"
          value={statsLoading ? "..." : statsData?.cebs.total.toString() || "0"}
          trend="up"
          trendValue={statsData?.cebs.today.toString() || "0"}
          icon={<Flower2 className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Demande de Messes"
          value={
            statsLoading
              ? "..."
              : statsData?.demande_de_messes.total.toString() || "0"
          }
          trend="up"
          trendValue={statsData?.demande_de_messes.today.toString() || "0"}
          icon={<HandHelping className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Solde"
          value={
            statsLoading
              ? "..."
              : formatCurrency(statsData?.solde.total) || "0 FCFA"
          }
          trend="up"
          trendValue={formatCurrency(statsData?.solde.today) || "0 FCFA"}
          icon={<PiggyBank className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Chapelles"
          value={
            statsLoading ? "..." : statsData?.chapelles.total.toString() || "0"
          }
          trend="up"
          trendValue={statsData?.chapelles.today.toString() || "0"}
          icon={<Church className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Evenements"
          value={
            statsLoading ? "..." : statsData?.evenements.total.toString() || "0"
          }
          trend="up"
          trendValue={statsData?.evenements.today.toString() || "0"}
          icon={<Calendar className="h-5 w-5 text-green-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Graphique plus grand (9/12 colonnes) */}
        <div className="lg:col-span-9">
          <ChartAreaInteractive paroisse_id={userProfile?.paroisse?.id || 1} />
        </div>

        {/* Événements à venir plus petit (3/12 colonnes) */}
        <div className="lg:col-span-3">
          <Card className="p-6 h-full">
            <h2 className="text-x font-bold mb-4">Événements à venir</h2>
            <EventsList />
          </Card>
        </div>
      </div>
    </div>
  );
}
