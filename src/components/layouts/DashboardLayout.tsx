// /* eslint-disable jsx-a11y/role-supports-aria-props */
// "use client";
// import React, { ReactNode, useState, useCallback, useEffect } from "react";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Optimisation des fonctions avec useCallback
//   const toggleSidebar = useCallback(() => {
//     setSidebarOpen((prev) => !prev);
//   }, []);

//   const closeSidebar = useCallback(() => {
//     setSidebarOpen(false);
//   }, []);

//   // Gestion des touches clavier pour l'accessibilité
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       // Toggle sidebar avec Alt + S
//       if (event.altKey && event.key === "s") {
//         toggleSidebar();
//       }
//       // Fermer avec Escape
//       if (event.key === "Escape" && sidebarOpen) {
//         closeSidebar();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [sidebarOpen, toggleSidebar, closeSidebar]);

//   return (
//     <div
//       className="flex h-screen bg-slate-100 overflow-hidden"
//       role="application"
//     >
//       {/* Sidebar avec améliorations d'accessibilité */}
//       <aside
//         className={`
//           fixed
//           inset-y-0
//           left-0
//           z-50
//           w-64
//           transform
//           transition-transform
//           duration-300
//           ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:relative
//           md:translate-x-0
//           ${sidebarOpen ? "md:w-64" : "md:w-16"}
//         `}
//         aria-expanded={sidebarOpen}
//         aria-label="Navigation sidebar"
//       >
//         <Sidebar
//           isOpen={sidebarOpen}
//           onClose={closeSidebar}
//           aria-hidden={!sidebarOpen}
//         />
//       </aside>

//       {/* Contenu principal */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header
//           toggleSidebar={toggleSidebar}
//           isSidebarOpen={sidebarOpen}
//           aria-controls="main-navigation"
//         />

//         <main
//           id="main-content"
//           className={`
//             flex-1
//             overflow-x-hidden
//             overflow-y-auto
//             bg-slate-100
//             p-4
//             transition-all
//             duration-300
//             ${sidebarOpen ? "md:pl-3" : "md:pl-3"}
//           `}
//           aria-label="Contenu principal"
//         >
//           {children}
//         </main>

//         <Footer />
//       </div>

//       {/* Overlay mobile avec amélioration */}
//       {sidebarOpen && (
//         <div
//           className="
//             md:hidden
//             fixed
//             inset-0
//             bg-black
//             opacity-50
//             z-40
//             cursor-pointer
//           "
//           onClick={closeSidebar}
//           aria-hidden="true"
//           role="button"
//           aria-label="Fermer la navigation"
//         />
//       )}
//     </div>
//   );
// }
/* eslint-disable jsx-a11y/role-supports-aria-props */
// "use client";
// import React, { ReactNode, useState, useCallback, useEffect } from "react";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(true); // Ouvert par défaut pour desktop

//   // Optimisation des fonctions avec useCallback
//   const toggleSidebar = useCallback(() => {
//     setSidebarOpen((prev) => !prev);
//   }, []);

//   const closeSidebar = useCallback(() => {
//     setSidebarOpen(false);
//   }, []);

//   // Détecter la taille d'écran pour gérer l'état initial
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         // Sur desktop, la sidebar est ouverte par défaut
//         setSidebarOpen(true);
//       } else {
//         // Sur mobile, fermée par défaut
//         setSidebarOpen(false);
//       }
//     };

//     // Appel initial
//     handleResize();

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Gestion des touches clavier pour l'accessibilité
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       // Toggle sidebar avec Alt + S
//       if (event.altKey && event.key === "s") {
//         toggleSidebar();
//       }
//       // Fermer avec Escape
//       if (event.key === "Escape" && sidebarOpen) {
//         closeSidebar();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [sidebarOpen, toggleSidebar, closeSidebar]);

