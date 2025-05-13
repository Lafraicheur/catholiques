import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { Plus, Search, Filter, Download, MessageSquare, Mail, File, Clock, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Communications Vicariat | Dashboard Église Catholique",
};

// Données fictives pour les communications
const communications = [
  {
    id: 1,
    titre: "Informations sur la retraite des prêtres",
    type: "note",
    date: "2025-05-10",
    auteur: "Père Michel Lefevre",
    destinataires: ["Tous les prêtres"],
    contenu: "Chers confrères, je vous rappelle que la retraite annuelle des prêtres aura lieu du 15 au 19 septembre 2025 au Centre spirituel Saint-Ignace. Les inscriptions sont ouvertes jusqu'au 30 juin...",
    statut: "envoyé",
    importance: "haute",
    piecesJointes: [
      { nom: "programme-retraite.pdf", taille: "1.2 MB" }
    ]
  },
  {
    id: 2,
    titre: "Préparation du pèlerinage vicarial",
    type: "email",
    date: "2025-05-08",
    auteur: "Équipe pastorale",
    destinataires: ["Tous les curés", "Équipes d'animation pastorale"],
    contenu: "Dans le cadre de la préparation du pèlerinage vicarial prévu les 12-13 juillet 2025, nous sollicitons votre aide pour recenser les participants de chaque paroisse. Merci de nous faire parvenir vos listes avant le 15 juin...",
    statut: "envoyé",
    importance: "normale",
    piecesJointes: [
      { nom: "formulaire-inscription.docx", taille: "458 KB" },
      { nom: "itinéraire-pèlerinage.pdf", taille: "3.1 MB" }
    ]
  },
  {
    id: 3,
    titre: "Report de la rencontre des catéchistes",
    type: "notification",
    date: "2025-05-06",
    auteur: "Service de la catéchèse",
    destinataires: ["Catéchistes", "Responsables catéchèse"],
    contenu: "En raison d'un imprévu, la rencontre des catéchistes prévue le 5 juin est reportée au 12 juin, même horaire, même lieu. Merci de votre compréhension.",
    statut: "envoyé",
    importance: "normale",
    piecesJointes: []
  },
  {
    id: 4,
    titre: "Formation liturgique - Rappel",
    type: "email",
    date: "2025-05-05",
    auteur: "Service liturgique vicarial",
    destinataires: ["Équipes liturgiques"],
    contenu: "Nous vous rappelons que la formation liturgique sur 'L'année liturgique et ses temps forts' aura lieu le samedi 24 mai à la Maison diocésaine. La présence d'au moins un représentant par paroisse est souhaitée.",
    statut: "envoyé",
    importance: "normale",
    piecesJointes: [
      { nom: "programme-formation.pdf", taille: "845 KB" }
    ]
  },
  {
    id: 5,
    titre: "Brouillon: Préparation du temps de l'Avent",
    type: "note",
    date: "2025-05-02",
    auteur: "Père Michel Lefevre",
    destinataires: ["Tous les curés"],
    contenu: "Chers confrères, afin de préparer au mieux le temps de l'Avent, je souhaiterais organiser une rencontre au niveau vicarial pour échanger sur nos pratiques et coordonner nos actions...",
    statut: "brouillon",
    importance: "basse",
    piecesJointes: []
  },
];

// Formatage de la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Formater type de communication pour Badge
const getCommunicationTypeDetails = (type: string) => {
  switch (type) {
    case "email":
      return { label: "Email", variant: "default" as const, icon: <Mail className="h-4 w-4 mr-1" /> };
    case "note":
      return { label: "Note", variant: "secondary" as const, icon: <File className="h-4 w-4 mr-1" /> };
    case "notification":
      return { label: "Notification", variant: "outline" as const, icon: <Bell className="h-4 w-4 mr-1" /> };
    default:
      return { label: type, variant: "default" as const, icon: <MessageSquare className="h-4 w-4 mr-1" /> };
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

export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Communications</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle communication
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une communication..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {communications.map((communication) => {
            const { label: typeLabel, variant: typeVariant, icon: typeIcon } = getCommunicationTypeDetails(communication.type);
            const { label: importanceLabel, variant: importanceVariant } = getImportanceDetails(communication.importance);
            const { label: statusLabel, variant: statusVariant } = getStatusDetails(communication.statut);

            return (
              <div 
                key={communication.id} 
                className="p-4 border border-slate-200 rounded-md hover:bg-slate-50"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <div className="flex items-center gap-2 mb-2 md:mb-0">
                    <h3 className="font-medium text-slate-900">{communication.titre}</h3>
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={typeVariant} className="flex items-center">
                      {typeIcon} {typeLabel}
                    </Badge>
                    <Badge variant={importanceVariant}>
                      {importanceLabel}
                    </Badge>
                    <a 
                      href={`/dashboard/vicariat/communications/${communication.id}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-9 px-3 py-2"
                    >
                      Détails
                    </a>
                  </div>
                </div>

                <div className="flex items-center text-sm text-slate-500 gap-6 mb-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(communication.date)}
                  </div>
                  <div>
                    <span className="font-medium">De:</span> {communication.auteur}
                  </div>
                  <div>
                    <span className="font-medium">À:</span> {communication.destinataires.join(", ")}
                  </div>
                </div>

                <div className="text-slate-700 mb-3 line-clamp-2">
                  {communication.contenu}
                </div>

                {communication.piecesJointes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {communication.piecesJointes.map((piece, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-1.5 pl-2 pr-3 bg-slate-100 rounded-md text-xs"
                      >
                        <File className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                        <span className="text-slate-700 mr-1.5">{piece.nom}</span>
                        <span className="text-slate-500">({piece.taille})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {communications.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Aucune communication trouvée.
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Affichage de 1 à {communications.length} sur {communications.length} communications
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}