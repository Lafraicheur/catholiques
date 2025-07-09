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
    <p>Vicariats</p>
    </div>
  );
}