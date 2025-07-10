/* eslint-disable @typescript-eslint/no-unused-vars */

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
  User,
  UserX,
  Leaf,
  Handshake,
  FileUser,
  HandHelping,
  HeadphonesIcon,
  Castle,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";

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

interface UserProfile {
  id: number;
  created_at: number;
  email: string;
  entite: string;
  nom: string;
  prenoms: string;
  pseudo: string;
  role: string;
  user_id: number;
  diocese_id: number | null;
  vicariatsecteur_id: number | null;
  doyenne_id: number | null;
  paroisse_id: number | null;
  paroisse?: {
    id: number;
    created_at: number;
    nom: string;
    pays: string;
  };
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
        "flex items-center px-6 py-4 text-base font-medium transition-all duration-200 group",
        isActive
          ? "bg-[#C70000] text-white rounded-xl mx-4"
          : "text-white hover:text-white hover:bg-slate-700/50 rounded-xl mx-4"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "mr-4 transition-colors duration-200",
          isActive ? "text-white" : "text-white group-hover:text-slate-200"
        )}
      >
        {icon}
      </div>
      <span className="font-medium">{title}</span>
      {hasSubmenu && (
        <div className="ml-auto">
          {isSubmenuOpen ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
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
  const pathnames = usePathname();

  return (
    <div className="mb-2">
      <div
        className={cn(
          "flex items-center px-6 py-4 text-base font-medium cursor-pointer transition-all duration-200 group rounded-xl mx-4",
          isActive
            ? "bg-[#C70000] text-white"
            : "text-white hover:text-slate-200 hover:bg-slate-700/50"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={cn(
            "mr-4 transition-colors duration-200",
            isActive ? "text-white" : "text-white group-hover:text-slate-200"
          )}
        >
          {icon}
        </div>
        <span className="font-medium">{title}</span>
        <div className="ml-auto">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      {isOpen && (
        <div className="ml-8 mt-2 space-y-1">
          {submenuItems.map((item, index) => {
            const isItemActive = pathnames === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group rounded-lg mx-4",
                  isItemActive
                    ? "bg-slate-700 text-white"
                    : "text-white hover:text-slate-200 hover:bg-slate-700/30"
                )}
              >
                {item.icon && (
                  <span
                    className={cn(
                      "mr-3 transition-colors duration-200",
                      isItemActive
                        ? "text-white"
                        : "text-white group-hover:text-slate-200"
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userEntity, setUserEntity] = useState<string | null>(null);

  // Récupérer le profil utilisateur depuis le localStorage au chargement du composant
  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      try {
        const profile = JSON.parse(profileData) as UserProfile;
        setUserProfile(profile);

        // Normaliser l'entité pour éviter les problèmes de casse
        if (profile.entite) {
          setUserEntity(profile.entite.toUpperCase());
        }
      } catch (error) {
        console.error("Erreur lors de la lecture du profil:", error);
      }
    }
  }, []);

  // Déterminer le niveau administratif actuel en fonction de l'entité de l'utilisateur
  const isInDiocese = userEntity === "DIOCESE";
  const isInVicariat = userEntity === "VICARIAT";
  const isInDoyenne = userEntity === "DOYENNE";
  const isInParoisse = userEntity === "PAROISSE";

  // Modifier les redirections pour s'assurer qu'elles vont vers le bon niveau
  const getBaseUrl = () => {
    if (isInDiocese) return "/dashboard/diocese";
    if (isInVicariat) return "/dashboard/vicariat";
    if (isInDoyenne) return "/dashboard/doyenne";
    if (isInParoisse) return "/dashboard/paroisse";
    return "/dashboard";
  };

  // Dans la section menuIcons, remplacez le code existant par celui-ci :

  if (!isOpen) {
    let menuIcons;

    if (isInParoisse) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname === getBaseUrl()
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Home size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/ceb`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/ceb`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Users size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/m&a`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/m&a`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Users size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/denierdecultes`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/denierdecultes`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Castle size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/demandemesse`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/demandemesse`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <HandHelping size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/communautes/paroissiens`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/communautes/paroissiens`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Users size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/communautes/nonparoissiens`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/communautes/nonparoissiens`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Users size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/sacrements/individuelle`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/sacrements/individuelle`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Leaf size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/sacrements/unions`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/sacrements/unions`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Handshake size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/sacrements/soumissions`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/sacrements/soumissions`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <FileUser size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/evenements`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/evenements`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Calendar size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/finances`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/finances`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <PieChart size={22} />
          </Link>
        </>
      );
    } else if (isInDoyenne) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname === getBaseUrl()
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Home size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/paroisses`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/paroisses`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Church size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/evenements`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/evenements`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Calendar size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/communications`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/communications`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <MessageSquare size={22} />
          </Link>
        </>
      );
    } else if (isInVicariat) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname === getBaseUrl()
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Home size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/doyennes`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/doyennes`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Building size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/evenements`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/evenements`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Calendar size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/communications`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/communications`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <MessageSquare size={22} />
          </Link>
        </>
      );
    } else if (isInDiocese) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname === getBaseUrl()
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Home size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/vicariats`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/vicariats`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Building2 size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/doyennes`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/doyennes`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Building size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/paroisses`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/paroisses`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Church size={22} />
          </Link>
          <Link
            href={`${getBaseUrl()}/evenements`}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              pathname.startsWith(`${getBaseUrl()}/evenements`)
                ? "bg-[#C70000] text-white shadow-lg"
                : "text-white hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            <Calendar size={22} />
          </Link>
        </>
      );
    } else {
      menuIcons = <></>;
    }

    return (
      <div className="fixed inset-y-0 left-0 z-20 w-20 bg-slate-800 transition-all duration-300">
        <div className="flex flex-col h-full">
          {/* Logo en mode réduit */}
          <div className="flex items-center justify-center py-6">
            <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Church size={20} className="text-white" />
            </div>
          </div>

          {/* Menu items */}
          <div className="flex-1 flex flex-col items-center space-y-3 px-3">
            {menuIcons}
          </div>
        </div>
      </div>
    );
  }

  // Afficher un message de chargement si le profil n'est pas encore chargé
  if (!userProfile) {
    return (
      <div className="fixed inset-y-0 left-0 z-20 w-80 bg-slate-800 transition-all duration-300">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-slate-300">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Church size={20} className="text-white" />
            </div>
            <p>Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Ajuster le menu en fonction de l'entité de l'utilisateur
  let menuItems;

  if (isInParoisse) {
    menuItems = (
      <>
        <SidebarItem
          href={`${getBaseUrl()}`}
          icon={<Home size={22} />}
          title="Dashboard"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/ceb`}
          icon={<Users size={22} />}
          title="CEB"
          isActive={pathname.startsWith(`${getBaseUrl()}/ceb`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/m&a`}
          icon={<Users size={22} />}
          title="M&A"
          isActive={pathname.startsWith(`${getBaseUrl()}/m&a`)}
        />
         <SidebarItem
          href={`${getBaseUrl()}/denierdecultes`}
          icon={<Castle size={22} />}
          title="Denier de culte"
          isActive={pathname.startsWith(`${getBaseUrl()}/denierdecultes`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/demandemesse`}
          icon={<HandHelping size={22} />}
          title="Demandes de Messe"
          isActive={pathname.startsWith(`${getBaseUrl()}/demandemesse`)}
        />
        <NavItemWithSubMenu
          icon={<Users size={22} />}
          title="Communautés"
          isActive={pathname.startsWith(`${getBaseUrl()}/communautes`)}
          submenuItems={[
            {
              href: `${getBaseUrl()}/communautes/paroissiens`,
              icon: <User size={18} />,
              title: "Paroissiens",
            },
            {
              href: `${getBaseUrl()}/communautes/nonparoissiens`,
              icon: <UserX size={18} />,
              title: "Non Paroissiens",
            },
          ]}
        />
        <NavItemWithSubMenu
          icon={<Leaf size={22} />}
          title="Sacrements"
          isActive={pathname.startsWith(`${getBaseUrl()}/sacrements`)}
          submenuItems={[
            {
              href: `${getBaseUrl()}/sacrements/individuelle`,
              icon: <User size={18} />,
              title: "Individuelle",
            },
            {
              href: `${getBaseUrl()}/sacrements/unions`,
              icon: <Handshake size={18} />,
              title: "Unions",
            },
            {
              href: `${getBaseUrl()}/sacrements/soumissions`,
              icon: <FileUser size={18} />,
              title: "Soumissions",
            },
          ]}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={22} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/finances`}
          icon={<PieChart size={22} />}
          title="Finances"
          isActive={pathname.startsWith(`${getBaseUrl()}/finances`)}
        />
      </>
    );
  } else if (isInDoyenne) {
    menuItems = (
      <>
        <SidebarItem
          href={`${getBaseUrl()}`}
          icon={<Home size={22} />}
          title="Dashboard"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/paroisses`}
          icon={<Church size={22} />}
          title="Paroisses"
          isActive={pathname.startsWith(`${getBaseUrl()}/paroisses`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={22} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/communications`}
          icon={<MessageSquare size={22} />}
          title="Communications"
          isActive={pathname.startsWith(`${getBaseUrl()}/communications`)}
        />
      </>
    );
  } else if (isInVicariat) {
    menuItems = (
      <>
        <SidebarItem
          href={`${getBaseUrl()}`}
          icon={<Home size={22} />}
          title="Dashboard"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/doyennes`}
          icon={<Building size={22} />}
          title="Doyennés"
          isActive={pathname.startsWith(`${getBaseUrl()}/doyennes`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={22} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/communications`}
          icon={<MessageSquare size={22} />}
          title="Communications"
          isActive={pathname.startsWith(`${getBaseUrl()}/communications`)}
        />
      </>
    );
  } else if (isInDiocese) {
    menuItems = (
      <>
        <SidebarItem
          href={`${getBaseUrl()}`}
          icon={<Home size={22} />}
          title="Dashboard"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/vicariats`}
          icon={<Building2 size={22} />}
          title="Vicariats / Secteurs"
          isActive={pathname.startsWith(`${getBaseUrl()}/vicariats`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/doyennes`}
          icon={<Building size={22} />}
          title="Doyennés"
          isActive={pathname.startsWith(`${getBaseUrl()}/doyennes`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/paroisses`}
          icon={<Church size={22} />}
          title="Paroisses"
          isActive={pathname.startsWith(`${getBaseUrl()}/paroisses`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={22} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
      </>
    );
  } else {
    // Menu par défaut si l'entité n'est pas reconnue
    menuItems = (
      <>
        <SidebarItem
          href="/dashboard/paroisse"
          icon={<Church size={22} />}
          title="Dashboard Paroisse"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard/doyenne"
          icon={<Building size={22} />}
          title="Dashboard Doyenné"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard/vicariat"
          icon={<Building size={22} />}
          title="Dashboard Vicariat"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard/diocese"
          icon={<Landmark size={22} />}
          title="Dashboard Diocèse"
          isActive={false}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 z-20 w-80 bg-slate-800 transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Header avec logo et titre */}
        <div className="px-6 py-6 border-b border-slate-700">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Church size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-white">Église Admin</h1>
              {userProfile && (
                <p className="text-sm text-slate-200 capitalize">
                  {userProfile.entite?.toLowerCase()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Menu principal */}
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="space-y-2">{menuItems}</div>
        </div>
      </div>
    </div>
  );
}
