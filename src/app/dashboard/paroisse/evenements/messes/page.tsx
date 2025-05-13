/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Download,
  Filter,
  MapPin,
  Plus,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";

export default function MessesPage() {
  const [activeTab, setActiveTab] = useState("toutes");

  // Données fictives pour les messes
  const messes = [
    {
      id: "1",
      date: "2025-05-18",
      heure: "10:30",
      type: "dominicale",
      lieu: "Église Saint-Joseph",
      celebrant: "Père Jean Dupont",
      intentions: [
        "Pour le repos de l'âme de Marie Martin",
        "Action de grâce pour la famille Dubois",
      ],
      equipe: [
        "Lecture: Antoine Leclerc",
        "Servants: Lucas et Julien",
        "Chants: Chorale Sainte-Cécile",
      ],
      statut: "confirmé",
    },
    {
      id: "2",
      date: "2025-05-18",
      heure: "18:00",
      type: "dominicale",
      lieu: "Chapelle Notre-Dame",
      celebrant: "Père Pierre Moreau",
      intentions: ["Pour la guérison de Thomas Bernard"],
      equipe: [
        "Lecture: Sophie Klein",
        "Servants: Léo et Nathan",
        "Chants: Groupe des jeunes",
      ],
      statut: "confirmé",
    },
    {
      id: "3",
      date: "2025-05-15",
      heure: "18:30",
      type: "semaine",
      lieu: "Église Saint-Joseph",
      celebrant: "Père Jean Dupont",
      intentions: [],
      equipe: ["Lecture: Marie-Claire Duval"],
      statut: "confirmé",
    },
    {
      id: "4",
      date: "2025-05-30",
      heure: "18:00",
      type: "fête",
      lieu: "Église Saint-Joseph",
      celebrant: "Monseigneur Robert Lefevre",
      intentions: ["Pour la communauté paroissiale"],
      equipe: [
        "Lecture: Équipe liturgique",
        "Servants: Tous les servants",
        "Chants: Chorale Sainte-Cécile",
      ],
      statut: "en préparation",
    },
    {
      id: "5",
      date: "2025-05-19",
      heure: "08:30",
      type: "semaine",
      lieu: "Chapelle Notre-Dame",
      celebrant: "Père Pierre Moreau",
      intentions: [],
      equipe: [],
      statut: "confirmé",
    },
  ];

  // Filtrer les messes en fonction de l'onglet actif
  const filteredMesses = messes.filter((messe) => {
    if (activeTab === "toutes") return true;
    if (activeTab === "dominicales") return messe.type === "dominicale";
    if (activeTab === "semaine") return messe.type === "semaine";
    if (activeTab === "fêtes") return messe.type === "fête";
    return true;
  });

  // Trier les messes par date
  const sortedMesses = [...filteredMesses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Grouper les messes par date
  const messesByDate = sortedMesses.reduce<Record<string, typeof messes>>(
    (acc, messe) => {
      const date = new Date(messe.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(messe);
      return acc;
    },
    {}
  );

  // Statistiques
  const stats = {
    total: messes.length,
    dominicales: messes.filter((m) => m.type === "dominicale").length,
    semaine: messes.filter((m) => m.type === "semaine").length,
    fetes: messes.filter((m) => m.type === "fête").length,
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "confirmé":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "en préparation":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Gestion des Messes
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button className="w-full xs:w-auto" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une messe
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total des messes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Messes programmées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Messes dominicales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dominicales}</div>
            <p className="text-xs text-muted-foreground">
              Dimanches et fêtes d'obligation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Messes en semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.semaine}</div>
            <p className="text-xs text-muted-foreground">Du lundi au samedi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Messes festives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fetes}</div>
            <p className="text-xs text-muted-foreground">
              Solennités et temps forts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une messe..."
              className="pl-10"
              type="search"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs
        defaultValue="toutes"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="toutes">Toutes</TabsTrigger>
          <TabsTrigger value="dominicales">Dominicales</TabsTrigger>
          <TabsTrigger value="semaine">Semaine</TabsTrigger>
          <TabsTrigger value="fêtes">Fêtes</TabsTrigger>
        </TabsList>

        <TabsContent value="toutes" className="mt-6">
          {Object.keys(messesByDate).length > 0 ? (
            Object.entries(messesByDate).map(([date, messesOfDay]) => (
              <div key={date} className="mb-8">
                <h3 className="mb-4 text-lg font-semibold capitalize">
                  {date}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {messesOfDay.map((messe) => (
                    <Card
                      key={messe.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={getStatusColor(messe.statut)}>
                                {messe.statut}
                              </Badge>
                              <Badge variant="outline">
                                {messe.type === "dominicale"
                                  ? "Dominicale"
                                  : messe.type === "semaine"
                                    ? "Semaine"
                                    : "Fête"}
                              </Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-lg font-semibold">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {messe.heure}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.lieu}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.celebrant}</span>
                              </div>
                            </div>

                            {messe.intentions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium">
                                  Intentions :
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc pl-5">
                                  {messe.intentions.map((intention, index) => (
                                    <li key={index}>{intention}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-start lg:items-end gap-2">
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/paroisse/evenements/messes/${messe.id}`}
                              >
                                <Button variant="default">
                                  Voir les détails
                                </Button>
                              </Link>
                              <Button variant="outline">Modifier</Button>
                            </div>

                            {messe.equipe.length > 0 && (
                              <div className="text-sm text-right">
                                <p className="font-medium">Équipe :</p>
                                <ul className="text-muted-foreground">
                                  {messe.equipe.map((membre, index) => (
                                    <li key={index}>{membre}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Aucune messe trouvée pour cette période.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="dominicales" className="mt-6">
          {/* Contenu identique à "toutes" mais filtré pour les messes dominicales */}
          {Object.keys(messesByDate).length > 0 ? (
            // Contenu identique à l'onglet "toutes"
            Object.entries(messesByDate).map(([date, messesOfDay]) => (
              <div key={date} className="mb-8">
                <h3 className="mb-4 text-lg font-semibold capitalize">
                  {date}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {messesOfDay.map((messe) => (
                    <Card
                      key={messe.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      {/* Contenu identique à l'onglet "toutes" */}
                      <CardContent className="p-6">
                        {/* ... (mêmes contenus) */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                          {/* ... (contenu similaire) */}
                          <div className="space-y-3">
                            {/* ... (contenu similaire) */}
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={getStatusColor(messe.statut)}>
                                {messe.statut}
                              </Badge>
                              <Badge variant="outline">Dominicale</Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-lg font-semibold">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {messe.heure}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.lieu}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.celebrant}</span>
                              </div>
                            </div>

                            {messe.intentions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium">
                                  Intentions :
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc pl-5">
                                  {messe.intentions.map((intention, index) => (
                                    <li key={index}>{intention}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-start lg:items-end gap-2">
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/paroisse/evenements/messes/${messe.id}`}
                              >
                                <Button variant="default">
                                  Voir les détails
                                </Button>
                              </Link>
                              <Button variant="outline">Modifier</Button>
                            </div>

                            {messe.equipe.length > 0 && (
                              <div className="text-sm text-right">
                                <p className="font-medium">Équipe :</p>
                                <ul className="text-muted-foreground">
                                  {messe.equipe.map((membre, index) => (
                                    <li key={index}>{membre}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Aucune messe dominicale trouvée pour cette période.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="semaine" className="mt-6">
          {/* Contenu similaire filtré pour les messes de semaine */}
          {Object.keys(messesByDate).length > 0 ? (
            Object.entries(messesByDate).map(([date, messesOfDay]) => (
              <div key={date} className="mb-8">
                <h3 className="mb-4 text-lg font-semibold capitalize">
                  {date}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {messesOfDay.map((messe) => (
                    <Card
                      key={messe.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        {/* Contenu similaire */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={getStatusColor(messe.statut)}>
                                {messe.statut}
                              </Badge>
                              <Badge variant="outline">Semaine</Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-lg font-semibold">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {messe.heure}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.lieu}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.celebrant}</span>
                              </div>
                            </div>

                            {messe.intentions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium">
                                  Intentions :
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc pl-5">
                                  {messe.intentions.map((intention, index) => (
                                    <li key={index}>{intention}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-start lg:items-end gap-2">
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/paroisse/evenements/messes/${messe.id}`}
                              >
                                <Button variant="default">
                                  Voir les détails
                                </Button>
                              </Link>
                              <Button variant="outline">Modifier</Button>
                            </div>

                            {messe.equipe.length > 0 && (
                              <div className="text-sm text-right">
                                <p className="font-medium">Équipe :</p>
                                <ul className="text-muted-foreground">
                                  {messe.equipe.map((membre, index) => (
                                    <li key={index}>{membre}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Aucune messe de semaine trouvée pour cette période.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="fêtes" className="mt-6">
          {/* Contenu similaire filtré pour les messes de fêtes */}
          {Object.keys(messesByDate).length > 0 ? (
            Object.entries(messesByDate).map(([date, messesOfDay]) => (
              <div key={date} className="mb-8">
                <h3 className="mb-4 text-lg font-semibold capitalize">
                  {date}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {messesOfDay.map((messe) => (
                    <Card
                      key={messe.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        {/* Contenu similaire */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={getStatusColor(messe.statut)}>
                                {messe.statut}
                              </Badge>
                              <Badge variant="outline">Fête</Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-lg font-semibold">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {messe.heure}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.lieu}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{messe.celebrant}</span>
                              </div>
                            </div>

                            {messe.intentions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium">
                                  Intentions :
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc pl-5">
                                  {messe.intentions.map((intention, index) => (
                                    <li key={index}>{intention}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-start lg:items-end gap-2">
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/paroisse/evenements/messes/${messe.id}`}
                              >
                                <Button variant="default">
                                  Voir les détails
                                </Button>
                              </Link>
                              <Button variant="outline">Modifier</Button>
                            </div>

                            {messe.equipe.length > 0 && (
                              <div className="text-sm text-right">
                                <p className="font-medium">Équipe :</p>
                                <ul className="text-muted-foreground">
                                  {messe.equipe.map((membre, index) => (
                                    <li key={index}>{membre}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Aucune messe de fête trouvée pour cette période.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
