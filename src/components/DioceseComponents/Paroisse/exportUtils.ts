import { toast } from "sonner";
import { Paroisse, formatTimestamp, getFullName, formatLocalisation } from "@/services/ParoiseofDiocese";
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

export const exportToExcel = async (paroisses: Paroisse[]) => {
  try {
    const exportDate = formatExportDate();
    const dioceseName = getDioceseName();

    const exportData = paroisses.map((paroisse, index) => ({
      "N°": index + 1,
      "Date de création": formatTimestamp(paroisse.created_at),
      "Nom de la Paroisse": paroisse.nom,
      Statut: paroisse.statut,
      Ville: paroisse.ville,
      Quartier: paroisse.quartier || "N/A",
      Localisation: formatLocalisation(paroisse.localisation),
      Curé: getFullName(paroisse.cure),
      "Téléphone Curé": paroisse.cure?.num_de_telephone || "N/A",
      Administrateur: getFullName(paroisse.administrateur),
      "Téléphone Admin": paroisse.administrateur?.num_de_telephone || "N/A",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [`Paroisses`],
        [`${dioceseName}`],
        [`Date d'exportation: ${exportDate}`],
        [`Nombre total: ${paroisses.length}`],
        [],
      ],
      { origin: "A1" }
    );

    const colWidths = [
      { wch: 5 }, // N°
      { wch: 15 }, // Date
      { wch: 35 }, // Nom
      { wch: 15 }, // Statut
      { wch: 15 }, // Ville
      { wch: 20 }, // Quartier
      { wch: 20 }, // Localisation
      { wch: 25 }, // Curé
      { wch: 15 }, // Téléphone Curé
      { wch: 25 }, // Administrateur
      { wch: 15 }, // Téléphone Admin
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Paroisses");

    const fileName = `Paroisses_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.success("Exportation Excel réussie", {
      description: `Le fichier ${fileName} a été téléchargé.`,
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation Excel:", error);
    toast.error("Erreur lors de l'exportation Excel");
  }
};

export const exportToPDF = async (paroisses: Paroisse[]) => {
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
    doc.text("PAROISSES", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(dioceseName, 105, 25, { align: "center" });

    // Informations
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.text(`Date d'exportation: ${exportDate}`, 20, 45);
    doc.text(`Nombre total: ${paroisses.length}`, 20, 52);

    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 58, 190, 58);

    // Données du tableau
    const tableData = paroisses.map((paroisse, index) => [
      (index + 1).toString(),
      paroisse.nom || "",
      paroisse.statut || "",
      paroisse.ville || "",
      paroisse.quartier || "",
      getFullName(paroisse.cure),
      getFullName(paroisse.administrateur),
      formatTimestamp(paroisse.created_at) || "",
    ]);

    autoTable(doc, {
      startY: 65,
      head: [
        [
          "N°",
          "Nom",
          "Statut",
          "Ville",
          "Quartier",
          "Curé",
          "Administrateur",
          "Date",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        textColor: textColor,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
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

    const fileName = `Paroisses_${dioceseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);

    toast.success("Exportation PDF réussie", {
      description: `Le fichier ${fileName} a été téléchargé.`,
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation PDF:", error);
    toast.error("Erreur lors de l'exportation PDF");
  }
};