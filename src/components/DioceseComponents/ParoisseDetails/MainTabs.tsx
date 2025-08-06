/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Settings, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganisationTab } from "./OrganisationTab";
import { ParoissiensTab } from "./ParoissiensTab";

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredParoissiens: any[];
  organisation: any;
  isNominationDialogOpen: boolean;
  setIsNominationDialogOpen: (open: boolean) => void;
  serviteurId: string;
  setServiteurId: (id: string) => void;
  isNominating: boolean;
  onNommerCure: () => void;
  currentPageParoissiens: number;
  totalPagesParoissiens: number;
  itemsPerPage: number;
  onPreviousPageParoissiens: () => void;
  onNextPageParoissiens: () => void;
  onViewParoissienDetails: (id: number) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const MainTabs = ({
  activeTab,
  setActiveTab,
  filteredParoissiens,
  organisation,
  isNominationDialogOpen,
  setIsNominationDialogOpen,
  serviteurId,
  setServiteurId,
  isNominating,
  onNommerCure,
  currentPageParoissiens,
  totalPagesParoissiens,
  itemsPerPage,
  onPreviousPageParoissiens,
  onNextPageParoissiens,
  onViewParoissienDetails,
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
              value="paroissiens"
              className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <Users className="h-4 w-4 mr-2" />
              Paroissiens ({filteredParoissiens.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          <TabsContent value="organisation" className="mt-0">
            <OrganisationTab
              organisation={organisation}
              isNominationDialogOpen={isNominationDialogOpen}
              setIsNominationDialogOpen={setIsNominationDialogOpen}
              serviteurId={serviteurId}
              setServiteurId={setServiteurId}
              isNominating={isNominating}
              onNommerCure={onNommerCure}
            />
          </TabsContent>

          <TabsContent value="paroissiens" className="mt-0">
            <ParoissiensTab
              paroissiens={filteredParoissiens}
              currentPage={currentPageParoissiens}
              totalPages={totalPagesParoissiens}
              itemsPerPage={itemsPerPage}
              onPreviousPage={onPreviousPageParoissiens}
              onNextPage={onNextPageParoissiens}
              // onViewDetails={onViewParoissienDetails}
              searchQuery={searchQuery}
              onClearSearch={onClearSearch}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};