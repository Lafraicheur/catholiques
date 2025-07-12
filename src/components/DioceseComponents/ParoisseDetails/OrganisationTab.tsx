import { Settings, Plus } from "lucide-react";
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
import { CureSection } from "./CureSection";
import { VicairesSection } from "./VicairesSection";

interface OrganisationTabProps {
  organisation: any;
  isNominationDialogOpen: boolean;
  setIsNominationDialogOpen: (open: boolean) => void;
  serviteurId: string;
  setServiteurId: (id: string) => void;
  isNominating: boolean;
  onNommerCure: () => void;
}

export const OrganisationTab = ({
  organisation,
  isNominationDialogOpen,
  setIsNominationDialogOpen,
  serviteurId,
  setServiteurId,
  isNominating,
  onNommerCure,
}: OrganisationTabProps) => {
  if (!organisation || typeof organisation !== "object") {
    return (
      <div className="py-12 text-center">
        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucune organisation définie
        </h3>
        <p className="text-sm text-slate-500">
          Cette paroisse n'a pas encore d'organisation structurée.
        </p>
      </div>
    );
  }

  const hasNoOrganisation = !organisation.cure && 
    (!organisation.vicaires || !Array.isArray(organisation.vicaires) || organisation.vicaires.length === 0);

  if (hasNoOrganisation) {
    return (
      <div className="py-12 text-center">
        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Organisation incomplète
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Cette paroisse n'a pas encore d'organisation structurée.
        </p>
        <Dialog
          open={isNominationDialogOpen}
          onOpenChange={setIsNominationDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nommer un curé
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nommer un curé</DialogTitle>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CureSection
        cure={organisation.cure}
        isNominationDialogOpen={isNominationDialogOpen}
        setIsNominationDialogOpen={setIsNominationDialogOpen}
        serviteurId={serviteurId}
        setServiteurId={setServiteurId}
        isNominating={isNominating}
        onNommerCure={onNommerCure}
      />
      
      <VicairesSection vicaires={organisation.vicaires} />
    </div>
  );
};