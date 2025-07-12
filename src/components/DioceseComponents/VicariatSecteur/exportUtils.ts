/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from "sonner";
import { VicariatSecteur } from "@/services/VicariatSecteur";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const formatExportDate = (): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
};

export const getDioceseName = (): string => {
  try {
    const userProfileStr = localStorage.getItem("user_profile");
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      return userProfile.diocese_nom || "Diocèse";
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du nom du diocèse:", err);
  }
  return "Diocèse";
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Non renseignée";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (err) {
    console.error("Erreur lors du formatage de la date:", err);
    return dateString;
  }
};

export const exportToExcel = async (vicariats: VicariatSecteur[]) => {
  try {
    const exportDate = formatExportDate();
    const dioceseName = getDioceseName();

    const exportData = vicariats.map((vicariat, index) => ({
      "N°": index + 1,
      "Date de création": formatDate(vicariat.created_at),
      "Nom du Vicariat/Secteur": vicariat.nom,
      Siège: vicariat?.siege?.nom,
      Localisation: vicariat?.siege?.localisation || "N/A",
      Ville: vicariat?.siege?.ville,
      Quartier: vicariat?.siege?.quartier,
      "Vicaire Episcopal": `${vicariat?.vicaire_episcopal?.nom} ${vicariat?.vicaire_episcopal?.prenoms}`,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [`Vicariats et Secteurs`],
        [`${dioceseName}`],
        [`Date d'exportation: ${exportDate}`],
        [`Nombre total: ${vicariats.length}`],
        [],
      ],
      { origin: "A1" }
    );

    const colWidths = [
      { wch: 5 }, // N°
      { wch: 15 }, // Date
      { wch: 30 }, // Nom
      { wch: 25 }, // Siège
      { wch: 20 }, // Localisation
      { wch: 15 }, // Ville
      { wch: 20 }, // Quartier
      { wch: 30 }, // Vicaire Episcopal
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Vicariats");

    const fileName = `Vicariats_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.success("Exportation Excel réussie", {
      description: `Le fichier ${fileName} a été téléchargé.`,
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation Excel:", error);
    toast.error("Erreur lors de l'exportation Excel");
  }
};

export const exportToPDF = async (vicariats: VicariatSecteur[]) => {
  try {
    const exportDate = formatExportDate();
    const dioceseName = getDioceseName();

    const doc = new jsPDF();

    const primaryColor: [number, number, number] = [59, 130, 246];
    const secondaryColor: [number, number, number] = [148, 163, 184];
    const textColor: [number, number, number] = [15, 23, 42];

    // En-tête
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("VICARIATS ET SECTEURS", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(dioceseName, 105, 25, { align: "center" });

    // Informations
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
    doc.text(`Nombre total: ${vicariats.length}`, 20, 52);

    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 58, 190, 58);

    // Données du tableau
    const tableData = vicariats.map((vicariat, index) => [
      (index + 1).toString(),
      vicariat.nom || "",
      vicariat?.siege?.nom || "",
      vicariat?.siege?.ville || "",
      `${vicariat?.vicaire_episcopal?.nom || ""} ${vicariat?.vicaire_episcopal?.prenoms || ""}`.trim(),
      formatDate(vicariat.created_at) || "",
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["N°", "Nom", "Siège", "Ville", "Vicaire Episcopal", "Date"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
        textColor: textColor,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
      },
      margin: { left: 20, right: 20 },
    });

    // Pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(...secondaryColor);
      doc.line(20, pageHeight - 20, 190, pageHeight - 20);

      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.text(`Page ${i} sur ${pageCount}`, 105, pageHeight - 12, {
        align: "center",
      });
      doc.text(`Généré le ${exportDate}`, 20, pageHeight - 12);
      doc.text("Système de Gestion Diocésaine", 190, pageHeight - 12, {
        align: "right",
      });
    }

    const fileName = `Vicariats_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);

    toast.success("Exportation PDF réussie", {
      description: `Le fichier ${fileName} a été téléchargé.`,
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation PDF:", error);
    toast.error("Erreur lors de l'exportation PDF");
  }
};