/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Users,
  User,
  Calendar,
  Filter,
  MessageSquare,
  FileText,
  PlusCircle,
  ChevronDown,
  Loader2,
  Search,
  MessagesSquare,
  Clock,
  CheckCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Types
type MessageStatus = "envoyé" | "livré" | "lu" | "échoué";
type MessageType = "sms" | "email" | "notification";
type CibleType = "tous" | "groupe" | "individuel";

interface GroupeDestinataire {
  id: number;
  nom: string;
  description: string;
  nombreDestinataires: number;
}

interface Destinataire {
  id: number;
  nom: string;
  prenoms: string;
  email?: string;
  telephone?: string;
  groupe?: string;
}

interface MessageEnvoye {
  id: number;
  titre: string;
  contenu: string;
  date: Date;
  type: MessageType;
  statut: MessageStatus;
  destinataires: number;
  cible: CibleType;
  groupeId?: number;
  groupeNom?: string;
}

interface MessageTemplate {
  id: number;
  titre: string;
  contenu: string;
  type: MessageType;
  occasionSuggere?: string;
}

// Données fictives
const groupesDestinataires: GroupeDestinataire[] = [
  {
    id: 1,
    nom: "Tous les paroissiens",
    description: "Tous les paroissiens enregistrés",
    nombreDestinataires: 876,
  },
  {
    id: 2,
    nom: "Catéchistes",
    description: "Équipe de catéchèse",
    nombreDestinataires: 15,
  },
  {
    id: 3,
    nom: "Groupe de prière",
    description: "Membres du groupe de prière",
    nombreDestinataires: 42,
  },
  {
    id: 4,
    nom: "Chorale",
    description: "Membres de la chorale paroissiale",
    nombreDestinataires: 28,
  },
  {
    id: 5,
    nom: "Conseil pastoral",
    description: "Membres du conseil pastoral",
    nombreDestinataires: 12,
  },
  {
    id: 6,
    nom: "Bénévoles",
    description: "Paroissiens qui participent aux activités de service",
    nombreDestinataires: 53,
  },
];

const destinataires: Destinataire[] = [
  {
    id: 1,
    nom: "Koné",
    prenoms: "Mariam",
    email: "mariam.kone@example.com",
    telephone: "0709876543",
    groupe: "Chorale",
  },
  {
    id: 2,
    nom: "Kouassi",
    prenoms: "Jean-Marc",
    email: "jm.kouassi@example.com",
    telephone: "0745678912",
    groupe: "Conseil pastoral",
  },
  {
    id: 3,
    nom: "Diallo",
    prenoms: "Ibrahim",
    email: "ibrahim.diallo@example.com",
    telephone: "0756781234",
    groupe: "Catéchistes",
  },
  {
    id: 4,
    nom: "Yao",
    prenoms: "Sylvie",
    email: "sylvie.yao@example.com",
    telephone: "0778901234",
    groupe: "Groupe de prière",
  },
  {
    id: 5,
    nom: "Ouattara",
    prenoms: "Pascal",
    email: "p.ouattara@example.com",
    telephone: "0789012345",
    groupe: "Catéchistes",
  },
  {
    id: 6,
    nom: "Traoré",
    prenoms: "Aminata",
    email: "aminata.traore@example.com",
    telephone: "0790123456",
    groupe: "Chorale",
  },
  {
    id: 7,
    nom: "Bamba",
    prenoms: "Issouf",
    email: "i.bamba@example.com",
    telephone: "0701234567",
    groupe: "Bénévoles",
  },
  {
    id: 8,
    nom: "Coulibaly",
    prenoms: "Marie-Claire",
    email: "marie.coulibaly@example.com",
    telephone: "0712345678",
    groupe: "Conseil pastoral",
  },
  {
    id: 9,
    nom: "Konaté",
    prenoms: "François",
    email: "f.konate@example.com",
    telephone: "0723456789",
    groupe: "Bénévoles",
  },
  {
    id: 10,
    nom: "Cissé",
    prenoms: "Fatou",
    email: "fatou.cisse@example.com",
    telephone: "0734567890",
    groupe: "Groupe de prière",
  },
];

