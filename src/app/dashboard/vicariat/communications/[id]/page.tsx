/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash,
  Clock,
  User,
  Users,
  MessageSquare,
  Mail,
  File,
  Bell,
  Download,
  Reply,
  Forward,
  Share2,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Détail Communication | Dashboard Église Catholique",
};

interface CommunicationDetailPageProps {
  params: {
    id: string;
  };
}

// Simulation de la récupération des données d'une communication
const getCommunication = (id: string) => {
  // Dans une application réelle, vous feriez un appel API ici
  const communications = [
    {
      id: "1",
      titre: "Informations sur la retraite des prêtres",
      type: "note",
      date: "2025-05-10",
      auteur: "Père Michel Lefevre",
      destinataires: ["Tous les prêtres"],
      contenu: `Chers confrères,
Je vous rappelle que la retraite annuelle des prêtres aura lieu du 15 au 19 septembre 2025 au Centre spirituel Saint-Ignace. Les inscriptions sont ouvertes jusqu'au 30 juin.

Cette année, la retraite sera prêchée par Mgr Jean Marchand, évêque émérite de Clermont, sur le thème "Le prêtre, témoin de la miséricorde divine". 

Le coût de la retraite est de 350€ par personne, tout compris. Le diocèse prend en charge la moitié de ce montant. Pour vous inscrire, veuillez remplir le formulaire joint et le renvoyer au secrétariat vicarial.

Veuillez noter que votre présence est vivement souhaitée. En cas d'impossibilité majeure, merci de me contacter personnellement.

Fraternellement en Christ,
P. Michel Lefevre
Vicaire épiscopal`,
      statut: "envoyé",
      importance: "haute",
      dateDenvoi: "2025-05-10 09:15",
      piecesJointes: [{ nom: "programme-retraite.pdf", taille: "1.2 MB" }],
      lecteurs: [
        { nom: "Père Thomas Bernard", date: "2025-05-10 10:23" },
        { nom: "Père Jean Dupont", date: "2025-05-10 14:45" },
        { nom: "Père François Martin", date: "2025-05-11 08:12" },
      ],
    },
    {
      id: "2",
      titre: "Préparation du pèlerinage vicarial",
      type: "email",
      date: "2025-05-08",
      auteur: "Équipe pastorale",
      destinataires: ["Tous les curés", "Équipes d'animation pastorale"],
      contenu: `Chers frères et sœurs,

Dans le cadre de la préparation du pèlerinage vicarial prévu les 12-13 juillet 2025, nous sollicitons votre aide pour recenser les participants de chaque paroisse. Merci de nous faire parvenir vos listes avant le 15 juin.

Vous trouverez en pièce jointe le formulaire d'inscription à remplir ainsi que l'itinéraire détaillé du pèlerinage. Le coût est de 85€ par adulte et 45€ par enfant de moins de 12 ans.

Le programme comprend :
- Une visite guidée du sanctuaire Notre-Dame
- Une veillée de prière le samedi soir
- La messe dominicale présidée par notre vicaire épiscopal
- Des temps d'échange et de convivialité

Le départ se fera en bus depuis la place de la cathédrale le samedi 12 juillet à 8h30. Le retour est prévu le dimanche 13 juillet vers 18h00.

Nous vous remercions d'avance pour votre collaboration.

Cordialement,
L'équipe pastorale vicariale`,
      statut: "envoyé",
      importance: "normale",
      dateDenvoi: "2025-05-08 16:30",
      piecesJointes: [
        { nom: "formulaire-inscription.docx", taille: "458 KB" },
        { nom: "itinéraire-pèlerinage.pdf", taille: "3.1 MB" },
      ],
      lecteurs: [
        { nom: "Père Thomas Bernard", date: "2025-05-08 17:05" },
        { nom: "Père Jean Dupont", date: "2025-05-09 09:23" },
        { nom: "Marie Martin", date: "2025-05-09 10:47" },
        { nom: "Sophie Petit", date: "2025-05-10 11:19" },
      ],
    },
  ];

  return communications.find((c) => c.id === id);
};

