import { Users, User, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getFullName } from "@/services/ParoiseofDiocese";

interface VicairesSectionProps {
  vicaires: any[];
}

export const VicairesSection = ({ vicaires }: VicairesSectionProps) => {
  if (!vicaires || !Array.isArray(vicaires) || vicaires.length === 0) {
    return null;
  }

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Vicaires</h3>
            <p className="text-sm text-slate-600">
              {vicaires.length} vicaire(s)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vicaires.map((vicaire: any, index: number) => (
            <div
              key={vicaire.id || index}
              className="bg-white rounded-lg p-4 border border-green-200"
            >
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                  <User className="h-5 w-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 mb-1">
                    {getFullName(vicaire)}
                  </h4>
                  {vicaire.num_de_telephone && (
                    <div className="flex items-center text-sm text-slate-600 mb-1">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{vicaire.num_de_telephone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};