//   return (
//     <div
//       className="flex h-screen bg-slate-100 overflow-hidden"
//       role="application"
//     >
//       {/* Sidebar avec nouvelles dimensions */}
//       <aside
//         className={`
//           fixed
//           inset-y-0
//           left-0
//           z-50
//           transform
//           transition-all
//           duration-300
//           ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:relative
//           md:translate-x-0
//           ${sidebarOpen ? "w-80 md:w-80" : "w-20 md:w-20"}
//         `}
//         aria-expanded={sidebarOpen}
//         aria-label="Navigation sidebar"
//       >
//         <Sidebar
//           isOpen={sidebarOpen}
//           onClose={closeSidebar}
//           aria-hidden={!sidebarOpen}
//         />
//       </aside>

//       {/* Contenu principal avec ajustement des marges */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header
//           toggleSidebar={toggleSidebar}
//           isSidebarOpen={sidebarOpen}
//           aria-controls="main-navigation"
//         />

//         <main
//           id="main-content"
//           className={`
//             flex-1
//             overflow-x-hidden
//             overflow-y-auto
//             bg-slate-100
//             p-6
//             transition-all
//             duration-300
//             ease-in-out
//           `}
//           style={{
//             marginLeft:
//               window.innerWidth >= 768 ? (sidebarOpen ? "0" : "0") : "0",
//           }}
//           aria-label="Contenu principal"
//         >
//           <div className="max-w-7xl mx-auto">{children}</div>
//         </main>

//         <Footer />
//       </div>

//       {/* Overlay mobile amélioré */}
//       {sidebarOpen && (
//         <div
//           className="
//             md:hidden
//             fixed
//             inset-0
//             bg-black/50
//             backdrop-blur-sm
//             z-40
//             cursor-pointer
//             transition-opacity
//             duration-300
//           "
//           onClick={closeSidebar}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === " ") {
//               closeSidebar();
//             }
//           }}
//           aria-hidden="true"
//           role="button"
//           tabIndex={0}
//           aria-label="Fermer la navigation"
//         />
//       )}
//     </div>
//   );
// }

/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable @typescript-eslint/no-unused-vars */


"use client";
import React, { ReactNode, useState, useCallback, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Fermé par défaut
  const [isClient, setIsClient] = useState(false);

  // Optimisation des fonctions avec useCallback
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Détecter si on est côté client et gérer l'état initial
  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Sur desktop, la sidebar est ouverte par défaut
        setSidebarOpen(true);
      } else {
        // Sur mobile, fermée par défaut
        setSidebarOpen(false);
      }
    };

    // Appel initial
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Gestion des touches clavier pour l'accessibilité
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle sidebar avec Alt + S
      if (event.altKey && event.key === "s") {
        toggleSidebar();
      }
      // Fermer avec Escape
      if (event.key === "Escape" && sidebarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, toggleSidebar, closeSidebar]);

  return (
    <div
      className="flex h-screen bg-slate-100 overflow-hidden"
      role="application"
    >
      {/* Sidebar avec nouvelles dimensions */}
      <aside
        className={`
          fixed 
          inset-y-0 
          left-0 
          z-50 
          transform 
          transition-all 
          duration-300 
          ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative 
          md:translate-x-0 
          ${sidebarOpen ? "w-80 md:w-80" : "w-20 md:w-20"}
        `}
        aria-expanded={sidebarOpen}
        aria-label="Navigation sidebar"
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          aria-hidden={!sidebarOpen}
        />
      </aside>

      {/* Contenu principal avec ajustement des marges */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          aria-controls="main-navigation"
        />

        <main
          id="main-content"
          className={`
            flex-1 
            overflow-x-hidden 
            overflow-y-auto 
            bg-slate-100 
            p-6
            transition-all 
            duration-300 
            ease-in-out
          `}
          aria-label="Contenu principal"
        >
          <div className="mx-auto">{children}</div>
        </main>

        <Footer />
      </div>

      {/* Overlay mobile amélioré */}
      {sidebarOpen && (
        <div
          className="
            md:hidden 
            fixed 
            inset-0 
            bg-black/50
            backdrop-blur-sm
            z-40
            cursor-pointer
            transition-opacity
            duration-300
          "
          onClick={closeSidebar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              closeSidebar();
            }
          }}
          aria-hidden="true"
          role="button"
          tabIndex={0}
          aria-label="Fermer la navigation"
        />
      )}
    </div>
  );
}