// Formatage de la date avec heure
const formatDateTime = (dateTimeString: string) => {
  const [date, time] = dateTimeString.split(" ");
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })} à ${time}`;
};

// Formater type de communication pour Badge
const getCommunicationTypeDetails = (type: string) => {
  switch (type) {
    case "email":
      return {
        label: "Email",
        variant: "default" as const,
        icon: <Mail className="h-4 w-4 mr-1" />,
      };
    case "note":
      return {
        label: "Note",
        variant: "secondary" as const,
        icon: <File className="h-4 w-4 mr-1" />,
      };
    case "notification":
      return {
        label: "Notification",
        variant: "outline" as const,
        icon: <Bell className="h-4 w-4 mr-1" />,
      };
    default:
      return {
        label: type,
        variant: "default" as const,
        icon: <MessageSquare className="h-4 w-4 mr-1" />,
      };
  }
};

// Formater importance pour Badge
const getImportanceDetails = (importance: string) => {
  switch (importance) {
    case "haute":
      return { label: "Haute", variant: "destructive" as const };
    case "normale":
      return { label: "Normale", variant: "secondary" as const };
    case "basse":
      return { label: "Basse", variant: "outline" as const };
    default:
      return { label: importance, variant: "outline" as const };
  }
};

// Formater statut pour Badge
const getStatusDetails = (statut: string) => {
  switch (statut) {
    case "envoyé":
      return { label: "Envoyé", variant: "success" as const };
    case "brouillon":
      return { label: "Brouillon", variant: "outline" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

export default function CommunicationDetailPage({
  params,
}: CommunicationDetailPageProps) {
  const communication = getCommunication(params.id);

  if (!communication) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Communication non trouvée
        </h1>
        <p className="text-slate-600 mb-6">
          La communication que vous recherchez n'existe pas.
        </p>
        <Link href="/dashboard/vicariat/communications" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  const { label: typeLabel, icon: typeIcon } = getCommunicationTypeDetails(
    communication.type
  );
  const { label: importanceLabel, variant: importanceVariant } =
    getImportanceDetails(communication.importance);
  const { label: statusLabel, variant: statusVariant } = getStatusDetails(
    communication.statut
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/vicariat/communications" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {communication.titre}
          </h1>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          <Badge variant={importanceVariant}>{importanceLabel}</Badge>
        </div>
        <div className="flex gap-2">
          {communication.statut === "brouillon" && (
            <Button>
              <Mail className="mr-2 h-4 w-4" /> Envoyer
            </Button>
          )}
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
              <CardTitle className="flex items-center">
                {typeIcon}{" "}
                <span className="ml-2">
                  {typeLabel} - {communication.titre}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">De</p>
                    <p className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      {communication.auteur}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">
                      Date d'envoi
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-slate-400" />
                      {formatDateTime(communication.dateDenvoi)}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-full">
                    <p className="text-sm font-medium text-slate-500">À</p>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-slate-400" />
                      {communication.destinataires.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="whitespace-pre-line text-slate-700 border-b border-slate-100 pb-4">
                  {communication.contenu}
                </div>

                {communication.piecesJointes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">
                      Pièces jointes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {communication.piecesJointes.map((piece, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 pl-3 pr-4 border border-slate-200 rounded-md text-sm bg-slate-50"
                        >
                          <File className="h-4 w-4 mr-2 text-slate-500" />
                          <span className="text-slate-700 mr-2">
                            {piece.nom}
                          </span>
                          <span className="text-slate-500">
                            ({piece.taille})
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <Reply className="mr-2 h-4 w-4" /> Répondre
                </Button>
                <Button className="w-full justify-start">
                  <Forward className="mr-2 h-4 w-4" /> Transférer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" /> Télécharger
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" /> Partager
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Printer className="mr-2 h-4 w-4" /> Imprimer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques de lecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Envoyé à</span>
                  <span className="font-medium">
                    {communication.destinataires.length} destinataire(s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Lu par</span>
                  <span className="font-medium">
                    {communication.lecteurs.length} personne(s)
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Détail des lectures
                  </h3>
                  <div className="space-y-3">
                    {communication.lecteurs.map((lecteur, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border border-slate-200 rounded-md text-sm"
                      >
                        <span className="text-slate-700">{lecteur.nom}</span>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(lecteur.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
