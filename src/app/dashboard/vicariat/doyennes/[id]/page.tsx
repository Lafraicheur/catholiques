/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Edit, Trash, Building, MapPin, Phone, Mail, User, 
  Calendar, Church, MessageSquare, Clock, Users, File 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface DoyenneDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Interface pour les données du doyenné
interface Doyenne {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  doyen: {
    nom: string;
    email: string;
    telephone: string;
    depuis: string;
    photo: string | null;
  };
  vicariat: string;
  dateCreation: string;
  description: string;
  paroisses: Array<{
    id: string;
    nom: string;
    adresse: string;
    cure: string;
  }>;
  statut: string;
  evenements: Array<{
    id: string;
    titre: string;
    date: string;
    heure: string;
    lieu: string;
  }>;
  statistiques: {
    nbParoissiens: number;
    nbCatechises: number;
    nbBaptemes: number;
    nbMariages: number;
    nbPretres: number;
    nbDiacres: number;
    nbCommunautes: number;
  };
}

// Simulation de la récupération des données d'un doyenné
const getDoyenne = (id: string): Doyenne | undefined => {
  // Dans une application réelle, vous feriez un appel API ici
  const doyennes: Doyenne[] = [
    {
      id: "1",
      nom: "Doyenné Centre",
      adresse: "24 avenue de la Cathédrale, 75001 Paris",
      telephone: "01 42 36 12 34",
      email: "doyen.centre@diocese.fr",
      doyen: {
        nom: "Père Thomas Bernard",
        email: "t.bernard@diocese.fr",
        telephone: "06 12 34 56 78",
        depuis: "2022-09-01",
        photo: null
      },
      vicariat: "Vicariat Nord",
      dateCreation: "1985-03-15",
      description: "Le doyenné Centre regroupe les paroisses du centre-ville de Paris. Il est caractérisé par une forte densité de population, une grande diversité sociale et culturelle, et une présence importante de commerces et services.",
      paroisses: [
        { id: "1", nom: "Paroisse Saint-Joseph", adresse: "12 rue des Églises, 75001 Paris", cure: "Père Jean Dupont" },
        { id: "2", nom: "Paroisse Notre-Dame", adresse: "24 avenue de la Cathédrale, 75001 Paris", cure: "Père Thomas Bernard" },
        { id: "3", nom: "Paroisse Saint-Pierre", adresse: "3 rue des Apôtres, 75001 Paris", cure: "Père Michel Martin" },
        { id: "4", nom: "Paroisse Sainte-Anne", adresse: "15 rue Sainte-Anne, 75001 Paris", cure: "Père François Dubois" },
        { id: "5", nom: "Paroisse Saint-Paul", adresse: "42 rue Saint-Paul, 75002 Paris", cure: "Père Louis Moreau" },
        { id: "6", nom: "Paroisse Saint-Jean", adresse: "18 rue Saint-Jean, 75002 Paris", cure: "Père Jacques Petit" },
        { id: "7", nom: "Paroisse Sainte-Marie", adresse: "29 rue Sainte-Marie, 75002 Paris", cure: "Père Paul Leroy" },
        { id: "8", nom: "Paroisse Saint-Michel", adresse: "35 rue Saint-Michel, 75003 Paris", cure: "Père Antoine Girard" }
      ],
      statut: "actif",
      evenements: [
        { id: "1", titre: "Réunion des curés", date: "2025-05-20", heure: "10:00", lieu: "Maison du doyenné" },
        { id: "2", titre: "Formation liturgique", date: "2025-06-02", heure: "14:30", lieu: "Paroisse Saint-Joseph" },
        { id: "3", titre: "Veillée de prière pour les vocations", date: "2025-06-15", heure: "20:00", lieu: "Paroisse Notre-Dame" }
      ],
      statistiques: {
        nbParoissiens: 12500,
        nbCatechises: 850,
        nbBaptemes: 320,
        nbMariages: 96,
        nbPretres: 16,
        nbDiacres: 8,
        nbCommunautes: 24
      }
    },
    {
      id: "2",
      nom: "Doyenné Est",
      adresse: "15 rue de l'Est, 75020 Paris",
      telephone: "01 42 38 45 67",
      email: "doyen.est@diocese.fr",
      doyen: {
        nom: "Père Jacques Martin",
        email: "j.martin@diocese.fr",
        telephone: "06 23 45 67 89",
        depuis: "2021-06-01",
        photo: null
      },
      vicariat: "Vicariat Nord",
      dateCreation: "1990-09-08",
      description: "Le doyenné Est regroupe les paroisses de l'est parisien. Ces paroisses sont situées dans des quartiers populaires et multiculturels, avec une forte présence de jeunes familles et une vie associative dynamique.",
      paroisses: [
        { id: "9", nom: "Paroisse Saint-Germain", adresse: "5 place Saint-Germain, 75020 Paris", cure: "Père Emmanuel Duval" },
        { id: "10", nom: "Paroisse Sainte-Thérèse", adresse: "12 rue Sainte-Thérèse, 75020 Paris", cure: "Père Jacques Martin" },
        { id: "11", nom: "Paroisse Saint-Luc", adresse: "8 avenue Saint-Luc, 75020 Paris", cure: "Père Simon Legrand" },
        { id: "12", nom: "Paroisse Saint-Marc", adresse: "25 rue Saint-Marc, 75020 Paris", cure: "Père Matthieu Blanc" },
        { id: "13", nom: "Paroisse Saint-Matthieu", adresse: "33 boulevard Saint-Matthieu, 75020 Paris", cure: "Père Luc Mercier" }
      ],
      statut: "actif",
      evenements: [
        { id: "4", titre: "Conseil doyenné", date: "2025-05-25", heure: "18:00", lieu: "Maison du doyenné" },
        { id: "5", titre: "Rencontre des catéchistes", date: "2025-06-08", heure: "09:30", lieu: "Paroisse Saint-Germain" }
      ],
      statistiques: {
        nbParoissiens: 9800,
        nbCatechises: 720,
        nbBaptemes: 245,
        nbMariages: 73,
        nbPretres: 11,
        nbDiacres: 6,
        nbCommunautes: 18
      }
    }
  ];

  return doyennes.find(d => d.id === id);
};

