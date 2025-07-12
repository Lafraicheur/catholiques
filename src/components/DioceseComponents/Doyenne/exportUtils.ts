import { toast } from "sonner";
import { Doyenne } from "@/services/Doyennes";
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

const formatDate = (dateString: string | number | null | undefined): string => {
  if (!dateString) return "Non renseignée";
  try {
    const dateToFormat = typeof dateString === "number" 
      ? new Date(dateString).toISOString() 
      : dateString;
    const date = new Date(dateToFormat);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (err) {
    console.error("Erreur lors du formatage de la date:", err);
    return String(dateString);
  }
};

export const exportToExcel = async (doyennes: Doyenne[]) => {
  try {
    const exportDate = formatExportDate();
    const dioceseName = getDioceseName();

    const exportData = doyennes.map((doyenne, index) => ({
      "N°": index + 1,
      "Date de création": formatDate(doyenne?.created_at),
      "Nom du Doyenné": doyenne.nom,
      Siège: doyenne?.siege?.nom,
      Localisation: doyenne?.siege?.localisation || "N/A",
      Ville: doyenne?.siege?.ville,
      Quartier: doyenne?.siege?.quartier,
      Doyen: `${doyenne?.doyen?.nom || ""} ${doyenne?.doyen?.prenoms || ""}`.trim(),
      Téléphone: doyenne?.doyen?.num_de_telephone || "N/A",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [`Doyennés`],
        [`${dioceseName}`],
        [`Date d'exportation: ${exportDate}`],
        [`Nombre total: ${doyennes.length}`],
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
      { wch: 30 }, // Doyen
      { wch: 15 }, // Téléphone
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Doyennes");

    const fileName = `Doyennes_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.success("Exportation Excel réussie", {
      description: `Le fichier ${fileName} a été téléchargé.`,
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation Excel:", error);
    toast.error("Erreur lors de l'exportation Excel");
  }
};

export const exportToPDF = async (doyennes: Doyenne[]) => {
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
    doc.text("DOYENNÉS", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(dioceseName, 105, 25, { align: "center" });

    // Informations
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
    doc.text(`Nombre total: ${doyennes.length}`, 20, 52);

    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 58, 190, 58);

    // Données du tableau
    const tableData = doyennes.map((doyenne, index) => [
      (index + 1).toString(),
      doyenne.nom || "",
      doyenne?.siege?.nom || "",
      doyenne?.siege?.ville || "",
      `${doyenne?.doyen?.nom || ""} ${doyenne?.doyen?.prenoms || ""}`.trim(),
      doyenne?.doyen?.num_de_telephone || "",
      formatDate(doyenne?.created_at) || "",
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["N°", "Nom", "Siège", "Ville", "Doyen", "Téléphone", "Date"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: textColor,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 30 },
        2: { cellWidth: 28 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 },
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

    const fileName = `Doyennes_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);

    toast.success("Exportation PDF réussie", {
      description: `Le fichier ${fileName} a été téléchargé.`,
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation PDF:", error);
    toast.error("Erreur lors de l'exportation PDF");
  }
};