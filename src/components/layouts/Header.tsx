/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Bell, Menu, MessageSquare, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

// URL de l'API
const API_URL = "https://api.cathoconnect.ci/api:35Re9Rls";

// Fonction de déconnexion
const logout = async (token: string) => {
  try {
    await axios.get(`${API_URL}/user/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Supprimer le token et les infos utilisateur du localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
  } catch (error) {
    // Même en cas d'erreur, on supprime le token local
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    throw error;
  }
};

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  user?: {
    name?: string;
    avatar?: string;
  };
}

export default function Header({
  toggleSidebar,
  isSidebarOpen,
  user,
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();

  // Charger le profil utilisateur depuis le localStorage au chargement du composant
  useEffect(() => {
    const storedUserProfile = localStorage.getItem('user_profile');
    if (storedUserProfile) {
      try {
        const parsedProfile = JSON.parse(storedUserProfile);
        setUserData(parsedProfile);
      } catch (error) {
        console.error("Erreur lors du parsing du profil utilisateur:", error);
      }
    }
  }, []);

  // Optimisation avec useCallback
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        // Appel de la fonction de déconnexion avec le token
        await logout(token);
      } else {
        // Si pas de token, on nettoie quand même le localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
      }

      // Affichage d'un toast de confirmation
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
        variant: "success",
      });

      // Redirection
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
      
      // Redirection vers la page de connexion même en cas d'erreur
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  // Gestion du toggle de menu mobile
  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Memoization des boutons pour optimiser les rendus
  const navigationButtons = useMemo(
    () => [
      {
        icon: Bell,
        label: "Notifications",
        onClick: () => {
          /* Logique des notifications */
        },
      },
      {
        icon: MessageSquare,
        label: "Messages",
        onClick: () => {
          /* Logique des messages */
        },
      },
    ],
    []
  );
  
  // Déterminer le nom d'affichage de l'utilisateur
  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    if (userData?.pseudo) return userData.pseudo;
    if (userData?.email) return userData.email;
    return "Administrateur";
  }, [user, userData]);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200"
      role="banner"
    >
      <div className="flex items-center w-full">
        {/* Bouton Sidebar avec amélioration d'accessibilité */}
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 text-slate-600 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Titre */}
        <h1 className="text-lg md:text-xl font-semibold text-slate-800 truncate">
          Dashboard Église Catholique
        </h1>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center ml-auto space-x-4">
          {navigationButtons.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="p-2 text-slate-600 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label={label}
            >
              <Icon size={20} />
            </button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300"
                aria-label="Menu utilisateur"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar utilisateur"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                    <User size={16} className="text-slate-600" />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                {`Bonjour, ${displayName}`}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>Profil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>Paramètres</DropdownMenuItem>
              {userData?.statut && (
                <DropdownMenuItem>
                  Statut: {userData.statut}
                </DropdownMenuItem>
              )}
              {userData?.role && (
                <DropdownMenuItem>
                  Rôle: {userData.role}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:bg-red-50"
                onSelect={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? "Déconnexion en cours..." : "Déconnexion"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Mobile */}
        <div className="md:hidden ml-auto">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-600 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label={
              isMenuOpen ? "Fermer le menu" : "Ouvrir le menu utilisateur"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <User size={20} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg"
          role="menu"
        >
          <div className="flex flex-col p-4 space-y-2">
            <div className="px-2 py-1 font-medium">
              {`Bonjour, ${displayName}`}
            </div>
            {navigationButtons.map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center p-2 hover:bg-slate-100"
                role="menuitem"
              >
                <Icon size={20} className="mr-2" />
                {label}
              </button>
            ))}
            <button 
              className="flex items-center p-2 hover:bg-slate-100"
              onClick={() => router.push('/dashboard/profile')}
            >
              <User size={20} className="mr-2" />
              Profil
            </button>
            {userData?.statut && (
              <div className="px-2 py-1 text-sm text-slate-500">
                Statut: {userData.statut}
              </div>
            )}
            {userData?.role && (
              <div className="px-2 py-1 text-sm text-slate-500">
                Rôle: {userData.role}
              </div>
            )}
            <Button
              variant="destructive"
              className="w-full mt-2"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? "Déconnexion en cours..." : "Déconnexion"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}