// =============================================================================
// 11. HOOK POUR L'EXPORTATION - hooks/useExport.ts
// =============================================================================
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DemandeMesse } from "../types/demandeMesse";
import {
    getParoisseName,
    formatExportDate,
    formatDate,
    getIntentionLabel,
    formatTimestamp,
    formatTime
} from "@/utils/emandeMesseUtils";

export const useExport = () => {
    const [exporting, setExporting] = useState(false);

    // Export individuel d'une demande
    const exportIndividualDemande = async (
        demande: DemandeMesse,
        format: "excel" | "pdf"
    ) => {
        try {
            setExporting(true);
            const exportDate = formatExportDate();
            const paroisseName = getParoisseName();

            if (format === "excel") {
                const exportData = [
                    {
                        "Demande ID": demande.id,
                        "Date de demande": formatDate(demande.created_at),
                        Initiateur: demande.initiateur
                            ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
                            : "N/A",
                        Téléphone: demande.initiateur?.num_de_telephone || "N/A",
                        Demandeur: demande.demandeur,
                        Intention: getIntentionLabel(demande.intention),
                        Concerne: demande.concerne,
                        Description: demande.description || "N/A",
                        "Statut de paiement": demande.est_payee ? "Payée" : "Non payée",
                        Messe: demande.messe?.libelle || "N/A",
                        "Type de messe": demande.messe?.extras?.type_messe || "N/A",
                        "Date de la messe": demande.messe?.date_de_debut
                            ? formatTimestamp(demande.messe.date_de_debut)
                            : "N/A",
                        "Heure de début": demande.messe?.extras?.heure_de_debut
                            ? formatTime(demande.messe.extras.heure_de_debut)
                            : "N/A",
                        "Heure de fin": demande.messe?.extras?.heure_de_fin
                            ? formatTime(demande.messe.extras.heure_de_fin)
                            : "N/A",
                        Prix: demande.messe?.extras?.prix_demande_de_messe
                            ? `${demande.messe.extras.prix_demande_de_messe} FCFA`
                            : "N/A",
                    },
                ];

                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(exportData);

                XLSX.utils.sheet_add_aoa(
                    ws,
                    [
                        [`Détail de la Demande de Messe #${demande.id}`],
                        [`${paroisseName}`],
                        [`Date d'exportation: ${exportDate}`],
                        [],
                    ],
                    { origin: "A1" }
                );

                XLSX.utils.book_append_sheet(wb, ws, `Demande_${demande.id}`);

                const fileName = `Demande_Messe_${demande.id}_${new Date().toISOString().split("T")[0]}.xlsx`;
                XLSX.writeFile(wb, fileName);

                toast.success("Export Excel réussi", {
                    description: `Demande #${demande.id} exportée avec succès.`,
                });
            } else if (format === "pdf") {
                const doc = new jsPDF();

                // En-tête
                doc.setFillColor(59, 130, 246);
                doc.rect(0, 0, 210, 35, "F");

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.setFont("helvetica", "bold");
                doc.text(`DÉTAIL DE LA DEMANDE #${demande.id}`, 105, 15, {
                    align: "center",
                });

                doc.setFontSize(12);
                doc.text(paroisseName, 105, 25, { align: "center" });

                // Contenu
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);

                const yStart = 50;
                let yPos = yStart;

                const addField = (label: string, value: string) => {
                    doc.setFont("helvetica", "bold");
                    doc.text(`${label}:`, 20, yPos);
                    doc.setFont("helvetica", "normal");
                    doc.text(value, 70, yPos);
                    yPos += 8;
                };

                addField("Date de demande", formatDate(demande.created_at));
                addField(
                    "Initiateur",
                    demande.initiateur
                        ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
                        : "N/A"
                );
                addField("Téléphone", demande.initiateur?.num_de_telephone || "N/A");
                addField("Demandeur", demande.demandeur);
                addField("Intention", getIntentionLabel(demande.intention));
                addField("Concerne", demande.concerne);
                addField("Description", demande.description || "N/A");
                addField("Statut paiement", demande.est_payee ? "Payée" : "Non payée");

                yPos += 5;
                doc.setFont("helvetica", "bold");
                doc.text("INFORMATIONS MESSE", 20, yPos);
                yPos += 10;

                addField("Messe", demande.messe?.libelle || "N/A");
                addField("Type", demande.messe?.extras?.type_messe || "N/A");
                addField(
                    "Date",
                    demande.messe?.date_de_debut
                        ? formatTimestamp(demande.messe.date_de_debut)
                        : "N/A"
                );
                addField(
                    "Heure début",
                    demande.messe?.extras?.heure_de_debut
                        ? formatTime(demande.messe.extras.heure_de_debut)
                        : "N/A"
                );
                addField(
                    "Heure fin",
                    demande.messe?.extras?.heure_de_fin
                        ? formatTime(demande.messe.extras.heure_de_fin)
                        : "N/A"
                );
                addField(
                    "Prix",
                    demande.messe?.extras?.prix_demande_de_messe
                        ? `${demande.messe.extras.prix_demande_de_messe} FCFA`
                        : "N/A"
                );

                // Pied de page
                doc.setFontSize(8);
                doc.text(`Exporté le ${exportDate}`, 20, 280);

                const fileName = `Demande_Messe_${demande.id}_${new Date().toISOString().split("T")[0]}.pdf`;
                doc.save(fileName);

                toast.success("Export PDF réussi", {
                    description: `Demande #${demande.id} exportée avec succès.`,
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'export individuel:", error);
            toast.error("Erreur lors de l'exportation");
        } finally {
            setExporting(false);
        }
    };

    // Export global en Excel
    const exportToExcel = async (filteredDemandes: DemandeMesse[]) => {
        try {
            setExporting(true);

            const exportDate = formatExportDate();
            const paroisseName = getParoisseName();

            const exportData = filteredDemandes.map((demande, index) => ({
                "N°": index + 1,
                "Date de demande": formatDate(demande.created_at),
                Initiateur: demande.initiateur
                    ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`
                    : "N/A",
                Téléphone: demande.initiateur?.num_de_telephone || "N/A",
                Demandeur: demande.demandeur,
                Intention: getIntentionLabel(demande.intention),
                Concerne: demande.concerne,
                Description: demande.description || "N/A",
                "Statut de paiement": demande.est_payee ? "Payée" : "Non payée",
                Messe: demande.messe?.libelle || "N/A",
                "Type de messe": demande.messe?.extras?.type_messe || "N/A",
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            XLSX.utils.sheet_add_aoa(
                ws,
                [
                    [`Liste des Demandes de Messe`],
                    [`${paroisseName}`],
                    [`Date d'exportation: ${exportDate}`],
                    [`Nombre total: ${filteredDemandes.length}`],
                    [
                        `Demandes payées: ${filteredDemandes.filter((d) => d.est_payee).length}`,
                    ],
                    [
                        `Demandes non payées: ${filteredDemandes.filter((d) => !d.est_payee).length}`,
                    ],
                    [],
                ],
                { origin: "A1" }
            );

            const colWidths = [
                { wch: 2 }, // N°
                { wch: 15 }, // Date
                { wch: 20 }, // Initiateur
                { wch: 15 }, // Téléphone
                { wch: 20 }, // Demandeur
                { wch: 25 }, // Intention
                { wch: 20 }, // Concerne
                { wch: 30 }, // Description
                { wch: 12 }, // Statut
                { wch: 20 }, // Messe
                { wch: 15 }, // Type
            ];
            ws["!cols"] = colWidths;

            XLSX.utils.book_append_sheet(wb, ws, "Demandes");

            const fileName = `Demandes_Messe_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            toast.success("Exportation Excel réussie", {
                description: `Le fichier ${fileName} a été téléchargé.`,
            });
        } catch (error) {
            console.error("Erreur lors de l'exportation Excel:", error);
            toast.error("Erreur lors de l'exportation Excel");
        } finally {
            setExporting(false);
        }
    };

    // Export global en PDF
    // Fonction d'export PDF modifiée selon la maquette manuscrite
    const exportToPDF = async (filteredDemandes: DemandeMesse[]) => {
        try {
            setExporting(true);

            const exportDate = formatExportDate();

            const getParoisseNameFromProfile = (): string => {
                try {
                    const userProfileStr = localStorage.getItem("user_profile");
                    if (userProfileStr) {
                        const userProfile = JSON.parse(userProfileStr);
                        // Récupérer le nom de la paroisse depuis l'objet paroisse
                        return userProfile.paroisse?.nom || "Paroisse";
                    }
                } catch (err) {
                    console.error("Erreur lors de la récupération du nom de la paroisse:", err);
                }
                return "Paroisse";
            };
            const paroisseName = getParoisseNameFromProfile();

            const doc = new jsPDF("p"); // Portrait comme dans la maquette

            const primaryColor: [number, number, number] = [59, 130, 246];
            const secondaryColor: [number, number, number] = [148, 163, 184];
            const textColor: [number, number, number] = [15, 23, 42];

            // Mapping des types d'intentions
            const getIntentionTypeLabel = (intention: string): string => {
                const intentionTypes: Record<string, string> = {
                    "0": "Action de Grâce",
                    "1": "Aide, assistance et protection",
                    "2": "Rappel à Dieu",
                };
                return intentionTypes[intention] || intention;
            };

            // Grouper les demandes par type d'intention
            const demandesParType = {
                "0": filteredDemandes.filter(d => d.intention === "0"),
                "1": filteredDemandes.filter(d => d.intention === "1"),
                "2": filteredDemandes.filter(d => d.intention === "2"),
            };

            let yPosition = 20;

            // ============ EN-TÊTE ============
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...textColor);
            doc.text("DEMANDES DE MESSE", 105, yPosition, { align: "center" });

            yPosition += 8;
            doc.setFontSize(14);
            doc.text(`PAROISSE ${paroisseName.toUpperCase()}`, 105, yPosition, { align: "center" });

            // Ligne de séparation sous le titre
            yPosition += 5;
            doc.setDrawColor(...secondaryColor);
            doc.setLineWidth(0.5);
            doc.line(20, yPosition, 190, yPosition);

            // ============ DATE D'EXPORTATION ============
            yPosition += 15;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`Date d'exportation : ${exportDate}`, 20, yPosition);

            // ============ STATISTIQUES GLOBALES ============
            yPosition += 15;
            doc.setFont("helvetica", "bold");
            doc.text(`Total : ${filteredDemandes.length}`, 20, yPosition);

            yPosition += 8;
            doc.text(`Type 1 (Action de Grâce) : ${demandesParType["0"].length}`, 20, yPosition);

            yPosition += 8;
            doc.text(`Type 2 (Aide, assistance et protection) : ${demandesParType["1"].length}`, 20, yPosition);

            yPosition += 8;
            doc.text(`Type 3 (Rappel à Dieu) : ${demandesParType["2"].length}`, 20, yPosition);

            // ============ SECTION POUR CHAQUE TYPE ============
            Object.entries(demandesParType).forEach(([typeKey, demandes], index) => {
                if (demandes.length === 0) return;

                yPosition += 20;

                // Vérifier si on a assez d'espace, sinon nouvelle page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Titre du type
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text(`Type ${parseInt(typeKey) + 1}`, 20, yPosition);

                yPosition += 5;
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(`(${getIntentionTypeLabel(typeKey)})`, 20, yPosition);

                yPosition += 10;

                // Tableau pour ce type
                const tableData = demandes.map((demande, idx) => [
                    (idx + 1).toString(),
                    demande.initiateur
                        ? `${demande.initiateur.prenoms} ${demande.initiateur.nom}`.substring(0, 25)
                        : "N/A",
                    demande.demandeur.substring(0, 20),
                    demande.concerne.substring(0, 25),
                ]);

                autoTable(doc, {
                    startY: yPosition,
                    head: [["N°", "Initiateur", "Demandeur", "Concerne"]],
                    body: tableData,
                    theme: "grid",
                    styles: {
                        fontSize: 9,
                        cellPadding: 3,
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
                        1: { cellWidth: 50 },
                        2: { cellWidth: 40 },
                        3: { cellWidth: 55 },
                    },
                    margin: { left: 20, right: 20 },
                    didDrawPage: (data) => {
                        yPosition = data.cursor?.y || yPosition;
                    }
                });

                // Récupérer la position Y après le tableau
                yPosition = (doc as any).lastAutoTable.finalY + 10;
            });


            // ============ PIED DE PAGE ============
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                const pageHeight = doc.internal.pageSize.height;

                // Ligne de séparation
                doc.setDrawColor(...secondaryColor);
                doc.setLineWidth(0.3);
                doc.line(20, pageHeight - 20, 190, pageHeight - 20);

                // Informations du pied de page
                doc.setFontSize(8);
                doc.setTextColor(...secondaryColor);
                doc.setFont("helvetica", "normal");

                doc.text(`Page ${i} sur ${pageCount}`, 105, pageHeight - 12, {
                    align: "center",
                });
                doc.text(`Généré le ${exportDate}`, 20, pageHeight - 12);
                doc.text("Système de Gestion Paroissiale", 190, pageHeight - 12, {
                    align: "right",
                });
            }

            // ============ SAUVEGARDE ============
            const fileName = `Demandes_Messe_${paroisseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
            doc.save(fileName);

            toast.success("Exportation PDF réussie", {
                description: `Le fichier ${fileName} a été téléchargé avec la structure par types.`,
            });
        } catch (error) {
            console.error("Erreur lors de l'exportation PDF:", error);
            toast.error("Erreur lors de l'exportation PDF");
        } finally {
            setExporting(false);
        }
    };

    // // Fonction utilitaire mise à jour pour les nouveaux types
    // export const getIntentionLabel = (intention: string): string => {
    //     const intentionLabels: Record<string, string> = {
    //         "0": "Action de Grâce",
    //         "1": "Aide, assistance et protection",
    //         "2": "Rappel à Dieu",
    //     };
    //     return intentionLabels[intention] || intention;
    // };

    return {
        exporting,
        exportIndividualDemande,
        exportToExcel,
        exportToPDF,
    };
};