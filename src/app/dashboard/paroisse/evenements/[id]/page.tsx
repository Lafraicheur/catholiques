/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash, Calendar, Clock, MapPin, User, FileText, CheckCircle, AlertCircle, Plus, Mail, Printer, Copy } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Détail Événement | Dashboard Église Catholique",
};

interface EvenementDetailPageProps {
  params: {
    id: string;
  };
}

// Simulation de la récupération des données d'un événement
const getEvenement = (id: string) => {
  // Dans une application réelle, vous feriez un appel API ici
  const evenements = [
    {
      id: "1",
      titre: "Messe dominicale",
      date: "2025-05-18",
      heure: "10:30",
      duree: "1h30",
      lieu: "Église principale",
      description: "Messe du 6ème dimanche de Pâques. Lectures : Actes 10, 25-26.34-35.44-48 ; Psaume 97 ; 1 Jean 4, 7-10 ; Jean 15, 9-17.",
      type: "messe",
      statut: "programmé",
      responsable: "Père Jean Dupont",
      participants: [
        { nom: "Père Jean Dupont", role: "Célébrant" },
        { nom: "Michel Bernard", role: "Servant d'autel" },
        { nom: "Marie Martin", role: "Lecteur" },
        { nom: "Lucie Dubois", role: "Chorale" },
      ],
      taches: [
        { nom: "Préparation de l'autel", statut: "terminé", responsable: "Michel Bernard" },
        { nom: "Impression des feuilles de messe", statut: "terminé", responsable: "Sophie Petit" },
        { nom: "Préparation des chants", statut: "en cours", responsable: "Lucie Dubois" },
        { nom: "Fleurissement", statut: "à faire", responsable: "Jean Dupont" },
      ],
      notes: "Prévoir un baptême à la fin de la messe. Accueillir la famille du baptisé en début de célébration.",
    },
    {
      id: "4",
      titre: "Baptême - Marie Durand",
      date: "2025-05-19",
      heure: "11:00",
      duree: "1h",
      lieu: "Église principale",
      description: "Baptême de Marie Durand, fille de Thomas et Sophie Durand. Parrain : Pierre Martin, Marraine : Julie Leclerc.",
      type: "sacrement",
      statut: "confirmé",
      responsable: "Père Jean Dupont",
      participants: [
        { nom: "Père Jean Dupont", role: "Célébrant" },
        { nom: "Marie Durand", role: "Baptisée" },
        { nom: "Thomas Durand", role: "Père" },
        { nom: "Sophie Durand", role: "Mère" },
        { nom: "Pierre Martin", role: "Parrain" },
        { nom: "Julie Leclerc", role: "Marraine" },
      ],
      taches: [
        { nom: "Préparation des fonts baptismaux", statut: "à faire", responsable: "Michel Bernard" },
        { nom: "Préparation du certificat de baptême", statut: "terminé", responsable: "Sophie Petit" },
      ],
      notes: "Famille à accueillir 30 minutes avant la cérémonie. Prévoir un photographe paroissial.",
    }
  ];

  return evenements.find(e => e.id === id);
};

// Formatage de la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Formater type d'événement pour Badge
const getEventTypeDetails = (type: string) => {
  switch (type) {
    case "messe":
      return { label: "Messe", variant: "default" as const };
    case "formation":
      return { label: "Formation", variant: "secondary" as const };
    case "reunion":
      return { label: "Réunion", variant: "outline" as const };
    case "sacrement":
      return { label: "Sacrement", variant: "destructive" as const };
    case "priere":
      return { label: "Prière", variant: "success" as const };
    default:
      return { label: type, variant: "default" as const };
  }
};

// Formater statut d'événement pour Badge
const getEventStatusDetails = (statut: string) => {
  switch (statut) {
    case "programmé":
      return { label: "Programmé", variant: "outline" as const };
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "terminé":
      return { label: "Terminé", variant: "secondary" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Formater statut de tâche pour Badge
const getTaskStatusDetails = (statut: string) => {
  switch (statut) {
    case "à faire":
      return { label: "À faire", variant: "outline" as const, icon: <AlertCircle className="h-4 w-4 mr-1 text-amber-500" /> };
    case "en cours":
      return { label: "En cours", variant: "secondary" as const, icon: <Clock className="h-4 w-4 mr-1 text-blue-500" /> };
    case "terminé":
      return { label: "Terminé", variant: "success" as const, icon: <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> };
    default:
      return { label: statut, variant: "outline" as const, icon: <AlertCircle className="h-4 w-4 mr-1" /> };
  }
};

export default function EvenementDetailPage({ params }: EvenementDetailPageProps) {
  const evenement = getEvenement(params.id);

  if (!evenement) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Événement non trouvé</h1>
        <p className="text-slate-600 mb-6">L'événement que vous recherchez n'existe pas.</p>
        <Link href="/dashboard/paroisse/evenements" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  const { label: typeLabel, variant: typeVariant } = getEventTypeDetails(evenement.type);
  const { label: statusLabel, variant: statusVariant } = getEventStatusDetails(evenement.statut);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/paroisse/evenements" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {evenement.titre}
          </h1>
          <Badge variant={typeVariant}>{typeLabel}</Badge>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
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
              <CardTitle>Informations sur l'événement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Date</p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {formatDate(evenement.date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Horaire</p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    {evenement.heure} ({evenement.duree})
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Lieu</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {evenement.lieu}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Responsable</p>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    {evenement.responsable}
                  </p>
                </div>
                <div className="space-y-1 col-span-full">
                  <p className="text-sm font-medium text-slate-500">Description</p>
                  <p className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-1 text-slate-400" />
                    <span>{evenement.description}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {evenement.participants.map((participant, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 border border-slate-200 rounded-md"
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{participant.nom}</h3>
                      <p className="text-xs text-slate-500">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              {evenement.participants.length === 0 && (
                <p className="text-center py-4 text-slate-500">
                  Aucun participant enregistré
                </p>
              )}

              <Button className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" /> Ajouter un participant
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evenement.taches.map((tache, index) => {
                  const { label, variant, icon } = getTaskStatusDetails(tache.statut);
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          {icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{tache.nom}</h3>
                          <p className="text-xs text-slate-500">Responsable: {tache.responsable}</p>
                        </div>
                      </div>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                  );
                })}

                {evenement.taches.length === 0 && (
                  <p className="text-center py-4 text-slate-500">
                    Aucune tâche enregistrée
                  </p>
                )}

                <Button className="w-full mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une tâche
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statut de l'événement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Statut actuel</span>
                  <Badge variant={statusVariant} className="text-sm">{statusLabel}</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">Changer le statut</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Programmé</Button>
                    <Button variant="outline" size="sm">Confirmé</Button>
                    <Button variant="outline" size="sm">Terminé</Button>
                    <Button variant="outline" size="sm">Annulé</Button>
                  </div>
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
                  <Mail className="mr-2 h-4 w-4" /> Envoyer un rappel
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Printer className="mr-2 h-4 w-4" /> Imprimer les détails
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Copy className="mr-2 h-4 w-4" /> Dupliquer l'événement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" /> Ajouter au calendrier
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{evenement.notes}</p>
              <Button variant="outline" className="w-full mt-4">
                <Edit className="mr-2 h-4 w-4" /> Modifier les notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}