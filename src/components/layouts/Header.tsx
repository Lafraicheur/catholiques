/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Bell, Menu, MessageSquare, User, X, Settings, LogOut, Home } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [hasNotifications, setHasNotifications] = useState(true); // Simuler des notifications

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
        hasIndicator: hasNotifications,
        onClick: () => {
          /* Logique des notifications */
          setHasNotifications(false);
        },
      },
      {
        icon: MessageSquare,
        label: "Messages",
        hasIndicator: false,
        onClick: () => {
          /* Logique des messages */
        },
      },
    ],
    [hasNotifications]
  );
  
  // Déterminer le nom d'affichage de l'utilisateur
  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    if (userData?.pseudo) return userData.pseudo;
    if (userData?.email) return userData.email;
    return "Administrateur";
  }, [user, userData]);

  // Obtenir les initiales pour l'avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = useMemo(() => getInitials(displayName), [displayName]);
  
  // Obtenir une couleur basée sur le nom d'utilisateur (pour l'avatar)
  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-amber-500", "bg-pink-500", "bg-indigo-500"
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  const avatarColor = useMemo(() => getAvatarColor(displayName), [displayName]);

  return (
    <header 
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shadow-sm"
      role="banner"
    >
      <div className="flex items-center w-full">
        {/* Bouton Sidebar avec amélioration d'accessibilité */}
        <button
          onClick={toggleSidebar}
          className="p-2 mr-3 text-slate-600 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
          aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo et Titre */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3 text-white font-bold">
            C
          </div>
          <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
            CathoConnect
          </h1>
        </div>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center ml-auto space-x-1">
          {navigationButtons.map(({ icon: Icon, label, onClick, hasIndicator }) => (
            <div key={label} className="relative">
              <button
                onClick={onClick}
                className="p-2 text-slate-600 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
                aria-label={label}
              >
                <Icon size={18} />
              </button>
              {hasIndicator && (
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center ml-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
                aria-label="Menu utilisateur"
              >
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src={user?.avatar} alt={displayName} />
                  <AvatarFallback className={avatarColor}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={displayName} />
                  <AvatarFallback className={avatarColor}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{displayName}</div>
                  {userData?.email && (
                    <div className="text-xs text-slate-500 truncate max-w-[180px]">
                      {userData.email}
                    </div>
                  )}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="flex items-center cursor-pointer gap-2 py-2"
                onClick={() => router.push('/dashboard/paroisse/profile')}
              >
                <User size={16} className="text-slate-500" />
                <span>Profil</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex items-center cursor-pointer gap-2 py-2"
                onClick={() => router.push('/settings')}
              >
                <Settings size={16} className="text-slate-500" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              
              {userData?.statut && (
                <div className="px-2 py-2 flex items-center">
                  <span className="text-sm text-slate-500 mr-2">Statut:</span>
                  <Badge variant="outline" className="text-xs">
                    {userData.statut}
                  </Badge>
                </div>
              )}
              
              {userData?.role && (
                <div className="px-2 py-2 flex items-center">
                  <span className="text-sm text-slate-500 mr-2">Rôle:</span>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                    {userData.role}
                  </Badge>
                </div>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                className="flex items-center cursor-pointer gap-2 py-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onSelect={handleLogout}
                disabled={isLoading}
              >
                <LogOut size={16} />
                <span>{isLoading ? "Déconnexion en cours..." : "Déconnexion"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Mobile */}
        <div className="md:hidden ml-auto flex items-center">
          {/* Notifications */}
          <div className="relative mr-2">
            <button
              onClick={() => {
                setHasNotifications(false);
                /* Logique des notifications */
              }}
              className="p-2 text-slate-600 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            {hasNotifications && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
          
          {/* Menu utilisateur */}
          <button
            onClick={toggleMobileMenu}
            className="flex items-center p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu utilisateur"}
            aria-expanded={isMenuOpen}
          >
            <Avatar className="h-8 w-8 border border-slate-200">
              <AvatarImage src={user?.avatar} alt={displayName} />
              <AvatarFallback className={avatarColor}>
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div
          className="md:hidden absolute top-full right-0 w-full max-w-xs bg-white shadow-lg rounded-b-lg border border-t-0 border-slate-200 transition-all"
          role="menu"
        >
          <div className="flex flex-col p-3 space-y-1">
            <div className="flex items-center gap-3 p-2 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={displayName} />
                <AvatarFallback className={avatarColor}>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{displayName}</div>
                {userData?.email && (
                  <div className="text-xs text-slate-500 truncate max-w-[180px]">
                    {userData.email}
                  </div>
                )}
              </div>
            </div>
            
            <div className="h-px bg-slate-200 my-1"></div>
            
            <button 
              className="flex items-center p-3 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => router.push('/dashboard')}
              role="menuitem"
            >
              <Home size={16} className="mr-3 text-slate-500" />
              Dashboard
            </button>
            
            <button 
              className="flex items-center p-3 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => router.push('/dashboard/profile')}
              role="menuitem"
            >
              <User size={16} className="mr-3 text-slate-500" />
              Profil
            </button>
            
            <button 
              className="flex items-center p-3 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => router.push('/settings')}
              role="menuitem"
            >
              <Settings size={16} className="mr-3 text-slate-500" />
              Paramètres
            </button>
            
            <button 
              className="flex items-center p-3 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => {
                /* Logique des messages */
                toggleMobileMenu();
              }}
              role="menuitem"
            >
              <MessageSquare size={16} className="mr-3 text-slate-500" />
              Messages
            </button>
            
            <div className="h-px bg-slate-200 my-1"></div>
            
            {userData?.statut && (
              <div className="px-3 py-2 text-sm text-slate-500 flex items-center">
                <span className="mr-2">Statut:</span>
                <Badge variant="outline" className="text-xs">
                  {userData.statut}
                </Badge>
              </div>
            )}
            
            {userData?.role && (
              <div className="px-3 py-2 text-sm text-slate-500 flex items-center">
                <span className="mr-2">Rôle:</span>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                  {userData.role}
                </Badge>
              </div>
            )}
            
            <div className="h-px bg-slate-200 my-1"></div>
            
            <Button
              variant="destructive"
              className="w-full mt-2 flex items-center justify-center gap-2"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut size={16} />
              {isLoading ? "Déconnexion en cours..." : "Déconnexion"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}