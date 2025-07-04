/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Save, User, Mail, Phone, MapPin, Building, Shield, Calendar, X, CheckCircle } from "lucide-react";
import axios from "axios";

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

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
        // Récupération du token depuis le localStorage
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter pour accéder à votre profil.",
            variant: "destructive",
          });
          router.push('/login');
          return;
        }

        // Récupération du profil depuis l'API
        try {
          const response = await axios.get(`${API_URL}/admin/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.data && response.data.item) {
            const profileData = response.data.item;
            setProfile(profileData);
            setEditedProfile(profileData);
            
            // Mettre à jour le localStorage
            localStorage.setItem('user_profile', JSON.stringify(profileData));
          } else {
            throw new Error("Données de profil incomplètes");
          }
        } catch (apiError) {
          console.error("Erreur lors de la récupération du profil depuis l'API:", apiError);
          
          // Si l'API échoue, essayer de récupérer depuis le localStorage
          const storedProfile = localStorage.getItem('user_profile');
          if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile);
            setProfile(parsedProfile);
            setEditedProfile(parsedProfile);
          } else {
            throw new Error("Aucun profil trouvé");
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger votre profil. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        // Simuler un délai pour l'affichage de l'animation
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    loadProfile();
  }, [router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Récupération du token depuis le localStorage
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }
      
      // Simuler un appel API pour sauvegarder les modifications
      // Dans une application réelle, vous feriez un appel à l'API
      // Exemple :
      // await axios.put(`${API_URL}/admin/profile`, editedProfile, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simuler un délai pour l'enregistrement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour le profil
      setProfile(editedProfile);
      
      // Mettre à jour le localStorage
      localStorage.setItem('user_profile', JSON.stringify(editedProfile));
      
      toast({
        title: "Profil mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
        variant: "success",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifiée";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" /> Annuler
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <>Enregistrement...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Enregistrer
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="informations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="informations">Informations personnelles</TabsTrigger>
          <TabsTrigger value="account">Compte & Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="informations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:row-span-2">
              <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-slate-400" />
                </div>
                
                {isEditing && (
                  <Button variant="outline" className="mt-2 w-full">
                    Changer la photo
                  </Button>
                )}
                
                <div className="mt-6 w-full">
                  <h3 className="font-medium text-center text-lg">
                    {profile?.pseudo || profile?.email}
                  </h3>
                  <p className="text-slate-500 text-center text-sm mt-1">
                    {profile?.role || "Administrateur"}
                  </p>
                  <div className="flex justify-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {profile?.statut || "Utilisateur"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="pseudo">Nom d'utilisateur</Label>
                        <Input
                          id="pseudo"
                          name="pseudo"
                          value={editedProfile?.pseudo || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={editedProfile?.email || ""}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          name="telephone"
                          value={editedProfile?.telephone || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input
                          id="adresse"
                          name="adresse"
                          value={editedProfile?.adresse || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Nom d'utilisateur</Label>
                        <p className="flex items-center text-slate-900">
                          <User className="h-4 w-4 text-slate-400 mr-2" />
                          {profile?.pseudo || "Non spécifié"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Email</Label>
                        <p className="flex items-center text-slate-900">
                          <Mail className="h-4 w-4 text-slate-400 mr-2" />
                          {profile?.email || "Non spécifié"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Téléphone</Label>
                        <p className="flex items-center text-slate-900">
                          <Phone className="h-4 w-4 text-slate-400 mr-2" />
                          {profile?.telephone || "Non spécifié"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Adresse</Label>
                        <p className="flex items-center text-slate-900">
                          <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                          {profile?.adresse || "Non spécifiée"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Informations professionnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Statut</Label>
                    <p className="flex items-center text-slate-900">
                      <Building className="h-4 w-4 text-slate-400 mr-2" />
                      {profile?.statut || "Non spécifié"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Rôle</Label>
                    <p className="flex items-center text-slate-900">
                      <Shield className="h-4 w-4 text-slate-400 mr-2" />
                      {profile?.role || "Non spécifié"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Date d'inscription</Label>
                    <p className="flex items-center text-slate-900">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      {formatDate(profile?.created_at) || "Non spécifiée"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">ID Utilisateur</Label>
                    <p className="flex items-center text-slate-900">
                      <User className="h-4 w-4 text-slate-400 mr-2" />
                      {profile?.id || "Non spécifié"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez vos informations de connexion et sécurité.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Mot de passe</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Mot de passe défini</span>
                      </div>
                      <Button variant="outline">Changer le mot de passe</Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-lg font-medium">Sessions actives</h3>
                    <div className="mt-2">
                      <div className="p-3 border border-slate-200 rounded-md mb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Session actuelle</h4>
                            <p className="text-sm text-slate-500">Navigateur: Chrome sur Windows</p>
                            <p className="text-xs text-slate-400">IP: 192.168.1.1 · Dernière activité: Maintenant</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Actif
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-lg font-medium">Options de sécurité</h3>
                    <div className="mt-4 space-y-4">
                      <Button variant="destructive" className="w-full">
                        Déconnexion de toutes les sessions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}