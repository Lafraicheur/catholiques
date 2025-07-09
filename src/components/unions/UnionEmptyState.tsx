// components/unions/UnionEmptyState.tsx
// import { Users } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface UnionEmptyStateProps {
//   searchQuery: string;
//   onClearSearch: () => void;
// }

// export default function UnionEmptyState({
//   searchQuery,
//   onClearSearch,
// }: UnionEmptyStateProps) {
//   return (
//     <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
//       <Users className="h-12 w-12 text-slate-300 mb-4" />
//       <h3 className="text-lg font-medium text-slate-900 mb-2">
//         Aucun sacrement trouvé
//       </h3>
//       <p className="text-sm text-slate-500 max-w-md mb-4">
//         {searchQuery
//           ? "Aucun sacrement ne correspond à votre recherche."
//           : "Aucun sacrement d'union n'est enregistré pour le moment."}
//       </p>
//       {searchQuery && (
//         <Button variant="outline" onClick={onClearSearch}>
//           Effacer la recherche
//         </Button>
//       )}
//     </div>
//   );
// }

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnionEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export default function UnionEmptyState({
  searchQuery,
  onClearSearch,
}: UnionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-pink-50 to-rose-100/50 rounded-2xl border border-slate-200">
      <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mb-6">
        <Heart className="h-8 w-8 text-pink-600" />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        {searchQuery ? "Aucune union trouvée" : "Aucune union enregistrée"}
      </h3>

      <p className="text-slate-500 max-w-md mb-6 leading-relaxed">
        {searchQuery
          ? "Votre recherche ne correspond à aucun sacrement d'union. Essayez avec d'autres noms."
          : "Commencez par enregistrer la première union bénie dans votre paroisse."}
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
          className="h-11 px-6 bg-pink-600 hover:bg-pink-700 text-white hover:text-white rounded-xl shadow-sm transition-all duration-200"
        >
          <Heart className="h-4 w-4 mr-2" />
          Actualiser la page
        </Button>
      )}
    </div>
  );
}
