/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { Users, Building, Church, CreditCard, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

// URL de l'API
const API_URL = "https://api.cathoconnect.ci/api:35Re9Rls";


export default function DioceseDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dioceseData, setDioceseData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Récupérer les données du profil utilisateur
    const storedProfile = localStorage.getItem('user_profile');
    let profile = null;
    
    if (storedProfile) {
      try {
        profile = JSON.parse(storedProfile);
        setUserProfile(profile);
      } catch (error) {
        console.error("Erreur lors du parsing du profil utilisateur:", error);
      }
    }

    // Charger les données du dashboard
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupération du token depuis le localStorage
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        
        // Simuler un délai pour afficher l'animation de chargement (à supprimer en production)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Ici, vous pouvez ajouter des appels API pour récupérer les statistiques réelles
        // Exemple :
        // const response = await axios.get(`${API_URL}/diocese/stats`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setDioceseData(response.data);
        
        // Pour l'instant, nous utilisons des données fictives
        setDioceseData({
          nom: profile?.pseudo ? `Diocèse de ${profile.pseudo}` : "Diocèse",
          stats: {
            vicariats: 5,
            doyennes: 23,
            paroisses: 106,
            pretres: 245,
            budget: "8,5M €",
            serviteurs: 120,
            paroissiens: 5000,
            abonnees: 3000,
            nonAbonnes: 2000
          },
          sacrements: {
            baptemes: 3245,
            confirmations: 1876,
            mariages: 986,
            catechumenes: 423,
            funerailles: 2156
          },
          evenements: [
            {
              titre: "Confirmation cathédrale",
              date: "25 Mai 2025",
              lieu: "Présidée par Mgr l'Évêque"
            },
            {
              titre: "Synode diocésain",
              date: "15-16 Juin 2025",
              lieu: "Grand amphithéâtre diocésain"
            },
            {
              titre: "Formation permanente du clergé",
              date: "8-12 Juillet 2025",
              lieu: "Maison diocésaine"
            }
          ]
        });
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données du diocèse.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{dioceseData?.nom || "Diocèse"}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Vicariats"
          value={dioceseData?.stats.vicariats.toString() || "5"}
          icon={<Building className="h-5 w-5 text-indigo-600" />}
        />
        <StatsCard
          title="Doyennés"
          value={dioceseData?.stats.doyennes.toString() || "23"}
          icon={<Building className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Paroisses"
          value={dioceseData?.stats.paroisses.toString() || "106"}
          icon={<Church className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Quasi Paroisses"
          value={dioceseData?.stats.pretres.toString() || "245"}
          description="+8 cette année"
          icon={<Users className="h-5 w-5 text-amber-600" />}
          trend="up"
          trendValue="3.4%"
        />
        <StatsCard
          title="Chapelles"
          value={dioceseData?.stats.budget || "8,5M €"}
          description="2024-2025"
          icon={<Church className="h-5 w-5 text-red-600" />}
        />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Serviteurs"
          value={dioceseData?.stats.serviteurs.toString() || "5"}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
        />
        <StatsCard
          title="Paroissiens"
          value={dioceseData?.stats.paroissiens.toString() || "106"}
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Abonnés"
          value={dioceseData?.stats.abonnees.toString() || "106"}
          icon={<CreditCard className="h-5 w-5 text-green-600" />}
        />
         <StatsCard
          title="Abonnés"
          value={dioceseData?.stats.abonnees.toString() || "106"}
          icon={<CreditCard className="h-5 w-5 text-green-600" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Statistiques diocésaines</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Baptêmes cette année</span>
              <span className="font-medium">{dioceseData?.sacrements.baptemes.toLocaleString() || "3,245"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Confirmations</span>
              <span className="font-medium">{dioceseData?.sacrements.confirmations.toLocaleString() || "1,876"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Mariages</span>
              <span className="font-medium">{dioceseData?.sacrements.mariages.toLocaleString() || "986"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Catéchumènes</span>
              <span className="font-medium">{dioceseData?.sacrements.catechumenes.toLocaleString() || "423"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Funérailles</span>
              <span className="font-medium">{dioceseData?.sacrements.funerailles.toLocaleString() || "2,156"}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Événements diocésains</h2>
          <div className="space-y-3">
            {dioceseData?.evenements.map((event: any, index: number) => (
              <div key={index} className="p-3 border border-slate-200 rounded-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{event.titre}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{event.date}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{event.lieu}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-right">
            <Link href="/dashboard/diocese/evenements" className="text-sm text-blue-600 hover:text-blue-800">
              Voir tous les événements →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}