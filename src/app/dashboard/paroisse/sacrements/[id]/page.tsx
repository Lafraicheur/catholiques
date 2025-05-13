/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash, Calendar, Clock, MapPin, User, FileText, Heart, Check, Mail, Phone, MessageSquare, Printer, Users, AlertCircle, FileCheck, Plus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Détail Sacrement | Dashboard Église Catholique",
};

interface SacrementDetailPageProps {
  params: {
    id: string;
  };
}

// Simulation de la récupération des données d'un sacrement
const getSacrement = (id: string) => {
  // Dans une application réelle, vous feriez un appel API ici
  const sacrements = [
    { 
      id: "1", 
      type: "baptême", 
      date: "2025-05-25", 
      heure: "11:30", 
      duree: "1h00",
      lieu: "Église principale", 
      adresse: "12 rue des Églises, 75001 Paris",
      personne: "Marie Durand", 
      dateNaissance: "2025-04-10",
      age: "nouveau-né", 
      statut: "confirmé",
      preparation: {
        statut: "terminée",
        sessions: [
          { date: "2025-04-15", type: "Rencontre initiale", presence: true },
          { date: "2025-05-05", type: "Préparation liturgique", presence: true },
          { date: "2025-05-19", type: "Rencontre finale", presence: true }
        ]
      },
      ministre: {
        nom: "Père Jean Dupont",
        role: "Curé",
        email: "pere.dupont@paroisse.fr",
        telephone: "01 23 45 67 89"
      },
      parrain: "Pierre Martin",
      marraine: "Julie Leclerc",
      parents: [
        { nom: "Thomas Durand", role: "Père", telephone: "06 12 34 56 78" },
        { nom: "Sophie Durand", role: "Mère", telephone: "06 23 45 67 89" }
      ],
      notes: "Baptême à la fin de la messe dominicale. Famille originaire de la paroisse. Grands-parents pratiquants réguliers.",
      documents: [
        { nom: "Extrait de naissance", statut: "reçu", date: "2025-04-20" },
        { nom: "Formulaire d'inscription", statut: "reçu", date: "2025-04-15" },
        { nom: "Certificat de baptême du parrain", statut: "manquant" },
        { nom: "Certificat de baptême de la marraine", statut: "reçu", date: "2025-04-28" }
      ],
      taches: [
        { nom: "Préparation du registre", statut: "à faire", responsable: "Secrétariat" },
        { nom: "Préparation des fonts baptismaux", statut: "à faire", responsable: "Sacristie" },
        { nom: "Émission du certificat", statut: "à faire", responsable: "Secrétariat" }
      ]
    },
    { 
      id: "9", 
      type: "mariage", 
      date: "2025-06-14", 
      heure: "15:00", 
      duree: "1h30",
      lieu: "Église principale", 
      adresse: "12 rue des Églises, 75001 Paris",
      
      personne: "Paul Mercier & Emma Rousseau", 
      dateNaissance: "",
      age: "adultes", 
      statut: "confirmé",
      preparation: {
        statut: "terminée",
        sessions: [
          { date: "2025-01-20", type: "Session 1: Engagement", presence: true },
          { date: "2025-02-15", type: "Session 2: Communication", presence: true },
          { date: "2025-03-10", type: "Session 3: Spiritualité", presence: true },
          { date: "2025-04-05", type: "Session 4: Vie de famille", presence: true },
          { date: "2025-05-20", type: "Rencontre liturgique", presence: true }
        ]
      },
      ministre: {
        nom: "Père Jean Dupont",
        role: "Curé",
        email: "pere.dupont@paroisse.fr",
        telephone: "01 23 45 67 89"
      },
      temoins: [
        { nom: "Jacques Mercier", role: "Témoin du marié", relation: "Frère" },
        { nom: "Lucie Rousseau", role: "Témoin de la mariée", relation: "Sœur" }
      ],
      fiances: [
        { 
          nom: "Paul Mercier", 
          role: "Marié", 
          dateNaissance: "1992-05-12", 
          telephone: "06 12 34 56 78",
          email: "paul.mercier@mail.com",
          adresse: "24 rue du Commerce, 75015 Paris",
          bapteme: "Oui - Paroisse Saint-Michel (1992)"
        },
        { 
          nom: "Emma Rousseau", 
          role: "Mariée", 
          dateNaissance: "1994-08-23", 
          telephone: "06 23 45 67 89",
          email: "emma.rousseau@mail.com",
          adresse: "24 rue du Commerce, 75015 Paris",
          bapteme: "Oui - Paroisse Notre-Dame (1994)"
        }
      ],
      notes: "Couple pratiquant régulièrement. Habitent dans le 15ème mais souhaitent se marier dans notre paroisse car c'est la paroisse d'enfance d'Emma. Prévoient environ 120 invités.",
      documents: [
        { nom: "Extrait de naissance - Paul", statut: "reçu", date: "2025-01-15" },
        { nom: "Extrait de naissance - Emma", statut: "reçu", date: "2025-01-15" },
        { nom: "Certificat de baptême - Paul", statut: "reçu", date: "2025-01-28" },
        { nom: "Certificat de baptême - Emma", statut: "reçu", date: "2025-01-28" },
        { nom: "Dossier de mariage civil", statut: "reçu", date: "2025-03-10" },
        { nom: "Formulaire d'inscription", statut: "reçu", date: "2025-01-10" }
      ],
      taches: [
        { nom: "Préparation du registre", statut: "à faire", responsable: "Secrétariat" },
        { nom: "Coordination avec l'organiste", statut: "en cours", responsable: "Équipe liturgique" },
        { nom: "Préparation de l'église", statut: "à faire", responsable: "Sacristie" },
        { nom: "Émission du certificat", statut: "à faire", responsable: "Secrétariat" }
      ]
    }
  ];

  return sacrements.find(s => s.id === id);
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

// Formatter l'âge à partir de la date de naissance
const calculateAge = (birthDateString: string) => {
  if (!birthDateString) return "";
  
  const birthDate = new Date(birthDateString);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return `${age} ans`;
};

// Formater type de sacrement pour Badge
const getSacrementTypeDetails = (type: string) => {
  switch (type) {
    case "baptême":
      return { label: "Baptême", variant: "default" as const, icon: <Heart className="h-4 w-4 mr-1" /> };
    case "première communion":
      return { label: "Première communion", variant: "success" as const, icon: <Heart className="h-4 w-4 mr-1" /> };
    case "confirmation":
      return { label: "Confirmation", variant: "secondary" as const, icon: <Heart className="h-4 w-4 mr-1" /> };
    case "mariage":
      return { label: "Mariage", variant: "destructive" as const, icon: <Heart className="h-4 w-4 mr-1" /> };
    case "onction des malades":
      return { label: "Onction des malades", variant: "outline" as const, icon: <Heart className="h-4 w-4 mr-1" /> };
    default:
      return { label: type, variant: "default" as const, icon: <Heart className="h-4 w-4 mr-1" /> };
  }
};

// Formater statut pour Badge
const getStatusDetails = (statut: string) => {
  switch (statut) {
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "en préparation":
      return { label: "En préparation", variant: "secondary" as const };
    case "demande reçue":
      return { label: "Demande reçue", variant: "outline" as const };
    case "terminé":
      return { label: "Terminé", variant: "default" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Formater préparation pour Badge
const getPreparationDetails = (preparation: string) => {
  switch (preparation) {
    case "terminée":
      return { label: "Terminée", variant: "success" as const, icon: <Check className="h-4 w-4 mr-1" /> };
    case "en cours":
      return { label: "En cours", variant: "secondary" as const, icon: <Clock className="h-4 w-4 mr-1" /> };
    case "à commencer":
      return { label: "À commencer", variant: "outline" as const, icon: <Calendar className="h-4 w-4 mr-1" /> };
    default:
      return { label: preparation, variant: "outline" as const, icon: <Clock className="h-4 w-4 mr-1" /> };
  }
};

// Formater statut de document pour Badge
const getDocumentStatusDetails = (statut: string) => {
  switch (statut) {
    case "reçu":
      return { label: "Reçu", variant: "success" as const, icon: <Check className="h-4 w-4 mr-1" /> };
    case "manquant":
      return { label: "Manquant", variant: "destructive" as const, icon: <AlertCircle className="h-4 w-4 mr-1" /> };
    case "en attente":
      return { label: "En attente", variant: "outline" as const, icon: <Clock className="h-4 w-4 mr-1" /> };
    default:
      return { label: statut, variant: "outline" as const, icon: <FileText className="h-4 w-4 mr-1" /> };
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
      return { label: "Terminé", variant: "success" as const, icon: <Check className="h-4 w-4 mr-1 text-green-500" /> };
    default:
      return { label: statut, variant: "outline" as const, icon: <AlertCircle className="h-4 w-4 mr-1" /> };
  }
};

export default function SacrementDetailPage({ params }: SacrementDetailPageProps) {
  const sacrement = getSacrement(params.id);

  if (!sacrement) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Sacrement non trouvé</h1>
        <p className="text-slate-600 mb-6">Le sacrement que vous recherchez n'existe pas.</p>
        <Link href="/dashboard/paroisse/sacrements" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  const { label: typeLabel, variant: typeVariant, icon: typeIcon } = getSacrementTypeDetails(sacrement.type);
  const { label: statusLabel, variant: statusVariant } = getStatusDetails(sacrement.statut);
  const { label: prepLabel, variant: prepVariant, icon: prepIcon } = getPreparationDetails(sacrement.preparation.statut);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/paroisse/sacrements" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {sacrement.type === "mariage" ? `Mariage : ${sacrement.personne}` : `${typeLabel} : ${sacrement.personne}`}
          </h1>
          <Badge variant={typeVariant} className="flex items-center">
            {typeIcon} {typeLabel}
          </Badge>
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
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Date</p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {formatDate(sacrement.date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Horaire</p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.heure} ({sacrement.duree})
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Lieu</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.lieu}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Adresse</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.adresse}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Ministre</p>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.ministre.nom} - {sacrement.ministre.role}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">État de la préparation</p>
                  <Badge variant={prepVariant} className="flex items-center">
                    {prepIcon} {prepLabel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations sur les personnes concernées - diffère selon le type de sacrement */}
          <Card>
            <CardHeader>
              <CardTitle>
                {sacrement.type === "baptême" ? "Informations sur le baptisé et sa famille" : 
                 sacrement.type === "mariage" ? "Informations sur les fiancés" : 
                 "Personnes concernées"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sacrement.type === "baptême" && (
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-md">
                    <h3 className="font-medium text-slate-900 mb-2">Personne à baptiser</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">Nom</p>
                        <p>{sacrement.personne}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">Date de naissance</p>
                        <p>{formatDate(sacrement.dateNaissance)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">Âge</p>
                        <p>{sacrement.age}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sacrement.parents && sacrement.parents.map((parent, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-md">
                        <h3 className="font-medium text-slate-900 mb-2">{parent.role}</h3>
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Nom:</span> {parent.nom}</p>
                          <p className="text-sm flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            <a href={`tel:${parent.telephone}`} className="text-blue-600 hover:underline">
                              {parent.telephone}
                            </a>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 border border-slate-200 rounded-md">
                      <h3 className="font-medium text-slate-900 mb-2">Parrain</h3>
                      <p>{sacrement.parrain}</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-md">
                      <h3 className="font-medium text-slate-900 mb-2">Marraine</h3>
                      <p>{sacrement.marraine}</p>
                    </div>
                  </div>
                </div>
              )}

              {sacrement.type === "mariage" && (
                <div className="space-y-4">
                  {sacrement.fiances && sacrement.fiances.map((fiance, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-md">
                      <h3 className="font-medium text-slate-900 mb-2">{fiance.role}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-500">Nom</p>
                          <p>{fiance.nom}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-500">Date de naissance</p>
                          <p>{formatDate(fiance.dateNaissance)} ({calculateAge(fiance.dateNaissance)})</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-500">Contact</p>
                          <div className="flex flex-col">
                            <a href={`tel:${fiance.telephone}`} className="flex items-center text-blue-600 hover:underline">
                              <Phone className="h-3.5 w-3.5 mr-1 text-slate-400" />
                              {fiance.telephone}
                            </a>
                            <a href={`mailto:${fiance.email}`} className="flex items-center text-blue-600 hover:underline">
                              <Mail className="h-3.5 w-3.5 mr-1 text-slate-400" />
                              {fiance.email}
                            </a>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-500">Adresse</p>
                          <p>{fiance.adresse}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <p className="text-sm font-medium text-slate-500">Baptême</p>
                          <p>{fiance.bapteme}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <h3 className="col-span-full font-medium text-slate-900 mb-2">Témoins</h3>
                    {sacrement.temoins && sacrement.temoins.map((temoin, index) => (
                      <div key={index} className="p-3 border border-slate-200 rounded-md">
                        <p className="font-medium">{temoin.nom}</p>
                        <p className="text-sm text-slate-500">{temoin.role} - {temoin.relation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préparation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sacrement.preparation.sessions && sacrement.preparation.sessions.map((session, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <Calendar className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{session.type}</h3>
                        <p className="text-xs text-slate-500">Date: {formatDate(session.date)}</p>
                      </div>
                    </div>
                    <Badge variant={session.presence ? "success" : "destructive"}>
                      {session.presence ? "Présent" : "Absent"}
                    </Badge>
                  </div>
                ))}

                {(!sacrement.preparation.sessions || sacrement.preparation.sessions.length === 0) && (
                  <p className="text-center py-4 text-slate-500">
                    Aucune session de préparation enregistrée
                  </p>
                )}

                <Button className="w-full mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une session
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents administratifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sacrement.documents && sacrement.documents.map((document, index) => {
                  const { label, variant, icon } = getDocumentStatusDetails(document.statut);
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <FileText className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{document.nom}</h3>
                          {document.date && (
                            <p className="text-xs text-slate-500">Reçu le: {formatDate(document.date)}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={variant} className="flex items-center">
                        {icon} {label}
                      </Badge>
                    </div>
                  );
                })}

                {(!sacrement.documents || sacrement.documents.length === 0) && (
                  <p className="text-center py-4 text-slate-500">
                    Aucun document enregistré
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
                {sacrement.taches && sacrement.taches.map((tache, index) => {
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

                {(!sacrement.taches || sacrement.taches.length === 0) && (
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
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" /> Envoyer un message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileCheck className="mr-2 h-4 w-4" /> Marquer comme terminé
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Printer className="mr-2 h-4 w-4" /> Imprimer le certificat
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Envoyer un rappel
                </Button>
                {sacrement.type === "mariage" && (
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" /> Fixer un rendez-vous
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>État d'avancement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Progression globale
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        75%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-slate-700">Documents</span>
                    <span className="text-xs font-medium">
                      {sacrement.documents.filter(d => d.statut === "reçu").length}/{sacrement.documents.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${(sacrement.documents.filter(d => d.statut === "reçu").length / sacrement.documents.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-slate-700">Préparation</span>
                    <span className="text-xs font-medium">
                      {sacrement.preparation.sessions.filter(s => s.presence).length}/{sacrement.preparation.sessions.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${(sacrement.preparation.sessions.filter(s => s.presence).length / sacrement.preparation.sessions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-slate-700">Tâches</span>
                    <span className="text-xs font-medium">
                      {sacrement.taches.filter(t => t.statut === "terminé").length}/{sacrement.taches.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full" 
                      style={{ width: `${(sacrement.taches.filter(t => t.statut === "terminé").length / sacrement.taches.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 whitespace-pre-line">{sacrement.notes}</p>
              <Button variant="outline" className="w-full mt-4">
                <Edit className="mr-2 h-4 w-4" /> Modifier les notes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact du ministre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium">{sacrement.ministre.nom}</h3>
                <p className="text-sm text-slate-500">{sacrement.ministre.role}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <a href={`mailto:${sacrement.ministre.email}`} className="flex items-center text-blue-600 hover:underline">
                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.ministre.email}
                  </a>
                  <a href={`tel:${sacrement.ministre.telephone}`} className="flex items-center text-blue-600 hover:underline">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    {sacrement.ministre.telephone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}