/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Crown, Phone, Edit, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getFullName } from "@/services/ParoiseofDiocese";

interface CureSectionProps {
  cure: any;
  isNominationDialogOpen: boolean;
  setIsNominationDialogOpen: (open: boolean) => void;
  serviteurId: string;
  setServiteurId: (id: string) => void;
  isNominating: boolean;
  onNommerCure: () => void;
}

export const CureSection = ({
  cure,
  isNominationDialogOpen,
  setIsNominationDialogOpen,
  serviteurId,
  setServiteurId,
  isNominating,
  onNommerCure,
}: CureSectionProps) => {
  const DialogComponent = () => (
    <Dialog
      open={isNominationDialogOpen}
      onOpenChange={setIsNominationDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={cure ? "outline" : undefined}
          size="sm"
          className={cure ? "h-8" : "h-8 bg-blue-600 hover:bg-blue-700"}
        >
          {cure ? (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Changer
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Nommer
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {cure ? "Nommer un nouveau curé" : "Nommer un curé"}
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un serviteur pour le nommer comme curé de cette paroisse.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="serviteur_id">ID du Serviteur</Label>
            <Input
              id="serviteur_id"
              type="number"
              placeholder="Entrez l'ID du serviteur"
              value={serviteurId}
              onChange={(e) => setServiteurId(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Vous devez connaître l'ID du serviteur à nommer.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsNominationDialogOpen(false);
              setServiteurId("");
            }}
            disabled={isNominating}
          >
            Annuler
          </Button>
          <Button
            onClick={onNommerCure}
            disabled={!serviteurId || isNominating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isNominating ? "Nomination..." : "Nommer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (cure) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Crown className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Curé</h3>
                <p className="text-sm text-slate-600">
                  Responsable de la paroisse
                </p>
              </div>
            </div>
            <DialogComponent />
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-xl font-bold text-slate-800 mb-2">
              {getFullName(cure)}
            </h4>
            {cure.num_de_telephone && (
              <div className="flex items-center text-slate-600 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                <span>{cure.num_de_telephone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-gray-50/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
              <Crown className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Curé</h3>
              <p className="text-sm text-slate-600">Aucun curé assigné</p>
            </div>
          </div>
          <DialogComponent />
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-slate-500">
            Cette paroisse n'a pas encore de curé assigné.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};