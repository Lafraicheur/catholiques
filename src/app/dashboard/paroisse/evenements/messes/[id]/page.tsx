/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Download,
  Edit,
  File,
  MapPin,
  MessageSquare,
  Music,
  Phone,
  Printer,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function MesseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Utiliser React.use pour déballer la promesse params
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("informations");

  // Données fictives pour la messe sélectionnée
  const messe = {
    id,
    date: "2025-05-18",
    heure: "10:30",
    type: "dominicale",
    lieu: "Église Saint-Joseph",
    celebrant: "Père Jean Dupont",
    contact_celebrant: "+225 01 23 45 67 89",
    intentions: [
      "Pour le repos de l'âme de Marie Martin",
      "Action de grâce pour la famille Dubois"
    ],
    equipe: [
      { role: "Lecteur 1", nom: "Antoine Leclerc", contact: "+225 01 23 45 67 90" },
      { role: "Lecteur 2", nom: "Amélie Renaud", contact: "+225 01 23 45 67 91" },
      { role: "Servant 1", nom: "Lucas Moreau", contact: "" },
      { role: "Servant 2", nom: "Julien Bernard", contact: "" },
      { role: "Chorale", nom: "Sainte-Cécile", contact: "+225 01 23 45 67 92" },
    ],
    lectures: [
      { type: "Première lecture", reference: "Actes 10, 25-26.34-35.44-48", texte: "Comme Pierre arrivait à Césarée..." },
      { type: "Psaume", reference: "Ps 97, 1-4", texte: "Chantez au Seigneur un chant nouveau..." },
      { type: "Deuxième lecture", reference: "1 Jn 4, 7-10", texte: "Bien-aimés, aimons-nous les uns les autres..." },
      { type: "Évangile", reference: "Jn 15, 9-17", texte: "En ce temps-là, Jésus disait à ses disciples..." },
    ],
    chants: [
      { moment: "Entrée", titre: "Jubilez, criez de joie", reference: "Y25-15", partition: true },
      { moment: "Kyrie", titre: "Messe de Saint Paul", reference: "", partition: true },
      { moment: "Gloria", titre: "Messe de Saint Paul", reference: "", partition: true },
      { moment: "Psaume", titre: "Le Seigneur a fait connaître sa victoire", reference: "", partition: true },
      { moment: "Acclamation", titre: "Alleluia Irlandais", reference: "", partition: true },
      { moment: "Offertoire", titre: "Je viens vers toi, Jésus", reference: "DEV 495", partition: true },
      { moment: "Sanctus", titre: "Messe de Saint Paul", reference: "", partition: true },
      { moment: "Anamnèse", titre: "Messe de Saint Paul", reference: "", partition: true },
      { moment: "Agneau de Dieu", titre: "Messe de Saint Paul", reference: "", partition: true },
      { moment: "Communion", titre: "Venez, approchons-nous", reference: "IEV 19-19", partition: true },
      { moment: "Envoi", titre: "Allez par toute la terre", reference: "T20-76", partition: true },
    ],
    documents: [
      { nom: "Feuille de messe", type: "PDF", lien: "#" },
      { nom: "Partition chorale", type: "PDF", lien: "#" },
      { nom: "Planning servants", type: "XLSX", lien: "#" },
    ],
    taches: [
      { description: "Préparer l'autel", responsable: "Équipe florale", statut: "terminé" },
      { description: "Imprimer les feuilles de messe", responsable: "Secrétariat", statut: "terminé" },
      { description: "Répéter avec la chorale", responsable: "Chef de chœur", statut: "en cours" },
      { description: "Préparer les hosties et le vin", responsable: "Sacristain", statut: "à faire" },
      { description: "Vérifier le système de sonorisation", responsable: "Technicien", statut: "à faire" },
    ],
    statut: "confirmé",
  };

  // Fonction pour calculer le progrès des tâches
  const calculateProgress = () => {
    if (messe.taches.length === 0) return 100;
    const completed = messe.taches.filter(t => t.statut === "terminé").length;
    return Math.round((completed / messe.taches.length) * 100);
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "terminé":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "en cours":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "à faire":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "confirmé":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  // Formatage de la date
  const date = new Date(messe.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/paroisse/evenements/messes">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            </Link>
            <Badge className={getStatusColor(messe.statut)}>{messe.statut}</Badge>
            <Badge variant="outline">{messe.type === "dominicale" ? "Dominicale" : messe.type === "semaine" ? "Semaine" : "Fête"}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Messe du {date} à {messe.heure}
          </h1>
          <p className="text-muted-foreground mt-1">{messe.lieu}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
          <Button className="gap-1">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Progression des tâches */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Progression de la préparation</h3>
              <p className="text-sm text-muted-foreground">{calculateProgress()}% des tâches terminées</p>
            </div>
            <div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className="bg-slate-600 h-2.5 rounded-full" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="informations" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="liturgie">Liturgie</TabsTrigger>
          <TabsTrigger value="equipe">Équipe</TabsTrigger>
          <TabsTrigger value="preparation">Préparation</TabsTrigger>
        </TabsList>

        {/* Tab Informations générales */}
        <TabsContent value="informations" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Date:</span>
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Heure:</span>
                    <span>{messe.heure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Lieu:</span>
                    <span>{messe.lieu}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Célébrant:</span>
                    <span>{messe.celebrant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Contact:</span>
                    <span>{messe.contact_celebrant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{messe.type === "dominicale" ? "Messe dominicale" : messe.type === "semaine" ? "Messe en semaine" : "Messe festive"}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Intentions de messe:</h3>
                {messe.intentions.length > 0 ? (
                  <ul className="space-y-1 list-disc pl-5">
                    {messe.intentions.map((intention, index) => (
                      <li key={index}>{intention}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Aucune intention de messe</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messe.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span>{doc.nom}</span>
                      <Badge variant="outline">{doc.type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Voir</Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Liturgie */}
        <TabsContent value="liturgie" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lectures du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messe.lectures.map((lecture, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{lecture.type}</h3>
                      <Badge variant="outline">{lecture.reference}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lecture.texte}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messe.chants.map((chant, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{chant.moment}:</span>
                      <span>{chant.titre}</span>
                      {chant.reference && <Badge variant="outline">{chant.reference}</Badge>}
                    </div>
                    <div>
                      {chant.partition ? (
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Partition
                        </Button>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50">Pas de partition</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Équipe */}
        <TabsContent value="equipe" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Composition de l'équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {messe.equipe.map((membre, index) => (
                  <div key={index} className="flex items-center justify-between border-b py-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{membre.role}:</span>
                      <span>{membre.nom}</span>
                    </div>
                    <div className="flex gap-2">
                      {membre.contact && (
                        <Button variant="outline" size="sm" className="gap-1">
                          <Phone className="h-4 w-4" />
                          {membre.contact}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="w-full">
                  Ajouter un membre à l'équipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Préparation */}
        <TabsContent value="preparation" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tâches de préparation</CardTitle>
              <Button size="sm">Ajouter une tâche</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {messe.taches.map((tache, index) => (
                  <div key={index} className="flex items-center justify-between border-b py-3 last:border-0">
                    <div className="flex items-center gap-2">
                      {tache.statut === "terminé" ? (
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-slate-200"></div>
                      )}
                      <span className={tache.statut === "terminé" ? "line-through text-muted-foreground" : ""}>
                        {tache.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{tache.responsable}</span>
                      <Badge className={getStatusColor(tache.statut)}>
                        {tache.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Notes pour la préparation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Ajouter une note..." />
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-sm">Rappeler au célébrant de prévoir le rituel pour la bénédiction des enfants à la fin de la messe.</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Ajouté le 10/05/2025</span>
                    <Button variant="ghost" size="sm">Supprimer</Button>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-sm">Prévenir la chorale de l'enregistrement de la messe pour les archives paroissiales.</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Ajouté le 09/05/2025</span>
                    <Button variant="ghost" size="sm">Supprimer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}