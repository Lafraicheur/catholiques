/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Heart,
  Clock,
  MapPin,
  FileText,
  User,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Gestion des Sacrements | Dashboard Église Catholique",
};

// Données fictives pour les sacrements
const sacrements = {
  baptemes: [
    {
      id: 1,
      type: "baptême",
      date: "2025-05-25",
      heure: "11:30",
      lieu: "Église principale",
      personne: "Marie Durand",
      age: "nouveau-né",
      statut: "confirmé",
      preparation: "terminée",
      ministre: "Père Jean Dupont",
      parrain: "Pierre Martin",
      marraine: "Julie Leclerc",
    },
    {
      id: 2,
      type: "baptême",
      date: "2025-06-08",
      heure: "12:00",
      lieu: "Église principale",
      personne: "Lucas Bernard",
      age: "nouveau-né",
      statut: "en préparation",
      preparation: "en cours",
      ministre: "Père Jean Dupont",
      parrain: "François Dubois",
      marraine: "Sophie Petit",
    },
    {
      id: 3,
      type: "baptême",
      date: "2025-06-15",
      heure: "11:30",
      lieu: "Église principale",
      personne: "Thomas Leroy",
      age: "adulte (28 ans)",
      statut: "en préparation",
      preparation: "en cours",
      ministre: "Père Michel Bernard",
      parrain: "Jean Moreau",
      marraine: "Marie Martin",
    },
    {
      id: 4,
      type: "baptême",
      date: "2025-07-06",
      heure: "12:00",
      lieu: "Église principale",
      personne: "Léa Girard",
      age: "enfant (8 ans)",
      statut: "demande reçue",
      preparation: "à commencer",
      ministre: "Père Jean Dupont",
      parrain: "Antoine Lefèvre",
      marraine: "Claire Dupuis",
    },
  ],
  communions: [
    {
      id: 5,
      type: "première communion",
      date: "2025-05-18",
      heure: "10:30",
      lieu: "Église principale",
      personne: "Groupe catéchisme (12 enfants)",
      age: "enfants (8-10 ans)",
      statut: "confirmé",
      preparation: "terminée",
      ministre: "Père Jean Dupont",
      responsable: "Marie Martin (catéchiste)",
    },
    {
      id: 6,
      type: "première communion",
      date: "2025-06-29",
      heure: "10:30",
      lieu: "Église principale",
      personne: "Thomas Leroy",
      age: "adulte (28 ans)",
      statut: "en préparation",
      preparation: "en cours",
      ministre: "Père Michel Bernard",
      responsable: "Sophie Petit (catéchuménat)",
    },
  ],
  confirmations: [
    {
      id: 7,
      type: "confirmation",
      date: "2025-05-25",
      heure: "16:00",
      lieu: "Cathédrale Notre-Dame",
      personne: "Groupe aumônerie (8 jeunes)",
      age: "jeunes (15-18 ans)",
      statut: "confirmé",
      preparation: "terminée",
      ministre: "Mgr l'Évêque",
      responsable: "Père Jean Dupont",
    },
    {
      id: 8,
      type: "confirmation",
      date: "2025-05-25",
      heure: "16:00",
      lieu: "Cathédrale Notre-Dame",
      personne: "Thomas Leroy",
      age: "adulte (28 ans)",
      statut: "en préparation",
      preparation: "en cours",
      ministre: "Mgr l'Évêque",
      responsable: "Sophie Petit (catéchuménat)",
    },
  ],
  mariages: [
    {
      id: 9,
      type: "mariage",
      date: "2025-06-14",
      heure: "15:00",
      lieu: "Église principale",
      personne: "Paul Mercier & Emma Rousseau",
      age: "adultes",
      statut: "confirmé",
      preparation: "terminée",
      ministre: "Père Jean Dupont",
      temoins: "Jacques Mercier, Lucie Rousseau",
    },
    {
      id: 10,
      type: "mariage",
      date: "2025-07-05",
      heure: "16:30",
      lieu: "Église principale",
      personne: "Antoine Morel & Sarah Leclerc",
      age: "adultes",
      statut: "en préparation",
      preparation: "en cours",
      ministre: "Père Michel Bernard",
      temoins: "Pierre Morel, Julie Leclerc",
    },
    {
      id: 11,
      type: "mariage",
      date: "2025-09-13",
      heure: "15:30",
      lieu: "Église principale",
      personne: "Maxime Dupuis & Camille Legrand",
      age: "adultes",
      statut: "demande reçue",
      preparation: "à commencer",
      ministre: "Père Jean Dupont",
      temoins: "À déterminer",
    },
  ],
  onctions: [
    {
      id: 12,
      type: "onction des malades",
      date: "2025-05-12",
      heure: "15:00",
      lieu: "Hôpital Saint-Louis, chambre 304",
      personne: "Jacques Moreau",
      age: "aîné (85 ans)",
      statut: "terminé",
      preparation: "terminée",
      ministre: "Père Jean Dupont",
    },
    {
      id: 13,
      type: "onction des malades",
      date: "2025-05-19",
      heure: "14:30",
      lieu: "Maison de retraite Les Tilleuls",
      personne: "Groupe (5 résidents)",
      age: "aînés",
      statut: "confirmé",
      preparation: "terminée",
      ministre: "Père Michel Bernard",
    },
  ],
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

// Formater type de sacrement pour Badge
const getSacrementTypeDetails = (type: string) => {
  switch (type) {
    case "baptême":
      return {
        label: "Baptême",
        variant: "default" as const,
        icon: <Heart className="h-4 w-4 mr-1" />,
      };
    case "première communion":
      return {
        label: "Première communion",
        variant: "success" as const,
        icon: <Heart className="h-4 w-4 mr-1" />,
      };
    case "confirmation":
      return {
        label: "Confirmation",
        variant: "secondary" as const,
        icon: <Heart className="h-4 w-4 mr-1" />,
      };
    case "mariage":
      return {
        label: "Mariage",
        variant: "destructive" as const,
        icon: <Heart className="h-4 w-4 mr-1" />,
      };
    case "onction des malades":
      return {
        label: "Onction des malades",
        variant: "outline" as const,
        icon: <Heart className="h-4 w-4 mr-1" />,
      };
    default:
      return {
        label: type,
        variant: "default" as const,
        icon: <Heart className="h-4 w-4 mr-1" />,
      };
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
      return {
        label: "Terminée",
        variant: "success" as const,
        icon: <Check className="h-4 w-4 mr-1" />,
      };
    case "en cours":
      return {
        label: "En cours",
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
      };
    case "à commencer":
      return {
        label: "À commencer",
        variant: "outline" as const,
        icon: <Calendar className="h-4 w-4 mr-1" />,
      };
    default:
      return {
        label: preparation,
        variant: "outline" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
      };
  }
};

// Compter les sacrements à venir
const countFutureSacrements = () => {
  const now = new Date();

  const baptemes = sacrements.baptemes.filter(
    (s) => new Date(s.date) >= now
  ).length;
  const communions = sacrements.communions.filter(
    (s) => new Date(s.date) >= now
  ).length;
  const confirmations = sacrements.confirmations.filter(
    (s) => new Date(s.date) >= now
  ).length;
  const mariages = sacrements.mariages.filter(
    (s) => new Date(s.date) >= now
  ).length;
  const onctions = sacrements.onctions.filter(
    (s) => new Date(s.date) >= now
  ).length;

  return { baptemes, communions, confirmations, mariages, onctions };
};

// Créer un composant pour rendre un sacrement
const SacrementItem = ({ sacrement }: { sacrement: any }) => {
  const {
    label: typeLabel,
    variant: typeVariant,
    icon: typeIcon,
  } = getSacrementTypeDetails(sacrement.type);
  const { label: statusLabel, variant: statusVariant } = getStatusDetails(
    sacrement.statut
  );
  const {
    label: prepLabel,
    variant: prepVariant,
    icon: prepIcon,
  } = getPreparationDetails(sacrement.preparation);

  return (
    <div className="p-4 border border-slate-200 rounded-md hover:bg-slate-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center">
            <Heart className="h-6 w-6 text-slate-700" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-medium text-slate-900">
                {sacrement.personne}
              </h3>
              <Badge variant={typeVariant} className="flex items-center">
                {typeIcon} {typeLabel}
              </Badge>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 mt-1 gap-1 sm:gap-3">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {formatDate(sacrement.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {sacrement.heure}
              </div>
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {sacrement.lieu}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center text-sm text-slate-700">
                <User className="h-3.5 w-3.5 mr-1" />
                Ministre: {sacrement.ministre}
              </div>
              <Badge
                variant={prepVariant}
                className="flex items-center text-xs"
              >
                {prepIcon} Préparation: {prepLabel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex self-end md:self-center">
          <a
            href={`/dashboard/paroisse/sacrements/${sacrement.id}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-4 py-2"
          >
            Détails
          </a>
        </div>
      </div>
    </div>
  );
};

export default function SacrementsPage() {
  const counts = countFutureSacrements();
  const totalSacrements = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Gestion des Sacrements
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full xs:w-auto" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Vue Calendrier
          </Button>
          <Button className="w-full xs:w-auto" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Baptêmes</p>
          <p className="text-2xl font-bold">{counts.baptemes}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Communions</p>
          <p className="text-2xl font-bold">{counts.communions}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Confirmations</p>
          <p className="text-2xl font-bold">{counts.confirmations}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Mariages</p>
          <p className="text-2xl font-bold">{counts.mariages}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Heart className="h-4 w-4 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Onctions</p>
          <p className="text-2xl font-bold">{counts.onctions}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">
            Sacrements à venir ({totalSacrements})
          </h2>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input placeholder="Rechercher..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tous" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="baptemes">Baptêmes</TabsTrigger>
            <TabsTrigger value="communions">Communions</TabsTrigger>
            <TabsTrigger value="confirmations">Confirmations</TabsTrigger>
            <TabsTrigger value="mariages">Mariages</TabsTrigger>
            <TabsTrigger value="onctions">Onctions</TabsTrigger>
          </TabsList>

          <TabsContent value="tous" className="space-y-4">
            {[
              ...sacrements.baptemes,
              ...sacrements.communions,
              ...sacrements.confirmations,
              ...sacrements.mariages,
              ...sacrements.onctions,
            ]
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((sacrement) => (
                <SacrementItem key={sacrement.id} sacrement={sacrement} />
              ))}
          </TabsContent>

          <TabsContent value="baptemes" className="space-y-4">
            {sacrements.baptemes.length > 0 ? (
              sacrements.baptemes
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((bapteme) => (
                  <SacrementItem key={bapteme.id} sacrement={bapteme} />
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                Aucun baptême prévu.
              </div>
            )}
          </TabsContent>

          <TabsContent value="communions" className="space-y-4">
            {sacrements.communions.length > 0 ? (
              sacrements.communions
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((communion) => (
                  <SacrementItem key={communion.id} sacrement={communion} />
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                Aucune communion prévue.
              </div>
            )}
          </TabsContent>

          <TabsContent value="confirmations" className="space-y-4">
            {sacrements.confirmations.length > 0 ? (
              sacrements.confirmations
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((confirmation) => (
                  <SacrementItem
                    key={confirmation.id}
                    sacrement={confirmation}
                  />
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                Aucune confirmation prévue.
              </div>
            )}
          </TabsContent>

          <TabsContent value="mariages" className="space-y-4">
            {sacrements.mariages.length > 0 ? (
              sacrements.mariages
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((mariage) => (
                  <SacrementItem key={mariage.id} sacrement={mariage} />
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                Aucun mariage prévu.
              </div>
            )}
          </TabsContent>

          <TabsContent value="onctions" className="space-y-4">
            {sacrements.onctions.length > 0 ? (
              sacrements.onctions
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((onction) => (
                  <SacrementItem key={onction.id} sacrement={onction} />
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                Aucune onction prévue.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