// Formatage de la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Formater le statut pour Badge
const getStatusBadge = (statut: string) => {
  switch (statut) {
    case "actif":
      return <Badge variant="success">Actif</Badge>;
    case "inactif":
      return <Badge variant="secondary">Inactif</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};

export default function DoyenneDetailPage({ params }: DoyenneDetailPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [doyenne, setDoyenne] = useState<Doyenne | null>(null);
  const [loading, setLoading] = useState(true);

  // Résoudre les params asynchrones
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
        
        // Une fois les params résolus, récupérer le doyenné
        const doyenneData = getDoyenne(resolved.id);
        setDoyenne(doyenneData || null);
      } catch (err) {
        console.error("Erreur lors de la résolution des paramètres:", err);
      } finally {
        setLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-500">Chargement du doyenné...</p>
        </div>
      </div>
    );
  }

  if (!doyenne) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Doyenné non trouvé</h1>
        <p className="text-slate-600 mb-6">Le doyenné que vous recherchez n'existe pas.</p>
        <Link href="/dashboard/vicariat/doyennes" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/vicariat/doyennes" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {doyenne.nom}
          </h1>
          <div className="ml-2">
            {getStatusBadge(doyenne.statut)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Adresse</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {doyenne.adresse}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Contact</p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    {doyenne.telephone}
                  </p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                    <a href={`mailto:${doyenne.email}`} className="text-blue-600 hover:underline">
                      {doyenne.email}
                    </a>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Vicariat</p>
                  <p className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-slate-400" />
                    {doyenne.vicariat}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Date de création</p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {formatDate(doyenne.dateCreation)}
                  </p>
                </div>
                <div className="space-y-1 col-span-full">
                  <p className="text-sm font-medium text-slate-500">Description</p>
                  <p className="text-slate-700">
                    {doyenne.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paroisses du doyenné</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">Nom</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">Adresse</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">Curé</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doyenne.paroisses.map((paroisse) => (
                      <tr key={paroisse.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{paroisse.nom}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{paroisse.adresse}</td>
                        <td className="py-3 px-4 text-slate-700">{paroisse.cure}</td>
                        <td className="py-3 px-4 text-right">
                          <a 
                            href={`/dashboard/paroisse?id=${paroisse.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Voir la paroisse
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doyenne.evenements.map((evenement) => (
                  <div 
                    key={evenement.id} 
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-md hover:bg-slate-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{evenement.titre}</h3>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(evenement.date)}
                          <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
                          {evenement.heure}
                          <MapPin className="h-3.5 w-3.5 ml-2 mr-1" />
                          {evenement.lieu}
                        </div>
                      </div>
                    </div>
                    <a 
                      href={`/dashboard/doyenne/evenements/${evenement.id}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-4 py-2"
                    >
                      Détails
                    </a>
                  </div>
                ))}

                {doyenne.evenements.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Aucun événement prévu.
                  </div>
                )}

                <div className="mt-4 text-right">
                  <Link href="/dashboard/doyenne/evenements" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir tous les événements →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Doyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-4">
                <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{doyenne.doyen.nom}</h3>
                <p className="text-sm text-slate-500">Doyen depuis {formatDate(doyenne.doyen.depuis)}</p>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Email</span>
                  <a href={`mailto:${doyenne.doyen.email}`} className="text-sm text-blue-600 hover:underline">
                    {doyenne.doyen.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Téléphone</span>
                  <a href={`tel:${doyenne.doyen.telephone}`} className="text-sm text-blue-600 hover:underline">
                    {doyenne.doyen.telephone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Nombre de paroisses</span>
                  <span className="font-medium">{doyenne.paroisses.length}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Paroissiens</span>
                  <span className="font-medium">{doyenne.statistiques.nbParoissiens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Enfants catéchisés</span>
                  <span className="font-medium">{doyenne.statistiques.nbCatechises.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Baptêmes (année en cours)</span>
                  <span className="font-medium">{doyenne.statistiques.nbBaptemes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Mariages (année en cours)</span>
                  <span className="font-medium">{doyenne.statistiques.nbMariages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Prêtres</span>
                  <span className="font-medium">{doyenne.statistiques.nbPretres.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Diacres</span>
                  <span className="font-medium">{doyenne.statistiques.nbDiacres.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Communautés ecclésiales</span>
                  <span className="font-medium">{doyenne.statistiques.nbCommunautes.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contacter le doyen
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" /> Réunion des curés
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" /> Ajouter un événement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <File className="mr-2 h-4 w-4" /> Rapport d'activité
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communications récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Préparation du Conseil Pastoral</p>
                    <p className="text-xs text-slate-500">Envoyé par le doyen aux curés</p>
                    <p className="text-xs text-slate-400 mt-1">Il y a 3 jours</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rappel formation liturgique</p>
                    <p className="text-xs text-slate-500">Envoyé aux équipes liturgiques</p>
                    <p className="text-xs text-slate-400 mt-1">Il y a 1 semaine</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-right">
                <Link href="/dashboard/vicariat/communications" className="text-sm text-blue-600 hover:text-blue-800">
                  Voir toutes les communications →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}