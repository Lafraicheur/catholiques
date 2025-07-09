// // components/sacrements/SacrementEmptyState.tsx
// import { Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface SacrementEmptyStateProps {
//   searchQuery: string;
//   onClearSearch: () => void;
// }

// export default function SacrementEmptyState({
//   searchQuery,
//   onClearSearch,
// }: SacrementEmptyStateProps) {
//   return (
//     <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
//       <Calendar className="h-12 w-12 text-slate-300 mb-4" />
//       <h3 className="text-lg font-medium text-slate-900 mb-2">
//         Aucun sacrement trouvé
//       </h3>
//       <p className="text-sm text-slate-500 max-w-md mb-4">
//         {searchQuery
//           ? "Aucun sacrement ne correspond à votre recherche."
//           : "Aucun sacrement individuel n'est enregistré pour le moment."}
//       </p>
//       {searchQuery && (
//         <Button variant="outline" onClick={onClearSearch}>
//           Effacer la recherche
//         </Button>
//       )}
//     </div>
//   );
// }

import { Church } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SacrementEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export default function SacrementEmptyState({
  searchQuery,
  onClearSearch,
}: SacrementEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-slate-200">
      <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <Church className="h-8 w-8 text-blue-600" />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        {searchQuery ? "Aucun résultat trouvé" : "Aucun sacrement enregistré"}
      </h3>

      <p className="text-slate-500 max-w-md mb-6 leading-relaxed">
        {searchQuery
          ? "Votre recherche ne correspond à aucun sacrement. Essayez avec d'autres mots-clés."
          : "Commencez par enregistrer le premier sacrement individuel de votre paroisse."}
      </p>

      {searchQuery ? (
        <Button
          variant="outline"
          onClick={onClearSearch}
          className="h-11 px-6 bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200"
        >
          Effacer la recherche
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white hover:text-white rounded-xl shadow-sm transition-all duration-200"
        >
          Actualiser la page
        </Button>
      )}
    </div>
  );
}
