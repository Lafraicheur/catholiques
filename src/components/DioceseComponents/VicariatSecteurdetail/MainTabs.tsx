/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Settings, Building2, Church } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganisationTab } from "./OrganisationTab";
import { DoyennesTab } from "./DoyennesTab";
import { ParoissesTab } from "./ParoissesTab";

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  organisation: any;
  filteredDoyennes: any[];
  filteredParoisses: any[];
  currentPageDoyennes: number;
  currentPageParoisses: number;
  totalPagesDoyennes: number;
  totalPagesParoisses: number;
  itemsPerPage: number;
  onPreviousPageDoyennes: () => void;
  onNextPageDoyennes: () => void;
  onPreviousPageParoisses: () => void;
  onNextPageParoisses: () => void;
  onViewDoyenneDetails: (id: number) => void;
  onViewParoisseDetails: (id: number) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const MainTabs = ({
  activeTab,
  setActiveTab,
  organisation,
  filteredDoyennes,
  filteredParoisses,
  currentPageDoyennes,
  currentPageParoisses,
  totalPagesDoyennes,
  totalPagesParoisses,
  itemsPerPage,
  onPreviousPageDoyennes,
  onNextPageDoyennes,
  onPreviousPageParoisses,
  onNextPageParoisses,
  onViewDoyenneDetails,
  onViewParoisseDetails,
  searchQuery,
  onClearSearch,
}: MainTabsProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header avec onglets */}
        <div className="px-6 py-4 border-b border-slate-200">
          <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-3">
            <TabsTrigger
              value="organisation"
              className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Organisation
            </TabsTrigger>
            <TabsTrigger
              value="doyennes"
              className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Doyennés ({filteredDoyennes.length})
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

          <TabsContent value="doyennes" className="mt-0">
            <DoyennesTab
              doyennes={filteredDoyennes}
              currentPage={currentPageDoyennes}
              totalPages={totalPagesDoyennes}
              itemsPerPage={itemsPerPage}
              onPreviousPage={onPreviousPageDoyennes}
              onNextPage={onNextPageDoyennes}
              onViewDetails={onViewDoyenneDetails}
              searchQuery={searchQuery}
              onClearSearch={onClearSearch}
            />
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