const messagesEnvoyes: MessageEnvoye[] = [
  {
    id: 1,
    titre: "Annonce de la fête patronale",
    contenu:
      "Chers paroissiens, nous vous invitons à la fête patronale qui aura lieu le dimanche 15 juin 2025.",
    date: new Date(2025, 4, 10, 9, 30),
    type: "email",
    statut: "livré",
    destinataires: 876,
    cible: "tous",
  },
  {
    id: 2,
    titre: "Répétition chorale",
    contenu:
      "Rappel : répétition de la chorale ce samedi à 15h pour préparer la messe dominicale.",
    date: new Date(2025, 4, 8, 14, 0),
    type: "sms",
    statut: "lu",
    destinataires: 28,
    cible: "groupe",
    groupeId: 4,
    groupeNom: "Chorale",
  },
  {
    id: 3,
    titre: "Réunion du conseil pastoral",
    contenu:
      "La réunion mensuelle du conseil pastoral est reportée au mardi 20 mai à 18h30.",
    date: new Date(2025, 4, 5, 10, 15),
    type: "email",
    statut: "lu",
    destinataires: 12,
    cible: "groupe",
    groupeId: 5,
    groupeNom: "Conseil pastoral",
  },
  {
    id: 4,
    titre: "Confirmation de baptême",
    contenu:
      "Cher M. Diallo, nous confirmons la date du baptême de votre fils pour le 25 mai à 14h.",
    date: new Date(2025, 4, 3, 16, 45),
    type: "sms",
    statut: "livré",
    destinataires: 1,
    cible: "individuel",
  },
  {
    id: 5,
    titre: "Annulation de la retraite",
    contenu:
      "En raison des conditions météorologiques, la retraite spirituelle prévue ce week-end est annulée.",
    date: new Date(2025, 3, 25, 8, 0),
    type: "notification",
    statut: "envoyé",
    destinataires: 53,
    cible: "groupe",
    groupeId: 6,
    groupeNom: "Bénévoles",
  },
  {
    id: 6,
    titre: "Campagne de don",
    contenu:
      "Notre campagne de don pour les travaux de l'église commence aujourd'hui. Merci pour votre générosité.",
    date: new Date(2025, 3, 20, 12, 30),
    type: "email",
    statut: "échoué",
    destinataires: 876,
    cible: "tous",
  },
];

const messageTemplates: MessageTemplate[] = [
  {
    id: 1,
    titre: "Invitation à la messe dominicale",
    contenu:
      "Chers paroissiens,\n\nNous vous rappelons que la messe dominicale aura lieu ce dimanche à 10h30.\n\nNous espérons vous y voir nombreux.\n\nQue Dieu vous bénisse,\nLa Paroisse",
    type: "email",
    occasionSuggere: "Rappel hebdomadaire",
  },
  {
    id: 2,
    titre: "Rappel de réunion",
    contenu:
      "Rappel : la réunion du [GROUPE] aura lieu le [DATE] à [HEURE] dans [LIEU]. Votre présence est importante.",
    type: "sms",
    occasionSuggere: "Réunions",
  },
  {
    id: 3,
    titre: "Annonce d'événement spécial",
    contenu:
      "La paroisse organise [ÉVÉNEMENT] le [DATE] à [HEURE]. Nous vous invitons à y participer nombreux. Plus d'informations sur notre site web.",
    type: "notification",
    occasionSuggere: "Événements spéciaux",
  },
  {
    id: 4,
    titre: "Demande de bénévoles",
    contenu:
      "Chers paroissiens,\n\nNous recherchons des bénévoles pour [ACTIVITÉ] qui aura lieu le [DATE].\n\nSi vous êtes disponible et souhaitez participer, merci de contacter le secrétariat paroissial.\n\nMerci pour votre engagement,\nLa Paroisse",
    type: "email",
    occasionSuggere: "Appel aux bénévoles",
  },
  {
    id: 5,
    titre: "Vœux d'anniversaire",
    contenu:
      "La paroisse vous souhaite un joyeux anniversaire ! Que Dieu vous comble de ses bénédictions en ce jour spécial et tout au long de l'année.",
    type: "sms",
    occasionSuggere: "Anniversaires",
  },
];

