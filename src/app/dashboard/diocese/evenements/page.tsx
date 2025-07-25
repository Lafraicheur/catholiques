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

// Composant d'animation de chargement
const LoadingAnimation = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 fixed inset-0 z-50">
    <div className="animate-pulse text-lg font-medium text-indigo-600">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 mb-3 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            {/* Fond circulaire */}
            <circle cx="100" cy="100" r="90" fill="#4F46E5" />
            <circle cx="100" cy="100" r="80" fill="#ffffff" />
            {/* Graphique et éléments de budget */}
            <path
              d="M50 120 L60 100 L80 110 L100 70 L120 90 L140 60 L150 80"
              stroke="#4F46E5"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Symbole dollar */}
            <g transform="translate(100, 130)">
              <circle cx="0" cy="0" r="30" fill="#4F46E5" />
              <path
                d="M-7 -10 L7 -10 M-7 10 L7 10 M0 -20 L0 20"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M0 -15 L0 15"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
            {/* Points pour le graphique */}
            <circle cx="60" cy="100" r="4" fill="#4F46E5" />
            <circle cx="80" cy="110" r="4" fill="#4F46E5" />
            <circle cx="100" cy="70" r="4" fill="#4F46E5" />
            <circle cx="120" cy="90" r="4" fill="#4F46E5" />
            <circle cx="140" cy="60" r="4" fill="#4F46E5" />
          </svg>
        </div>
        <p className="text-indigo-600 font-medium">
          Chargement des données...
        </p>
      </div>
    </div>
  </div>
);

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
<p>Evenement</p>
    </div>
  );
}