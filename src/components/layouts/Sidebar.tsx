/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import {
//   Users,
//   Calendar,
//   Home,
//   ChevronDown,
//   ChevronRight,
//   Heart,
//   PieChart,
//   MessageSquare,
//   Settings,
//   Church,
//   Landmark,
//   Building,
//   CalendarDays,
//   Handshake,
//   HandHelping,
//   Ribbon,
//   AppWindow,
//   CreditCard,
//   Wallet,
// } from "lucide-react";
// import { useState } from "react";

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface SidebarItemProps {
//   href: string;
//   icon: React.ReactNode;
//   title: string;
//   isActive: boolean;
//   isSubmenuOpen?: boolean;
//   hasSubmenu?: boolean;
//   onClick?: () => void;
// }

// interface NavItemWithSubMenuProps {
//   icon: React.ReactNode;
//   title: string;
//   submenuItems: {
//     href: string;
//     title: string;
//     icon?: React.ReactNode;
//   }[];
//   isActive: boolean;
// }

// const SidebarItem = ({
//   href,
//   icon,
//   title,
//   isActive,
//   isSubmenuOpen,
//   hasSubmenu,
//   onClick,
// }: SidebarItemProps) => {
//   return (
//     <Link
//       href={href}
//       className={cn(
//         "flex items-center py-2 px-4 text-sm font-medium rounded-md hover:bg-slate-800",
//         isActive ? "bg-slate-800 text-white" : "text-slate-300"
//       )}
//       onClick={onClick}
//     >
//       <div className="mr-3">{icon}</div>
//       <span>{title}</span>
//       {hasSubmenu && (
//         <div className="ml-auto">
//           {isSubmenuOpen ? (
//             <ChevronDown size={16} />
//           ) : (
//             <ChevronRight size={16} />
//           )}
//         </div>
//       )}
//     </Link>
//   );
// };

// const NavItemWithSubMenu = ({
//   icon,
//   title,
//   submenuItems,
//   isActive,
// }: NavItemWithSubMenuProps) => {
//   const [isOpen, setIsOpen] = useState(isActive);

//   return (
//     <div>
//       <div
//         className={cn(
//           "flex items-center py-2 px-4 text-sm font-medium rounded-md cursor-pointer hover:bg-slate-800",
//           isActive ? "bg-slate-800 text-white" : "text-slate-300"
//         )}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="mr-3">{icon}</div>
//         <span>{title}</span>
//         <div className="ml-auto">
//           {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//         </div>
//       </div>

//       {isOpen && (
//         <div className="pl-4 mt-1 space-y-1">
//           {submenuItems.map((item, index) => (
//             <Link
//               key={index}
//               href={item.href}
//               className="flex items-center py-2 px-4 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800"
//             >
//               {item.icon && <span className="mr-2">{item.icon}</span>}
//               {item.title}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function Sidebar({ isOpen }: SidebarProps) {
//   const pathname = usePathname();

//   // Déterminer le niveau administratif actuel (diocèse, vicariat, doyenne ou paroisse)
//   const isInDiocese = pathname.startsWith("/dashboard/diocese");
//   const isInVicariat = pathname.startsWith("/dashboard/vicariat");
//   const isInDoyenne = pathname.startsWith("/dashboard/doyenne");
//   const isInParoisse = pathname.startsWith("/dashboard/paroisse");

//   if (!isOpen) {
//     return (
//       <div className="fixed inset-y-0 left-0 z-20 w-16 bg-slate-800 overflow-y-auto transition-all">
//         <div className="flex flex-col items-center py-4">
//           <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mb-4">
//             <Church size={16} className="text-slate-800" />
//           </div>
//           {/* Icônes uniquement pour le mode réduit */}
//           <div className="mt-6 flex flex-col items-center space-y-4">
//             <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
//               <Home size={20} />
//             </div>
//             <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
//               <Users size={20} />
//             </div>
//             <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
//               <Calendar size={20} />
//             </div>
//             <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
//               <PieChart size={20} />
//             </div>
//             <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
//               <MessageSquare size={20} />
//             </div>
//             <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
//               <Settings size={20} />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Ajuster le menu en fonction du niveau actuel
//   let menuItems;

//   if (isInParoisse) {
//     menuItems = (
//       <>
//         <SidebarItem
//           href="/dashboard/paroisse"
//           icon={<Home size={20} />}
//           title="Accueil"
//           isActive={pathname === "/dashboard/paroisse"}
//         />
//         <SidebarItem
//           href="/dashboard/paroisse/paroissiens"
//           icon={<Users size={20} />}
//           title="Paroissiens"
//           isActive={pathname.startsWith("/dashboard/paroisse/paroissiens")}
//         />
//         <SidebarItem
//           href="/dashboard/paroisse/sacrements"
//           icon={<Heart size={20} />}
//           title="Sacrements"
//           isActive={pathname.startsWith("/dashboard/paroisse/sacrements")}
//         />
//         <NavItemWithSubMenu
//           icon={<Calendar size={20} />}
//           title="Événements"
//           isActive={pathname.startsWith("/dashboard/paroisse/evenements")}
//           submenuItems={[
//             {
//               href: "/dashboard/paroisse/evenements",
//               icon: <CalendarDays size={20} />,
//               title: "Tous les événements",
//             },
//             {
//               href: "/dashboard/paroisse/evenements/messes",
//               icon: <Handshake size={20} />,
//               title: "Messes",
//             },

//             {
//               href: "/dashboard/paroisse/evenements/demandes",
//               icon: <HandHelping size={20} />,
//               title: "Demandes",
//             },
//           ]}
//         />
//         <SidebarItem
//           href="/dashboard/paroisse/communautes"
//           icon={<Users size={20} />}
//           title="Communautés"
//           isActive={pathname.startsWith("/dashboard/paroisse/communautes")}
//         />
//         <NavItemWithSubMenu
//           icon={<PieChart size={20} />}
//           title="Finances"
//           isActive={pathname.startsWith("/dashboard/paroisse/finances")}
//           submenuItems={[
//             {
//               href: "/dashboard/paroisse/finances",
//               icon: <AppWindow size={20} />,
//               title: "Vue générale",
//             },
//             {
//               href: "/dashboard/paroisse/finances/cotisations",
//               icon: <Wallet size={20} />,
//               title: "Cotisations",
//             },
//             {
//               href: "/dashboard/paroisse/finances/quetes",
//               icon: <CreditCard size={20} />,
//               title: "Quêtes",
//             },
//             {
//               href: "/dashboard/paroisse/finances/dons",
//               icon: <Ribbon size={20} />,
//               title: "Dons",
//             },
//           ]}
//         />
//         <SidebarItem
//           href="/dashboard/paroisse/communications"
//           icon={<MessageSquare size={20} />}
//           title="Communications"
//           isActive={pathname.startsWith("/dashboard/paroisse/communications")}
//         />
//       </>
//     );
//   } else if (isInDoyenne) {
//     menuItems = (
//       <>
//         <SidebarItem
//           href="/dashboard/doyenne"
//           icon={<Home size={20} />}
//           title="Accueil"
//           isActive={pathname === "/dashboard/doyenne"}
//         />
//         <SidebarItem
//           href="/dashboard/doyenne/paroisses"
//           icon={<Church size={20} />}
//           title="Paroisses"
//           isActive={pathname.startsWith("/dashboard/doyenne/paroisses")}
//         />
//         <SidebarItem
//           href="/dashboard/doyenne/evenements"
//           icon={<Calendar size={20} />}
//           title="Événements"
//           isActive={pathname.startsWith("/dashboard/doyenne/evenements")}
//         />
//         <SidebarItem
//           href="/dashboard/doyenne/communications"
//           icon={<MessageSquare size={20} />}
//           title="Communications"
//           isActive={pathname.startsWith("/dashboard/doyenne/communications")}
//         />
//       </>
//     );
//   } else if (isInVicariat) {
//     menuItems = (
//       <>
//         <SidebarItem
//           href="/dashboard/vicariat"
//           icon={<Home size={20} />}
//           title="Accueil"
//           isActive={pathname === "/dashboard/vicariat"}
//         />
//         <SidebarItem
//           href="/dashboard/vicariat/doyennes"
//           icon={<Building size={20} />}
//           title="Doyennés"
//           isActive={pathname.startsWith("/dashboard/vicariat/doyennes")}
//         />
//         <SidebarItem
//           href="/dashboard/vicariat/evenements"
//           icon={<Calendar size={20} />}
//           title="Événements"
//           isActive={pathname.startsWith("/dashboard/vicariat/evenements")}
//         />
//         <SidebarItem
//           href="/dashboard/vicariat/communications"
//           icon={<MessageSquare size={20} />}
//           title="Communications"
//           isActive={pathname.startsWith("/dashboard/vicariat/communications")}
//         />
//       </>
//     );
//   } else if (isInDiocese) {
//     menuItems = (
//       <>
//         <SidebarItem
//           href="/dashboard/diocese"
//           icon={<Home size={20} />}
//           title="Accueil"
//           isActive={pathname === "/dashboard/diocese"}
//         />
//         <SidebarItem
//           href="/dashboard/diocese/vicariats"
//           icon={<Building size={20} />}
//           title="Vicariats"
//           isActive={pathname.startsWith("/dashboard/diocese/vicariats")}
//         />
//         <SidebarItem
//           href="/dashboard/diocese/doyennes"
//           icon={<Building size={20} />}
//           title="Doyennés"
//           isActive={pathname.startsWith("/dashboard/diocese/doyennes")}
//         />
//         <SidebarItem
//           href="/dashboard/diocese/paroisses"
//           icon={<Church size={20} />}
//           title="Paroisses"
//           isActive={pathname.startsWith("/dashboard/diocese/paroisses")}
//         />
//         <SidebarItem
//           href="/dashboard/diocese/serviteurs"
//           icon={<Users size={20} />}
//           title="Serviteurs"
//           isActive={pathname.startsWith("/dashboard/diocese/serviteurs")}
//         />
//         <SidebarItem
//           href="/dashboard/diocese/evenements"
//           icon={<Calendar size={20} />}
//           title="Événements"
//           isActive={pathname.startsWith("/dashboard/diocese/evenements")}
//         />
//         <SidebarItem
//           href="/dashboard/diocese/finances"
//           icon={<PieChart size={20} />}
//           title="Finances"
//           isActive={pathname.startsWith("/dashboard/diocese/finances")}
//         />
//       </>
//     );
//   } else {
//     // Menu par défaut si on est juste sur /dashboard
//     menuItems = (
//       <>
//         <SidebarItem
//           href="/dashboard/paroisse"
//           icon={<Church size={20} />}
//           title="Dashboard Paroisse"
//           isActive={false}
//         />
//         <SidebarItem
//           href="/dashboard/doyenne"
//           icon={<Building size={20} />}
//           title="Dashboard Doyenné"
//           isActive={false}
//         />
//         <SidebarItem
//           href="/dashboard/vicariat"
//           icon={<Building size={20} />}
//           title="Dashboard Vicariat"
//           isActive={false}
//         />
//         <SidebarItem
//           href="/dashboard/diocese"
//           icon={<Landmark size={20} />}
//           title="Dashboard Diocèse"
//           isActive={false}
//         />
//       </>
//     );
//   }

//   return (
//     <div className="fixed inset-y-0 left-0 z-20 w-64 bg-slate-800 overflow-y-auto transition-all">
//       <div className="flex items-center justify-center h-16 px-4 bg-slate-900">
//         <div className="flex items-center">
//           <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
//             <Church size={16} className="text-slate-800" />
//           </div>
//           <h1 className="ml-2 text-xl font-semibold text-white">
//             Église Admin
//           </h1>
//         </div>
//       </div>

//       <div className="px-2 py-4">
//         <div className="space-y-1">
//           {menuItems}

//           {/* Sélecteur de niveau (toujours présent) */}
//           <div className="mt-6 pt-6 border-t border-slate-700">
//             <h3 className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">
//               Changer de niveau
//             </h3>
//             <SidebarItem
//               href="/dashboard/paroisse"
//               icon={<Church size={20} />}
//               title="Paroisse"
//               isActive={isInParoisse}
//             />
//             <SidebarItem
//               href="/dashboard/doyenne"
//               icon={<Building size={20} />}
//               title="Doyenné"
//               isActive={isInDoyenne}
//             />
//             <SidebarItem
//               href="/dashboard/vicariat"
//               icon={<Building size={20} />}
//               title="Vicariat"
//               isActive={isInVicariat}
//             />
//             <SidebarItem
//               href="/dashboard/diocese"
//               icon={<Landmark size={20} />}
//               title="Diocèse"
//               isActive={isInDiocese}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
        "flex items-center py-2 px-4 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-slate-800",
        isActive ? "bg-gray-100 text-slate-800" : "text-slate-300"
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
  const pathnames = usePathname();
  return (
    <div>
      <div
        className={cn(
          "flex items-center py-2 px-4 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 hover:text-slate-800",
          isActive ? "bg-gray-100 text-slate-800" : "text-slate-300"
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
          {submenuItems.map((item, index) => {
            // Vérifier si cet élément est actif (vous devrez peut-être adapter cette logique)
            const isItemActive = pathnames === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center py-2 px-4 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 hover:text-slate-800",
                  isItemActive ? "bg-gray-100 text-slate-800" : "text-slate-300"
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
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

  if (!isOpen) {
    let menuIcons;

    if (isInParoisse) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Home size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/ceb`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Users size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/m&a`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Users size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/demandemesse`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <HandHelping size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/communautes/paroissiens`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Users size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/communautes/nonparoissiens`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Users size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/sacrements/individuelle`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Leaf size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/sacrements/unions`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Handshake size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/sacrements/soumissions`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <FileUser size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/evenements`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Calendar size={20} />
          </Link>

          <Link
            href={`${getBaseUrl()}/finances`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <PieChart size={20} />
          </Link>

          {/* <Link
            href={`${getBaseUrl()}/communications`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <MessageSquare size={20} />
          </Link> */}
        </>
      );
    } else if (isInDoyenne) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Home size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/paroisses`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Church size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/evenements`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Calendar size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/communications`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <MessageSquare size={20} />
          </Link>
        </>
      );
    } else if (isInVicariat) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Home size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/doyennes`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Building size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/evenements`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Calendar size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/communications`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <MessageSquare size={20} />
          </Link>
        </>
      );
    } else if (isInDiocese) {
      menuIcons = (
        <>
          <Link
            href={`${getBaseUrl()}`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Home size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/vicariats`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Building size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/doyennes`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Building size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/paroisses`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Church size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/serviteurs`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Users size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/evenements`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <Calendar size={20} />
          </Link>
          <Link
            href={`${getBaseUrl()}/finances`}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <PieChart size={20} />
          </Link>
        </>
      );
    } else {
      // Menu par défaut si entité non reconnue
      menuIcons = (
        <>
          <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
            <Home size={20} />
          </div>
          <div className="p-2 rounded-md text-slate-300 hover:bg-slate-800 cursor-pointer">
            <Settings size={20} />
          </div>
        </>
      );
    }

    return (
      <div className="fixed inset-y-0 left-0 z-20 w-16 bg-slate-800 overflow-y-auto transition-all">
        <div className="flex flex-col items-center py-4">
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mb-4">
            <Church size={16} className="bg-white" />
          </div>

          {/* Icônes dynamiques pour le mode réduit */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            {menuIcons}

            {/* Toujours afficher l'icône de déconnexion */}
          </div>
        </div>
      </div>
    );
  }

  // Afficher un message de chargement si le profil n'est pas encore chargé
  if (!userProfile) {
    return (
      <div className="fixed inset-y-0 left-0 z-20 w-64 bg-slate-800 overflow-y-auto transition-all">
        <div className="flex items-center justify-center h-16 px-4 bg-slate-800">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <Church size={16} className="bg-slate-800" />
            </div>
            <h1 className="ml-2 text-xl font-semibold text-white">
              Église Admin
            </h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center text-slate-300">
          Chargement du profil...
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
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/ceb`}
          icon={<Users size={20} />}
          title="CEB"
          isActive={pathname.startsWith(`${getBaseUrl()}/ceb`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/m&a`}
          icon={<Users size={20} />}
          title="M&A"
          isActive={pathname.startsWith(`${getBaseUrl()}/m&a`)}
        />
         <SidebarItem
          href={`${getBaseUrl()}/demandemesse`}
          icon={<HandHelping size={20} />}
          title="Demande de Messe"
          isActive={pathname.startsWith(`${getBaseUrl()}/demandemesse`)}
        />
        <NavItemWithSubMenu
          icon={<Users size={20} />}
          title="Communautés"
          isActive={pathname.startsWith(`${getBaseUrl()}/communautes`)}
          submenuItems={[
            {
              href: `${getBaseUrl()}/communautes/paroissiens`,
              icon: <User size={20} />,
              title: "Paroissiens",
            },
            {
              href: `${getBaseUrl()}/communautes/nonparoissiens`,
              icon: <UserX size={20} />,
              title: "Non Paroissiens",
            },
          ]}
        />
        <NavItemWithSubMenu
          icon={<Leaf size={20} />}
          title="Sacrements"
          isActive={pathname.startsWith(`${getBaseUrl()}/sacrements`)}
          submenuItems={[
            {
              href: `${getBaseUrl()}/sacrements/individuelle`,
              icon: <User size={20} />,
              title: "Individuelle",
            },
            {
              href: `${getBaseUrl()}/sacrements/unions`,
              icon: <Handshake size={20} />,
              title: "Unions",
            },
            {
              href: `${getBaseUrl()}/sacrements/soumissions`,
              icon: <FileUser size={20} />,
              title: "Soumissions",
            },
          ]}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/finances`}
          icon={<PieChart size={20} />}
          title="Finances"
          isActive={pathname.startsWith(`${getBaseUrl()}/finances`)}
        />
        {/* <SidebarItem
          href={`${getBaseUrl()}/communications`}
          icon={<MessageSquare size={20} />}
          title="Communications"
          isActive={pathname.startsWith(`${getBaseUrl()}/communications`)}
        /> */}
      </>
    );
  } else if (isInDoyenne) {
    menuItems = (
      <>
        <SidebarItem
          href={`${getBaseUrl()}`}
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/paroisses`}
          icon={<Church size={20} />}
          title="Paroisses"
          isActive={pathname.startsWith(`${getBaseUrl()}/paroisses`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/communications`}
          icon={<MessageSquare size={20} />}
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
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/doyennes`}
          icon={<Building size={20} />}
          title="Doyennés"
          isActive={pathname.startsWith(`${getBaseUrl()}/doyennes`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/communications`}
          icon={<MessageSquare size={20} />}
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
          icon={<Home size={20} />}
          title="Accueil"
          isActive={pathname === getBaseUrl()}
        />
        <SidebarItem
          href={`${getBaseUrl()}/vicariats`}
          icon={<Building size={20} />}
          title="Vicariats"
          isActive={pathname.startsWith(`${getBaseUrl()}/vicariats`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/doyennes`}
          icon={<Building size={20} />}
          title="Doyennés"
          isActive={pathname.startsWith(`${getBaseUrl()}/doyennes`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/paroisses`}
          icon={<Church size={20} />}
          title="Paroisses"
          isActive={pathname.startsWith(`${getBaseUrl()}/paroisses`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/serviteurs`}
          icon={<Users size={20} />}
          title="Serviteurs"
          isActive={pathname.startsWith(`${getBaseUrl()}/serviteurs`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/evenements`}
          icon={<Calendar size={20} />}
          title="Événements"
          isActive={pathname.startsWith(`${getBaseUrl()}/evenements`)}
        />
        <SidebarItem
          href={`${getBaseUrl()}/finances`}
          icon={<PieChart size={20} />}
          title="Finances"
          isActive={pathname.startsWith(`${getBaseUrl()}/finances`)}
        />
      </>
    );
  } else {
    // Menu par défaut si l'entité n'est pas reconnue
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
      <div className="flex items-center justify-between h-16 px-4 bg-slate-800">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
            <Church size={16} className="text-slate-800" />
          </div>
          <h1 className="ml-2 text-ls font-semibold text-white">
            Admin
            {userProfile && (
              <div className="text-sm text-white opacity-80">
                {userProfile.entite}
              </div>
            )}
          </h1>
        </div>
      </div>

      <div className="px-2 py-4">
        <div className="space-y-1">
          {menuItems}

          {/* <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">
              Niveaux d'administration
            </h3>
            <SidebarItem
              href="/dashboard/paroisse"
              icon={<Church size={20} />}
              title="Paroisse"
              isActive={isInParoisse}
              onClick={(e) => {
                if (!isInParoisse) {
                  e.preventDefault();
                  toast.error("Vous n'avez pas accès à ce niveau");
                }
              }}
            />
            <SidebarItem
              href="/dashboard/doyenne"
              icon={<Building size={20} />}
              title="Doyenné"
              isActive={isInDoyenne}
              onClick={(e) => {
                if (!isInDoyenne) {
                  e.preventDefault();
                  toast.error("Vous n'avez pas accès à ce niveau");
                }
              }}
            />
            <SidebarItem
              href="/dashboard/vicariat"
              icon={<Building size={20} />}
              title="Vicariat"
              isActive={isInVicariat}
              onClick={(e) => {
                if (!isInVicariat) {
                  e.preventDefault();
                  toast.error("Vous n'avez pas accès à ce niveau");
                }
              }}
            />
            <SidebarItem
              href="/dashboard/diocese"
              icon={<Landmark size={20} />}
              title="Diocèse"
              isActive={isInDiocese}
              onClick={(e) => {
                if (!isInDiocese) {
                  e.preventDefault();
                  toast.error("Vous n'avez pas accès à ce niveau");
                }
              }}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