// Composant principal
export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("nouveau");
  const [messageType, setMessageType] = useState<MessageType>("email");
  const [cibleType, setCibleType] = useState<CibleType>("groupe");
  const [groupeSelectionne, setGroupeSelectionne] = useState<string>("");
  const [destinatairesSelectionnes, setDestinatairesSelectionnes] = useState<number[]>([]);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtreGroupe, setFiltreGroupe] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");

  // États pour les modaux
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [newTemplateModalOpen, setNewTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);

  // Nouveaux états pour les modèles
  const [nouveauTemplate, setNouveauTemplate] = useState<{
    titre: string;
    contenu: string;
    type: MessageType;
    occasionSuggere: string;
  }>({
    titre: "",
    contenu: "",
    type: "email",
    occasionSuggere: "",
  });

  // Filtrer les destinataires par terme de recherche et groupe
  const filteredDestinataires = destinataires.filter((dest) => {
    const matchSearch =
      searchTerm === "" ||
      `${dest.prenoms} ${dest.nom}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.telephone?.includes(searchTerm);

    const matchGroupe =
      filtreGroupe === "" || dest.groupe === filtreGroupe;

    return matchSearch && matchGroupe;
  });

  // Filtrer les messages envoyés
  const filteredMessages = messagesEnvoyes
    .filter((msg) => {
      const matchStatut =
        filtreStatut === "" || msg.statut === filtreStatut;
      return matchStatut;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Gérer la sélection/désélection de tous les destinataires
  const handleSelectAllDestinataires = (checked: boolean) => {
    if (checked) {
      setDestinatairesSelectionnes(
        filteredDestinataires.map((dest) => dest.id)
      );
    } else {
      setDestinatairesSelectionnes([]);
    }
  };

  // Gérer la sélection/désélection d'un destinataire
  const handleSelectDestinataire = (id: number, checked: boolean) => {
    if (checked) {
      setDestinatairesSelectionnes([...destinatairesSelectionnes, id]);
    } else {
      setDestinatairesSelectionnes(
        destinatairesSelectionnes.filter((destId) => destId !== id)
      );
    }
  };

  // Utiliser un modèle
  const handleUseTemplate = (template: MessageTemplate) => {
    setTitre(template.titre);
    setContenu(template.contenu);
    setMessageType(template.type);
    setTemplateModalOpen(false);
  };

  // Créer un nouveau modèle
  const handleCreateTemplate = () => {
    const newId = messageTemplates.length + 1;
    const newTemplate: MessageTemplate = {
      id: newId,
      ...nouveauTemplate,
    };
    
    // Dans une application réelle, on enverrait cela à l'API
    // messageTemplates.push(newTemplate);
    toast.success("Modèle créé avec succès");
    setNewTemplateModalOpen(false);
    
    // Réinitialiser le formulaire
    setNouveauTemplate({
      titre: "",
      contenu: "",
      type: "email",
      occasionSuggere: "",
    });
  };

  // Envoyer le message
  const handleSendMessage = () => {
    if (!titre.trim()) {
      toast.error("Veuillez saisir un titre pour le message");
      return;
    }

    if (!contenu.trim()) {
      toast.error("Veuillez saisir un contenu pour le message");
      return;
    }

    if (cibleType === "groupe" && !groupeSelectionne) {
      toast.error("Veuillez sélectionner un groupe de destinataires");
      return;
    }

    if (
      cibleType === "individuel" &&
      destinatairesSelectionnes.length === 0
    ) {
      toast.error("Veuillez sélectionner au moins un destinataire");
      return;
    }

    setLoading(true);

    // Simuler un délai pour l'envoi
    setTimeout(() => {
      toast.success("Message envoyé avec succès");
      setLoading(false);
      // Réinitialiser le formulaire
      setTitre("");
      setContenu("");
      setGroupeSelectionne("");
      setDestinatairesSelectionnes([]);
      setActiveTab("historique");
    }, 1500);
  };

  // Formatage du statut avec badge
  const getStatusBadge = (status: MessageStatus) => {
    switch (status) {
      case "envoyé":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Send className="h-3 w-3 mr-1" />
            Envoyé
          </Badge>
        );
      case "livré":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            <CheckCheck className="h-3 w-3 mr-1" />
            Livré
          </Badge>
        );
      case "lu":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCheck className="h-3 w-3 mr-1" />
            Lu
          </Badge>
        );
      case "échoué":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Échoué
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Send className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  // Formatage du type de message avec badge
  const getTypeBadge = (type: MessageType) => {
    switch (type) {
      case "email":
        return (
          <Badge variant="secondary">
            Email
          </Badge>
        );
      case "sms":
        return (
          <Badge variant="default">
            SMS
          </Badge>
        );
      case "notification":
        return (
          <Badge variant="outline">
            Notification
          </Badge>
        );
      default:
        return (
          <Badge>
            {type}
          </Badge>
        );
    }
  };

  // Formatage du type de cible avec texte
  const getCibleText = (message: MessageEnvoye) => {
    switch (message.cible) {
      case "tous":
        return "Tous les paroissiens";
      case "groupe":
        return message.groupeNom || "Groupe";
      case "individuel":
        return "Individuel";
      default:
        return message.cible;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Communication</h1>
        <p className="text-slate-500">
          Gérez les communications avec les paroissiens
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="nouveau">
                <MessageSquare className="h-4 w-4 mr-2" /> Nouveau message
              </TabsTrigger>
              <TabsTrigger value="modeles">
                <FileText className="h-4 w-4 mr-2" /> Modèles
              </TabsTrigger>
              <TabsTrigger value="historique">
                <Clock className="h-4 w-4 mr-2" /> Historique
              </TabsTrigger>
            </TabsList>

            {/* TAB: Nouveau message */}
            <TabsContent value="nouveau" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Panneau de configuration */}
                <div className="md:col-span-1 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Type de message
                    </label>
                    <Select
                      value={messageType}
                      onValueChange={(value) =>
                        setMessageType(value as MessageType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="notification">
                          Notification App
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Envoyer à
                    </label>
                    <Select
                      value={cibleType}
                      onValueChange={(value) => setCibleType(value as CibleType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner les destinataires" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">
                          Tous les paroissiens
                        </SelectItem>
                        <SelectItem value="groupe">Groupe spécifique</SelectItem>
                        <SelectItem value="individuel">
                          Paroissiens spécifiques
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {cibleType === "groupe" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Sélectionner un groupe
                      </label>
                      <Select
                        value={groupeSelectionne}
                        onValueChange={setGroupeSelectionne}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un groupe" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupesDestinataires.map((groupe) => (
                            <SelectItem
                              key={groupe.id}
                              value={groupe.id.toString()}
                            >
                              {groupe.nom} ({groupe.nombreDestinataires})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setTemplateModalOpen(true)}
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Utiliser un modèle
                    </Button>
                  </div>
                </div>

                {/* Panneau de composition */}
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="titre" className="text-sm font-medium">
                      Titre du message
                    </label>
                    <Input
                      id="titre"
                      placeholder="Entrez le titre du message"
                      value={titre}
                      onChange={(e) => setTitre(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contenu" className="text-sm font-medium">
                      Contenu du message
                    </label>
                    <Textarea
                      id="contenu"
                      placeholder="Composez votre message ici..."
                      className="min-h-[200px]"
                      value={contenu}
                      onChange={(e) => setContenu(e.target.value)}
                    />
                  </div>

                  <div className="pt-4 flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setPreviewModalOpen(true)}
                    >
                      Aperçu
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sélection des destinataires individuels */}
              {cibleType === "individuel" && (
                <div className="border rounded-md">
                  <div className="p-4 border-b bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="font-medium text-slate-900">
                      Sélectionner les destinataires
                    </h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto"
                      />
                      <Select
                        value={filtreGroupe}
                        onValueChange={setFiltreGroupe}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filtrer par groupe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous les groupes</SelectItem>
                          {Array.from(
                            new Set(
                              destinataires
                                .map((d) => d.groupe)
                                .filter((g) => g)
                            )
                          ).map((groupe) => (
                            <SelectItem key={groupe} value={groupe!}>
                              {groupe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={
                                  filteredDestinataires.length > 0 &&
                                  filteredDestinataires.every((dest) =>
                                    destinatairesSelectionnes.includes(dest.id)
                                  )
                                }
                                onCheckedChange={handleSelectAllDestinataires}
                                aria-label="Sélectionner tous"
                              />
                            </TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Groupe</TableHead>
                            <TableHead>Contact</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDestinataires.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center h-24 text-slate-500"
                              >
                                Aucun destinataire trouvé
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredDestinataires.map((dest) => (
                              <TableRow key={dest.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={destinatairesSelectionnes.includes(
                                      dest.id
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleSelectDestinataire(
                                        dest.id,
                                        checked as boolean
                                      )
                                    }
                                    aria-label={`Sélectionner ${dest.prenoms} ${dest.nom}`}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {dest.prenoms} {dest.nom}
                                </TableCell>
                                <TableCell>
                                  {dest.groupe || (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    {dest.email && (
                                      <span className="text-sm">
                                        {dest.email}
                                      </span>
                                    )}
                                    {dest.telephone && (
                                      <span className="text-sm text-slate-500">
                                        {dest.telephone}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {destinatairesSelectionnes.length} destinataire
                      {destinatairesSelectionnes.length !== 1 && "s"}{" "}
                      sélectionné
                      {destinatairesSelectionnes.length !== 1 && "s"}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

{/* TAB: Modèles */}
           <TabsContent value="modeles" className="space-y-6">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold">Modèles de messages</h2>
               <Button onClick={() => setNewTemplateModalOpen(true)}>
                 <PlusCircle className="h-4 w-4 mr-2" />
                 Nouveau modèle
               </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {messageTemplates.map((template) => (
                 <Card key={template.id} className="overflow-hidden">
                   <CardHeader className="p-4 pb-2">
                     <div className="flex justify-between items-start">
                       <CardTitle className="text-base">{template.titre}</CardTitle>
                       {getTypeBadge(template.type)}
                     </div>
                     {template.occasionSuggere && (
                       <p className="text-xs text-slate-500 mt-1">
                         Pour : {template.occasionSuggere}
                       </p>
                     )}
                   </CardHeader>
                   <CardContent className="p-4 pt-0">
                     <div className="mt-2 text-sm bg-slate-50 p-3 rounded-md h-24 overflow-hidden relative">
                       <p className="whitespace-pre-line line-clamp-4">
                         {template.contenu}
                       </p>
                       <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent"></div>
                     </div>
                     <div className="mt-4 flex justify-end space-x-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           setSelectedTemplate(template);
                           setPreviewModalOpen(true);
                         }}
                       >
                         Aperçu
                       </Button>
                       <Button
                         size="sm"
                         onClick={() => handleUseTemplate(template)}
                       >
                         Utiliser
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </TabsContent>

           {/* TAB: Historique */}
           <TabsContent value="historique" className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
               <h2 className="text-lg font-semibold">Messages envoyés</h2>
               <div className="flex gap-2 w-full md:w-auto">
                 <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                   <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Filtrer par statut" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="">Tous les statuts</SelectItem>
                     <SelectItem value="envoyé">Envoyé</SelectItem>
                     <SelectItem value="livré">Livré</SelectItem>
                     <SelectItem value="lu">Lu</SelectItem>
                     <SelectItem value="échoué">Échoué</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>

             <div className="rounded-md border">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Date</TableHead>
                     <TableHead>Titre</TableHead>
                     <TableHead className="hidden md:table-cell">Type</TableHead>
                     <TableHead className="hidden md:table-cell">Destinataires</TableHead>
                     <TableHead>Statut</TableHead>
                     <TableHead className="w-[100px]"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredMessages.length === 0 ? (
                     <TableRow>
                       <TableCell
                         colSpan={6}
                         className="text-center h-24 text-slate-500"
                       >
                         Aucun message trouvé
                       </TableCell>
                     </TableRow>
                   ) : (
                     filteredMessages.map((message) => (
                       <TableRow key={message.id}>
                         <TableCell className="whitespace-nowrap">
                           <div className="flex flex-col">
                             <span>
                               {format(message.date, "dd MMM yyyy", {
                                 locale: fr,
                               })}
                             </span>
                             <span className="text-xs text-slate-500">
                               {format(message.date, "HH:mm", {
                                 locale: fr,
                               })}
                             </span>
                           </div>
                         </TableCell>
                         <TableCell>{message.titre}</TableCell>
                         <TableCell className="hidden md:table-cell">
                           {getTypeBadge(message.type)}
                         </TableCell>
                         <TableCell className="hidden md:table-cell">
                           <div className="flex items-center">
                             <Users className="h-4 w-4 mr-2 text-slate-500" />
                             <span>
                               {message.destinataires}{" "}
                               <span className="text-xs text-slate-500">
                                 ({getCibleText(message)})
                               </span>
                             </span>
                           </div>
                         </TableCell>
                         <TableCell>{getStatusBadge(message.statut)}</TableCell>
                         <TableCell>
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="sm">
                                 <ChevronDown className="h-4 w-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuItem
                                 onClick={() => {
                                   setSelectedTemplate({
                                     id: 0,
                                     titre: message.titre,
                                     contenu: message.contenu,
                                     type: message.type,
                                   });
                                   setPreviewModalOpen(true);
                                 }}
                               >
                                 Voir le contenu
                               </DropdownMenuItem>
                               <DropdownMenuItem
                                 onClick={() => {
                                   setTitre(message.titre);
                                   setContenu(message.contenu);
                                   setMessageType(message.type);
                                   setActiveTab("nouveau");
                                 }}
                               >
                                 Réutiliser
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
             </div>
           </TabsContent>
         </Tabs>
       </CardContent>
     </Card>

     {/* Modal d'aperçu */}
     <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
       <DialogContent className="sm:max-w-lg">
         <DialogHeader>
           <DialogTitle>
             {selectedTemplate
               ? selectedTemplate.titre
               : titre || "Aperçu du message"}
           </DialogTitle>
         </DialogHeader>

         <div className="space-y-3 my-2">
           {getTypeBadge(selectedTemplate ? selectedTemplate.type : messageType)}

           <div className="mt-2 bg-slate-50 p-4 rounded-md max-h-[300px] overflow-y-auto">
             <p className="whitespace-pre-line">
               {selectedTemplate ? selectedTemplate.contenu : contenu}
             </p>
           </div>
         </div>

         <DialogFooter className="sm:justify-between">
           <Button variant="outline" onClick={() => setPreviewModalOpen(false)}>
             Fermer
           </Button>
           {selectedTemplate && (
             <Button onClick={() => handleUseTemplate(selectedTemplate)}>
               Utiliser ce modèle
             </Button>
           )}
         </DialogFooter>
       </DialogContent>
     </Dialog>

     {/* Modal de sélection de modèle */}
     <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
       <DialogContent className="sm:max-w-xl">
         <DialogHeader>
           <DialogTitle>Choisir un modèle de message</DialogTitle>
           <DialogDescription>
             Sélectionnez un modèle pour votre message
           </DialogDescription>
         </DialogHeader>

         <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
           {messageTemplates.map((template) => (
             <div
               key={template.id}
               className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
               onClick={() => handleUseTemplate(template)}
             >
               <div className="flex justify-between items-start mb-1">
                 <h4 className="font-medium">{template.titre}</h4>
                 {getTypeBadge(template.type)}
               </div>
               {template.occasionSuggere && (
                 <p className="text-xs text-slate-500 mb-2">
                   Pour : {template.occasionSuggere}
                 </p>
               )}
               <p className="text-sm text-slate-600 line-clamp-2">
                 {template.contenu}
               </p>
             </div>
           ))}
         </div>

         <DialogFooter>
           <Button
             variant="outline"
             onClick={() => setTemplateModalOpen(false)}
           >
             Annuler
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>

     {/* Modal de création de modèle */}
     <Dialog
       open={newTemplateModalOpen}
       onOpenChange={setNewTemplateModalOpen}
     >
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Créer un nouveau modèle</DialogTitle>
         </DialogHeader>

         <div className="space-y-4 py-2">
           <div className="space-y-2">
             <label className="text-sm font-medium">Type de message</label>
             <Select
               value={nouveauTemplate.type}
               onValueChange={(value) =>
                 setNouveauTemplate({
                   ...nouveauTemplate,
                   type: value as MessageType,
                 })
               }
             >
               <SelectTrigger>
                 <SelectValue placeholder="Sélectionner un type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="email">Email</SelectItem>
                 <SelectItem value="sms">SMS</SelectItem>
                 <SelectItem value="notification">Notification App</SelectItem>
               </SelectContent>
             </Select>
           </div>

           <div className="space-y-2">
             <label htmlFor="template-titre" className="text-sm font-medium">
               Titre du modèle
             </label>
             <Input
               id="template-titre"
               placeholder="Entrez le titre du modèle"
               value={nouveauTemplate.titre}
               onChange={(e) =>
                 setNouveauTemplate({
                   ...nouveauTemplate,
                   titre: e.target.value,
                 })
               }
             />
           </div>

           <div className="space-y-2">
             <label
               htmlFor="occasion-suggeree"
               className="text-sm font-medium"
             >
               Occasion suggérée (optionnel)
             </label>
             <Input
               id="occasion-suggeree"
               placeholder="Ex: Anniversaires, Réunions, etc."
               value={nouveauTemplate.occasionSuggere}
               onChange={(e) =>
                 setNouveauTemplate({
                   ...nouveauTemplate,
                   occasionSuggere: e.target.value,
                 })
               }
             />
           </div>

           <div className="space-y-2">
             <label
               htmlFor="template-contenu"
               className="text-sm font-medium"
             >
               Contenu du modèle
             </label>
             <Textarea
               id="template-contenu"
               placeholder="Composez votre modèle ici..."
               className="min-h-[150px]"
               value={nouveauTemplate.contenu}
               onChange={(e) =>
                 setNouveauTemplate({
                   ...nouveauTemplate,
                   contenu: e.target.value,
                 })
               }
             />
             <p className="text-xs text-slate-500">
               Utilisez [TEXTE] pour les parties à remplacer (ex: [DATE],
               [HEURE], etc.)
             </p>
           </div>
         </div>

         <DialogFooter>
           <Button
             variant="outline"
             onClick={() => setNewTemplateModalOpen(false)}
           >
             Annuler
           </Button>
           <Button
             onClick={handleCreateTemplate}
             disabled={
               !nouveauTemplate.titre.trim() ||
               !nouveauTemplate.contenu.trim()
             }
           >
             Créer le modèle
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   </div>
 );
}