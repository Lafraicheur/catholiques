import { Settings, Church } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganisationTab } from "./OrganisationTab";
import { ParoissesTab } from "./ParoissesTab";

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  organisation: any;
  filteredParoisses: any[];
  currentPageParoisses: number;
  totalPagesParoisses: number;
  itemsPerPage: number;
  onPreviousPageParoisses: () => void;
  onNextPageParoisses: () => void;
  onViewParoisseDetails: (id: number) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const MainTabs = ({
  activeTab,
  setActiveTab,
  organisation,
  filteredParoisses,
  currentPageParoisses,
  totalPagesParoisses,
  itemsPerPage,
  onPreviousPageParoisses,
  onNextPageParoisses,
  onViewParoisseDetails,
  searchQuery,
  onClearSearch,
}: MainTabsProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header avec onglets */}
        <div className="px-6 py-4 border-b border-slate-200">
          <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-2">
            <TabsTrigger
              value="organisation"
              className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Organisation
            </TabsTrigger>
            <TabsTrigger
              value="paroisses"
              className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <Church className="h-4 w-4 mr-2" />
              Paroisses ({filteredParoisses.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          <TabsContent value="organisation" className="mt-0">
            <OrganisationTab organisation={organisation} />
          </TabsContent>

          <TabsContent value="paroisses" className="mt-0">
            <ParoissesTab
              paroisses={filteredParoisses}
              currentPage={currentPageParoisses}
              totalPages={totalPagesParoisses}
              itemsPerPage={itemsPerPage}
              onPreviousPage={onPreviousPageParoisses}
              onNextPage={onNextPageParoisses}
              onViewDetails={onViewParoisseDetails}
              searchQuery={searchQuery}
              onClearSearch={onClearSearch}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};