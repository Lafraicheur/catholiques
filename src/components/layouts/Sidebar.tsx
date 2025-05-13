"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  Home,
  ChevronDown,
  ChevronRight,
  Heart,
  PieChart,
  MessageSquare,
  Settings,
  Church,
  Landmark,
  Building,
  CalendarDays,
  Handshake,
  HandHelping,
  Ribbon,
  AppWindow,
  CreditCard,
  Wallet,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  isSubmenuOpen?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
}

interface NavItemWithSubMenuProps {
  icon: React.ReactNode;
  title: string;
  submenuItems: {
    href: string;
    title: string;
    icon?: React.ReactNode;
  }[];
  isActive: boolean;
}

const SidebarItem = ({
  href,
  icon,
  title,
  isActive,
  isSubmenuOpen,
  hasSubmenu,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-2 px-4 text-sm font-medium rounded-md hover:bg-slate-700",
        isActive ? "bg-slate-700 text-white" : "text-slate-300"
      )}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <span>{title}</span>
      {hasSubmenu && (
        <div className="ml-auto">
          {isSubmenuOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </div>
      )}
    </Link>
  );
};

const NavItemWithSubMenu = ({
  icon,
  title,
  submenuItems,
  isActive,
}: NavItemWithSubMenuProps) => {
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-2 px-4 text-sm font-medium rounded-md cursor-pointer hover:bg-slate-700",
          isActive ? "bg-slate-700 text-white" : "text-slate-300"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-3">{icon}</div>
        <span>{title}</span>
        <div className="ml-auto">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="pl-4 mt-1 space-y-1">
          {submenuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center py-2 px-4 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700"
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  // Déterminer le niveau administratif actuel (diocèse, vicariat, doyenne ou paroisse)
  const isInDiocese = pathname.startsWith("/dashboard/diocese");
  const isInVicariat = pathname.startsWith("/dashboard/vicariat");
  const isInDoyenne = pathname.startsWith("/dashboard/doyenne");
  const isInParoisse = pathname.startsWith("/dashboard/paroisse");

  if (!isOpen) {
    return (
      <div className="fixed inset-y-0 left-0 z-20 w-16 bg-slate-800 overflow-y-auto transition-all">
        <div className="flex flex-col items-center py-4">
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mb-4">
            <Church size={16} className="text-slate-800" />
          </div>
          {/* Icônes uniquement pour le mode réduit */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="p-2 rounded-md text-slate-300 hover:bg-slate-700 cursor-pointer">
              <Home size={20} />
            </div>
            <div className="p-2 rounded-md text-slate-300 hover:bg-slate-700 cursor-pointer">
              <Users size={20} />
            </div>
            <div className="p-2 rounded-md text-slate-300 hover:bg-slate-700 cursor-pointer">
              <Calendar size={20} />
            </div>
            <div className="p-2 rounded-md text-slate-300 hover:bg-slate-700 cursor-pointer">
              <PieChart size={20} />
            </div>
            <div className="p-2 rounded-md text-slate-300 hover:bg-slate-700 cursor-pointer">
              <MessageSquare size={20} />
            </div>
            <div className="p-2 rounded-md text-slate-300 hover:bg-slate-700 cursor-pointer">
              <Settings size={20} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ajuster le menu en fonction du niveau actuel
  let menuItems;

  if (isInParoisse) {
    menuItems = (
      <>
        <SidebarItem
          href="/dashboard/paroisse"
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === "/dashboard/paroisse"}
        />
        <SidebarItem
          href="/dashboard/paroisse/paroissiens"
          icon={<Users size={20} />}
          title="Paroissiens"
          isActive={pathname.startsWith("/dashboard/paroisse/paroissiens")}
        />
        <SidebarItem
          href="/dashboard/paroisse/sacrements"
          icon={<Heart size={20} />}
          title="Sacrements"
          isActive={pathname.startsWith("/dashboard/paroisse/sacrements")}
        />
        <NavItemWithSubMenu
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith("/dashboard/paroisse/evenements")}
          submenuItems={[
            {
              href: "/dashboard/paroisse/evenements",
              icon: <CalendarDays size={20} />,
              title: "Tous les événements",
            },
            {
              href: "/dashboard/paroisse/evenements/messes",
              icon: <Handshake size={20} />,
              title: "Messes",
            },

            {
              href: "/dashboard/paroisse/evenements/demandes",
              icon: <HandHelping size={20} />,
              title: "Demandes",
            },
          ]}
        />
        <SidebarItem
          href="/dashboard/paroisse/communautes"
          icon={<Users size={20} />}
          title="Communautés"
          isActive={pathname.startsWith("/dashboard/paroisse/communautes")}
        />
        <NavItemWithSubMenu
          icon={<PieChart size={20} />}
          title="Finances"
          isActive={pathname.startsWith("/dashboard/paroisse/finances")}
          submenuItems={[
            {
              href: "/dashboard/paroisse/finances",
              icon: <AppWindow size={20} />,
              title: "Vue générale",
            },
            {
              href: "/dashboard/paroisse/finances/cotisations",
              icon: <Wallet size={20} />,
              title: "Cotisations",
            },
            {
              href: "/dashboard/paroisse/finances/quetes",
              icon: <CreditCard size={20} />,
              title: "Quêtes",
            },
            {
              href: "/dashboard/paroisse/finances/dons",
              icon: <Ribbon size={20} />,
              title: "Dons",
            },
          ]}
        />
        <SidebarItem
          href="/dashboard/paroisse/communications"
          icon={<MessageSquare size={20} />}
          title="Communications"
          isActive={pathname.startsWith("/dashboard/paroisse/communications")}
        />
      </>
    );
  } else if (isInDoyenne) {
    menuItems = (
      <>
        <SidebarItem
          href="/dashboard/doyenne"
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === "/dashboard/doyenne"}
        />
        <SidebarItem
          href="/dashboard/doyenne/paroisses"
          icon={<Church size={20} />}
          title="Paroisses"
          isActive={pathname.startsWith("/dashboard/doyenne/paroisses")}
        />
        <SidebarItem
          href="/dashboard/doyenne/evenements"
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith("/dashboard/doyenne/evenements")}
        />
        <SidebarItem
          href="/dashboard/doyenne/communications"
          icon={<MessageSquare size={20} />}
          title="Communications"
          isActive={pathname.startsWith("/dashboard/doyenne/communications")}
        />
      </>
    );
  } else if (isInVicariat) {
    menuItems = (
      <>
        <SidebarItem
          href="/dashboard/vicariat"
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === "/dashboard/vicariat"}
        />
        <SidebarItem
          href="/dashboard/vicariat/doyennes"
          icon={<Building size={20} />}
          title="Doyennés"
          isActive={pathname.startsWith("/dashboard/vicariat/doyennes")}
        />
        <SidebarItem
          href="/dashboard/vicariat/evenements"
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith("/dashboard/vicariat/evenements")}
        />
        <SidebarItem
          href="/dashboard/vicariat/communications"
          icon={<MessageSquare size={20} />}
          title="Communications"
          isActive={pathname.startsWith("/dashboard/vicariat/communications")}
        />
      </>
    );
  } else if (isInDiocese) {
    menuItems = (
      <>
        <SidebarItem
          href="/dashboard/diocese"
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === "/dashboard/diocese"}
        />
        <SidebarItem
          href="/dashboard/diocese/vicariats"
          icon={<Building size={20} />}
          title="Vicariats"
          isActive={pathname.startsWith("/dashboard/diocese/vicariats")}
        />
        <SidebarItem
          href="/dashboard/diocese/doyennes"
          icon={<Building size={20} />}
          title="Doyennés"
          isActive={pathname.startsWith("/dashboard/diocese/doyennes")}
        />
        <SidebarItem
          href="/dashboard/diocese/paroisses"
          icon={<Church size={20} />}
          title="Paroisses"
          isActive={pathname.startsWith("/dashboard/diocese/paroisses")}
        />
        <SidebarItem
          href="/dashboard/diocese/serviteurs"
          icon={<Users size={20} />}
          title="Serviteurs"
          isActive={pathname.startsWith("/dashboard/diocese/serviteurs")}
        />
        <SidebarItem
          href="/dashboard/diocese/evenements"
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith("/dashboard/diocese/evenements")}
        />
        <SidebarItem
          href="/dashboard/diocese/finances"
          icon={<PieChart size={20} />}
          title="Finances"
          isActive={pathname.startsWith("/dashboard/diocese/finances")}
        />
      </>
    );
  } else {
    // Menu par défaut si on est juste sur /dashboard
    menuItems = (
      <>
        <SidebarItem
          href="/dashboard/paroisse"
          icon={<Church size={20} />}
          title="Dashboard Paroisse"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard/doyenne"
          icon={<Building size={20} />}
          title="Dashboard Doyenné"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard/vicariat"
          icon={<Building size={20} />}
          title="Dashboard Vicariat"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard/diocese"
          icon={<Landmark size={20} />}
          title="Dashboard Diocèse"
          isActive={false}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 z-20 w-64 bg-slate-800 overflow-y-auto transition-all">
      <div className="flex items-center justify-center h-16 px-4 bg-slate-900">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
            <Church size={16} className="text-slate-800" />
          </div>
          <h1 className="ml-2 text-xl font-semibold text-white">
            Église Admin
          </h1>
        </div>
      </div>

      <div className="px-2 py-4">
        <div className="space-y-1">
          {menuItems}

          {/* Sélecteur de niveau (toujours présent) */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">
              Changer de niveau
            </h3>
            <SidebarItem
              href="/dashboard/paroisse"
              icon={<Church size={20} />}
              title="Paroisse"
              isActive={isInParoisse}
            />
            <SidebarItem
              href="/dashboard/doyenne"
              icon={<Building size={20} />}
              title="Doyenné"
              isActive={isInDoyenne}
            />
            <SidebarItem
              href="/dashboard/vicariat"
              icon={<Building size={20} />}
              title="Vicariat"
              isActive={isInVicariat}
            />
            <SidebarItem
              href="/dashboard/diocese"
              icon={<Landmark size={20} />}
              title="Diocèse"
              isActive={isInDiocese}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
