/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Edit, Trash, Calendar, Clock, MapPin, User, FileText, 
  CheckCircle, AlertCircle, Users, Mail, Phone, Copy, Printer, 
  Link as LinkIcon, MessageSquare, Plus, Download 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface EvenementDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Interfaces pour les données de l'événement
interface Organisateur {
  nom: string;
  titre: string;
  email: string;
  telephone: string;
}

interface Intervenant {
  nom: string;
  titre: string;
  role: string;
}

interface Inscription {
  nom: string;
  paroisse: string;
  present: boolean;
  nombre?: number;
}

interface Document {
  nom: string;
  taille: string;
}

interface Tache {
  nom: string;
  statut: string;
  responsable: string;
}

interface Evenement {
  id: string;
  titre: string;
  date: string;
  heure: string;
  duree: string;
  fin: string;
  lieu: string;
  adresse: string;
  description: string;
  type: string;
  statut: string;
  organisateur: Organisateur;
  intervenants: Intervenant[];
  participants: string[];
  nombreInscrits: number;
  capaciteMax: number;
  inscriptions: Inscription[];
  documents: Document[];
  taches: Tache[];
  notes: string;
}

// Simulation de la récupération des données d'un événement
const getEvenement = (id: string): Evenement | undefined => {
  // Dans une application réelle, vous feriez un appel API ici
  const evenements: Evenement[] = [
    {
      id: "1",
      titre: "Rencontre des responsables pastoraux",
      date: "2025-05-22",
      heure: "09:30",
      duree: "03h00",
      fin: "12:30",
      lieu: "Centre pastoral du vicariat",
      adresse: "8 rue Saint-Antoine, 75004 Paris",
      description: `Rencontre biannuelle des responsables pastoraux du vicariat pour faire le point sur les actions en cours et préparer l'année pastorale.

Cette rencontre sera l'occasion de :
- Dresser le bilan des actions menées depuis janvier
- Partager les expériences pastorales fructueuses
- Réfléchir ensemble aux priorités pour l'année à venir
- Coordonner les actions inter-paroissiales

La présence de tous les curés et responsables d'équipes d'animation pastorale est vivement souhaitée.`,
      type: "reunion",
      statut: "confirmé",
      organisateur: {
        nom: "Père Michel Lefevre",
        titre: "Vicaire épiscopal",
        email: "vicaire.nord@diocese.fr",
        telephone: "01 42 36 78 90"
      },
      intervenants: [
        {
          nom: "Père Michel Lefevre",
          titre: "Vicaire épiscopal",
          role: "Animation de la rencontre"
        },
        {
          nom: "Soeur Marie Dupont",
          titre: "Responsable catéchèse vicariale",
          role: "Présentation bilan catéchèse"
        },
        {
          nom: "M. Jean Moreau",
          titre: "Économe vicarial",
          role: "Point financier"
        }
      ],
      participants: ["Curés", "Équipes d'animation pastorale", "Responsables de services"],
      nombreInscrits: 42,
      capaciteMax: 50,
      inscriptions: [
        { nom: "Père Thomas Bernard", paroisse: "Paroisse Notre-Dame", present: true },
        { nom: "Père Jean Dupont", paroisse: "Paroisse Saint-Joseph", present: true },
        { nom: "Équipe pastorale Saint-Pierre", paroisse: "Paroisse Saint-Pierre", present: false },
        { nom: "Soeur Élisabeth Martin", paroisse: "Service catéchèse", present: true }
      ],
      documents: [
        { nom: "Ordre du jour.pdf", taille: "245 KB" },
        { nom: "Bilan 2024-2025.docx", taille: "1.2 MB" },
        { nom: "Plan d'action 2025-2026.pptx", taille: "3.5 MB" }
      ],
      taches: [
        { nom: "Réservation de la salle", statut: "terminé", responsable: "Secrétariat vicarial" },
        { nom: "Envoi des invitations", statut: "terminé", responsable: "Secrétariat vicarial" },
        { nom: "Préparation des documents", statut: "en cours", responsable: "Père Michel Lefevre" },
        { nom: "Organisation du repas", statut: "à faire", responsable: "Service logistique" }
      ],
      notes: "Prévoir une salle adaptée pour environ 50 personnes. Vérifier la disponibilité du matériel de projection. Prévoir un temps de pause-café à 10h45."
    },
    {
      id: "3",
      titre: "Pèlerinage vicarial",
      date: "2025-07-12",
      heure: "08:30",
      duree: "2 jours",
      fin: "18:00 (13/07/2025)",
      lieu: "Sanctuaire Notre-Dame",
      adresse: "Chemin du Sanctuaire, 60500 Notre-Dame-de-Liesse",
      description: `Pèlerinage annuel du vicariat au sanctuaire Notre-Dame. 

Programme:
- Jour 1 (12/07): 
  * 8h30: Départ en bus depuis la place de la cathédrale
  * 11h00: Arrivée et installation
  * 12h30: Repas
  * 14h30: Visite guidée du sanctuaire
  * 16h30: Temps libre
  * 18h00: Conférence spirituelle
  * 19h30: Dîner
  * 21h00: Veillée de prière

- Jour 2 (13/07):
  * 8h00: Petit-déjeuner
  * 9h30: Temps de partage en groupes
  * 11h00: Messe dominicale présidée par notre vicaire épiscopal
  * 12h30: Repas
  * 14h30: Temps d'échange et de convivialité
  * 16h00: Départ pour le retour
  * 18h00: Arrivée prévue à Paris

Coût: 85€ par adulte et 45€ par enfant de moins de 12 ans (comprend le transport, l'hébergement et les repas)`,
      type: "pelerinage",
      statut: "en préparation",
      organisateur: {
        nom: "Équipe pastorale vicariale",
        titre: "Service des pèlerinages",
        email: "pelerinages.vicariat@diocese.fr",
        telephone: "01 42 36 78 91"
      },
      intervenants: [
        {
          nom: "Père Michel Lefevre",
          titre: "Vicaire épiscopal",
          role: "Présidence des célébrations"
        },
        {
          nom: "Père Antoine Martin",
          titre: "Responsable pèlerinages",
          role: "Organisation générale"
        },
        {
          nom: "Soeur Claire Dubois",
          titre: "Service spiritualité",
          role: "Animation des temps spirituels"
        }
      ],
      participants: ["Ouverts à tous"],
      nombreInscrits: 95,
      capaciteMax: 200,
      inscriptions: [
        { nom: "Paroisse Saint-Joseph", paroisse: "Saint-Joseph", present: true, nombre: 28 },
        { nom: "Paroisse Notre-Dame", paroisse: "Notre-Dame", present: true, nombre: 35 },
        { nom: "Paroisse Saint-Pierre", paroisse: "Saint-Pierre", present: true, nombre: 22 },
        { nom: "Paroisse Sainte-Anne", paroisse: "Sainte-Anne", present: false, nombre: 10 }
      ],
      documents: [
        { nom: "Programme détaillé.pdf", taille: "458 KB" },
        { nom: "Formulaire d'inscription.docx", taille: "325 KB" },
        { nom: "Plan du sanctuaire.pdf", taille: "1.8 MB" }
      ],
      taches: [
        { nom: "Réservation des bus", statut: "terminé", responsable: "Service logistique" },
        { nom: "Réservation de l'hébergement", statut: "terminé", responsable: "Service pèlerinages" },
        { nom: "Finalisation du programme", statut: "en cours", responsable: "Père Antoine Martin" },
        { nom: "Préparation des carnets de chants", statut: "à faire", responsable: "Service liturgique" },
        { nom: "Achat des badges et foulards", statut: "à faire", responsable: "Service logistique" }
      ],
      notes: "Prévoir des activités adaptées pour les enfants pendant les temps de conférence. Organiser des covoiturages pour les personnes ne pouvant pas participer au transport en bus."
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
    case "reunion":
      return { label: "Réunion", variant: "outline" as const };
    case "formation":
      return { label: "Formation", variant: "secondary" as const };
    case "pelerinage":
      return { label: "Pèlerinage", variant: "default" as const };
    case "retraite":
      return { label: "Retraite", variant: "destructive" as const };
    case "celebration":
      return { label: "Célébration", variant: "success" as const };
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
    case "en préparation":
      return { label: "En préparation", variant: "secondary" as const };
    case "terminé":
      return { label: "Terminé", variant: "default" as const };
    case "annulé":
      return { label: "Annulé", variant: "destructive" as const };
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
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(true);

  // Résoudre les params asynchrones
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
        
        // Une fois les params résolus, récupérer l'événement
        const evenementData = getEvenement(resolved.id);
        setEvenement(evenementData || null);
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
          <p className="text-slate-500">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (!evenement) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Événement non trouvé</h1>
        <p className="text-slate-600 mb-6">L'événement que vous recherchez n'existe pas.</p>
        <Link href="/dashboard/vicariat/evenements" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  const { label: typeLabel, variant: typeVariant } = getEventTypeDetails(evenement.type);
  const { label: statusLabel, variant: statusVariant } = getEventStatusDetails(evenement.statut);

  // Calculer le pourcentage d'inscription
  const pourcentageInscription = Math.min(100, Math.round((evenement.nombreInscrits / evenement.capaciteMax) * 100));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/vicariat/evenements" passHref>
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
                    {evenement.heure} - {evenement.fin} ({evenement.duree})
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
                  <p className="text-sm font-medium text-slate-500">Adresse</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {evenement.adresse}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Organisateur</p>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    {evenement.organisateur.nom} - {evenement.organisateur.titre}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Contact</p>
                  <div className="flex flex-col">
                    <a href={`mailto:${evenement.organisateur.email}`} className="flex items-center text-blue-600 hover:underline">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" />
                      {evenement.organisateur.email}
                    </a>
                    <a href={`tel:${evenement.organisateur.telephone}`} className="flex items-center text-blue-600 hover:underline">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                      {evenement.organisateur.telephone}
                    </a>
                  </div>
                </div>
                <div className="space-y-1 col-span-full">
                  <p className="text-sm font-medium text-slate-500">Description</p>
                  <p className="whitespace-pre-line text-slate-700">
                    {evenement.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intervenants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {evenement.intervenants.map((intervenant, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center p-4 border border-slate-200 rounded-md text-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <User className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="font-medium text-slate-900">{intervenant.nom}</h3>
                    <p className="text-xs text-slate-500">{intervenant.titre}</p>
                    <p className="text-xs font-medium text-slate-700 mt-2">{intervenant.role}</p>
                  </div>
                ))}
              </div>

              {evenement.intervenants.length === 0 && (
                <p className="text-center py-4 text-slate-500">
                  Aucun intervenant enregistré
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evenement.documents.map((document, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{document.nom}</h3>
                        <p className="text-xs text-slate-500">{document.taille}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Télécharger
                    </Button>
                  </div>
                ))}

                {evenement.documents.length === 0 && (
                  <p className="text-center py-4 text-slate-500">
                    Aucun document disponible
                  </p>
                )}

                <Button className="w-full mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter un document
                </Button>
              </div>
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

                <Button className="w-full mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une tâche
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Taux de remplissage</span>
                  <span className="text-sm font-medium">{pourcentageInscription}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      pourcentageInscription > 90 ? 'bg-red-600' : 
                      pourcentageInscription > 70 ? 'bg-amber-500' : 
                      'bg-green-600'
                    }`} 
                    style={{ width: `${pourcentageInscription}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Inscrits</span>
                  <span className="font-medium">{evenement.nombreInscrits} / {evenement.capaciteMax}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Places restantes</span>
                  <span className="font-medium">{evenement.capaciteMax - evenement.nombreInscrits}</span>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Liste des inscrits</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {evenement.inscriptions.map((inscription, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-md text-sm"
                      >
                        <div className="flex items-center">
                          <CheckCircle className={`h-4 w-4 mr-2 ${inscription.present ? 'text-green-500' : 'text-slate-300'}`} />
                          <div>
                            <p className="font-medium">{inscription.nom}</p>
                            <p className="text-xs text-slate-500">{inscription.paroisse}</p>
                          </div>
                        </div>
                        {inscription.nombre && (
                          <Badge variant="outline">{inscription.nombre} personnes</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une inscription
                  </Button>
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
                  <MessageSquare className="mr-2 h-4 w-4" /> Envoyer un message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Printer className="mr-2 h-4 w-4" /> Imprimer les détails
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Copy className="mr-2 h-4 w-4" /> Dupliquer l'événement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <LinkIcon className="mr-2 h-4 w-4" /> Partager le lien
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