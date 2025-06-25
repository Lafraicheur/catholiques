/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";

// URL de l'API
const API_URL = "https://api.cathoconnect.ci/api:35Re9Rls";

// Schéma de validation
const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

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
          Vérification de l'authentification...
        </p>
      </div>
    </div>
  </div>
);

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Définir le formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Fonction pour vérifier si l'utilisateur est déjà connecté
  const checkExistingAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const userProfile = localStorage.getItem("user_profile");

      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      // Vérifier la validité du token en appelant l'API
      const response = await axios.get(`${API_URL}/admin/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const adminProfile = response.data?.item;

      if (adminProfile) {
        // L'utilisateur est déjà connecté, rediriger vers son dashboard
        let route = "paroisse"; // Route par défaut

        if (adminProfile.entite) {
          const entite = adminProfile.entite.toLowerCase();
          const routeMapping: Record<string, string> = {
            diocese: "diocese",
            vicariat: "vicariat",
            doyenne: "doyenne",
            paroisse: "paroisse",
          };
          route = routeMapping[entite] || "paroisse";
        }

        toast.info("Déjà connecté", {
          description: `Redirection vers votre tableau de bord...`,
          duration: 2000,
        });

        // Redirection immédiate
        router.replace(`/dashboard/${route}`);
        return;
      }
    } catch (error) {
      // Token invalide ou expiré, nettoyer le localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_profile");
      console.log("Token expiré ou invalide, nettoyage effectué");
    }

    setIsCheckingAuth(false);
  };

  // Vérifier l'authentification au chargement du composant
  useEffect(() => {
    checkExistingAuth();
  }, []);

  // Gérer la soumission du formulaire
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Connexion via l'API avec en-têtes CORS
      const loginResponse = await axios.post(
        `${API_URL}/user/auth/login`,
        {
          email: values.email,
          password: values.password,
          type: "email",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );

      const authToken = loginResponse.data.authToken;

      if (!authToken) {
        throw new Error("Token d'authentification non reçu");
      }

      // Stocker le token dans le localStorage
      localStorage.setItem("auth_token", authToken);

      try {
        // Récupération du profil administrateur
        const profileResponse = await axios.get(`${API_URL}/admin/auth/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const adminProfile = profileResponse.data?.item;

        if (adminProfile) {
          // Stocker les infos de l'utilisateur
          localStorage.setItem("user_profile", JSON.stringify(adminProfile));

          // Vérifier si le entite existe avant d'appeler toLowerCase()
          let route = "paroisse"; // Route par défaut

          if (adminProfile.entite) {
            const entite = adminProfile.entite.toLowerCase();
            const routeMapping: Record<string, string> = {
              diocese: "diocese",
              vicariat: "vicariat",
              doyenne: "doyenne",
              paroisse: "paroisse",
            };
            route = routeMapping[entite] || "paroisse";
          } else {
            console.warn("Le profil administrateur n'a pas de entite défini");
          }

          // Utiliser le toast de Sonner
          toast.success("Connexion réussie", {
            description: `Bienvenue, ${adminProfile.pseudo || adminProfile.email || "Administrateur"}`,
            duration: 3000,
          });

          // Attendre un court délai avant la redirection
          setTimeout(() => {
            // Utiliser replace au lieu de push pour éviter le retour en arrière
            router.replace(`/dashboard/${route}`);
          }, 1500); // Délai de 1.5 secondes
        } else {
          throw new Error("Profil administrateur incomplet");
        }
      } catch (profileError: any) {
        console.error(
          "Erreur lors de la récupération du profil:",
          profileError
        );
        console.error("Message d'erreur:", profileError.message);
        if (profileError.response) {
          console.error("Réponse d'erreur:", profileError.response.data);
          console.error("Status:", profileError.response.status);
        }

        // Utiliser le toast de Sonner pour l'avertissement
        toast.warning("Connexion partielle", {
          description:
            "Identifié, mais impossible de récupérer votre profil complet. Fonctionnalités limitées.",
          duration: 5000,
        });

        // Redirection par défaut avec délai
        setTimeout(() => {
          router.replace("/dashboard/paroisse");
        }, 2000);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        toast.error("Accès refusé", {
          description: "Vérifiez vos identifiants de connexion",
          duration: 5000,
        });
      } else {
        toast.error("Échec de connexion", {
          description: "Serveur indisponible. Veuillez réessayer.",
          duration: 5000,
        });
      }

      setIsLoading(false);
    }
  }

  // Si en vérification d'authentification, afficher l'animation
  if (isCheckingAuth || isLoading) {
    return <LoadingAnimation />;
  }

  // Sinon, afficher le formulaire
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="votre.email@exemple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </Form>
  );
}
