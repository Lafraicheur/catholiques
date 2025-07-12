import { Settings, Crown, Users, User, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrganisationTabProps {
  organisation: any;
}

export const OrganisationTab = ({ organisation }: OrganisationTabProps) => {
  if (!organisation || typeof organisation !== "object") {
    return (
      <div className="py-12 text-center">
        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucune organisation définie
        </h3>
        <p className="text-sm text-slate-500">
          Ce vicariat/secteur n'a pas encore d'organisation structurée.
        </p>
      </div>
    );
  }

  const hasVicaireEpiscopal = organisation.vicaire_episcopal &&
    organisation.vicaire_episcopal.nom &&
    organisation.vicaire_episcopal.prenoms;

  const hasCureDoyens = organisation.cure_doyens &&
    Array.isArray(organisation.cure_doyens) &&
    organisation.cure_doyens.length > 0;

  if (!hasVicaireEpiscopal && !hasCureDoyens) {
    return (
      <div className="py-12 text-center">
        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Organisation incomplète
        </h3>
        <p className="text-sm text-slate-500">
          Les informations d'organisation de ce vicariat/secteur sont incomplètes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vicaire Épiscopal */}
      {hasVicaireEpiscopal && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Crown className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Vicaire Épiscopal
                </h3>
                <p className="text-sm text-slate-600">
                  Responsable du vicariat/secteur
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="text-xl font-bold text-slate-800 mb-2">
                {organisation.vicaire_episcopal.prenoms}{" "}
                {organisation.vicaire_episcopal.nom}
              </h4>

              {organisation.vicaire_episcopal.num_de_telephone && (
                <div className="flex items-center text-slate-600 mb-2">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{organisation.vicaire_episcopal.num_de_telephone}</span>
                </div>
              )}

              {organisation.vicaire_episcopal.email && (
                <div className="flex items-center text-slate-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{organisation.vicaire_episcopal.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Curés Doyens */}
      {hasCureDoyens && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Curés Doyens
                </h3>
                <p className="text-sm text-slate-600">
                  {organisation.cure_doyens.length} curé(s) doyen(s)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organisation.cure_doyens.map((cure: any, index: number) => (
                <div
                  key={cure.id || index}
                  className="bg-white rounded-lg p-4 border border-green-200"
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                      <User className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 mb-1">
                        {cure.prenoms} {cure.nom}
                      </h4>

                      {cure.num_de_telephone && (
                        <div className="flex items-center text-sm text-slate-600 mb-1">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{cure.num_de_telephone}</span>
                        </div>
                      )}

                      {cure.email && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="h-3 w-3 mr-1" />
                          <span>{cure.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};