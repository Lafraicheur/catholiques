/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// hooks/useExport.ts
import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

export interface ExportData {
  id: number;
  created_at: string;
  nom: string;
  identifiant?: string;
  president?: {
    nom: string;
    prenoms: string;
    num_de_telephone?: string;
  };
  solde?: number;
  membersCount?: number;
}

export interface ExportOptions {
  title: string;
  organizationName: string;
  filename: string;
  includeStats?: boolean;
}

export const useExport = () => {
  const [exporting, setExporting] = useState(false);

  const formatExportDate = (): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Non renseignée";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR").format(date);
    } catch (err) {
      return dateString;
    }
  };

  const exportToExcel = async (exportData: { "N°": number; "Date d'ajout": string; Nom: string; Prénom: string; Genre: string; Téléphone: string; }[], p0: string, p1: string, headers: string[], data: ExportData[], options: ExportOptions) => {
    try {
      setExporting(true);
      
      const exportDate = formatExportDate();
      
      // Préparer les données pour l'exportation
      const exportData = data.map((item, index) => ({
        'N°': index + 1,
        'Date d\'ajout': formatDate(item.created_at),
        'Nom de la CEB': item.nom,
        'Identifiant': item.identifiant || 'N/A',
        'Président': item.president 
          ? `${item.president.nom} ${item.president.prenoms}` 
          : 'Aucun',
        'Téléphone Président': item.president?.num_de_telephone || 'N/A',
        'Solde (FCFA)': item.solde || 0,
        'Nombre de Membres': item.membersCount || 0,
      }));

      // Créer le workbook
      const wb = XLSX.utils.book_new();
      
      // Créer la feuille principale avec les données
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Ajouter des informations d'en-tête
      const headerData = [
        [options.title],
        [options.organizationName],
        [`Date d'exportation: ${exportDate}`],
        [`Nombre total d'éléments: ${data.length}`],
        [], // Ligne vide
      ];
      
      XLSX.utils.sheet_add_aoa(ws, headerData, { origin: 'A1' });
      
      // Ajuster les largeurs des colonnes
      const colWidths = [
        { wch: 5 },  // N°
        { wch: 15 }, // Date
        { wch: 25 }, // Nom CEB
        { wch: 15 }, // Identifiant
        { wch: 20 }, // Président
        { wch: 15 }, // Téléphone
        { wch: 12 }, // Solde
        { wch: 10 }, // Membres
      ];
      ws['!cols'] = colWidths;
      
      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Données');
      
      // Créer le nom de fichier avec la date
      const fileName = `${options.filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Sauvegarder le fichier
      XLSX.writeFile(wb, fileName);
      
      toast.success('Exportation Excel réussie', {
        description: `Le fichier ${fileName} a été téléchargé.`
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'exportation Excel:', error);
      toast.error('Erreur lors de l\'exportation Excel');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async (exportData: string[][], p0: string, p1: string, p2: string[], columnStyles: { 0: { cellWidth: number; halign: string; }; 1: { cellWidth: number; halign: string; }; 2: { cellWidth: number; }; 3: { cellWidth: number; halign: string; }; 4: { cellWidth: number; halign: string; }; }, data: ExportData[], options: ExportOptions) => {
    try {
      setExporting(true);
      
      const exportDate = formatExportDate();
      
      // Créer le document PDF
      const doc = new jsPDF();
      
      // Configuration des couleurs
      const primaryColor: [number, number, number] = [59, 130, 246]; // Blue-500
      const secondaryColor: [number, number, number] = [148, 163, 184]; // Slate-400
      const textColor: [number, number, number] = [15, 23, 42]; // Slate-900
      
      // En-tête du document avec design moderne
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Titre principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(options.title, 105, 18, { align: 'center' });
      
      // Sous-titre
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(options.organizationName, 105, 28, { align: 'center' });
      
      // Ligne décorative
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1);
      doc.line(60, 32, 150, 32);
      
      // Informations d'exportation avec icônes stylées
      doc.setTextColor(...textColor);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT D\'EXPORTATION', 20, 52);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`📅 Date d'exportation: ${exportDate}`, 20, 60);
      doc.text(`📊 Nombre total d'éléments: ${data.length}`, 20, 68);
      
      if (options.includeStats) {
        const withPresident = data.filter(item => item.president).length;
        const withoutPresident = data.length - withPresident;
        doc.text(`👤 Avec président: ${withPresident}`, 20, 76);
        doc.text(`❌ Sans président: ${withoutPresident}`, 20, 84);
      }
      
      // Ligne de séparation élégante
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(1);
      doc.line(20, 92, 190, 92);
      
      // Préparer les données pour le tableau
      const tableData = data.map((item, index) => [
        (index + 1).toString(),
        formatDate(item.created_at),
        item.nom.length > 30 ? item.nom.substring(0, 27) + '...' : item.nom,
        item.president 
          ? `${item.president.nom} ${item.president.prenoms}`.length > 25
            ? `${item.president.nom} ${item.president.prenoms}`.substring(0, 22) + '...'
            : `${item.president.nom} ${item.president.prenoms}`
          : 'Aucun',
        item.president?.num_de_telephone || 'N/A',
        (item.membersCount || 0).toString(),
      ]);
      
      // Créer le tableau avec autoTable
      autoTable(doc, {
        startY: 98,
        head: [['N°', 'Date d\'ajout', 'Nom de la CEB', 'Président', 'Téléphone', 'Membres']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 5,
          textColor: textColor,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Slate-50
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' }, // N°
          1: { cellWidth: 28, halign: 'center' }, // Date
          2: { cellWidth: 45 }, // Nom
          3: { cellWidth: 42 }, // Président
          4: { cellWidth: 32, halign: 'center' }, // Téléphone
          5: { cellWidth: 18, halign: 'center' }, // Membres
        },
        margin: { left: 20, right: 20 },
        didDrawPage: (data: any) => {
          // Filigrane léger
          doc.setTextColor(240, 240, 240);
          doc.setFontSize(60);
          doc.text('CEB', 105, 150, { 
            align: 'center',
            angle: 45,
            renderingMode: 'stroke'
          });
        }
      });
      
      // Pied de page professionnel
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        const pageHeight = doc.internal.pageSize.height;
        
        // Rectangle de pied de page
        doc.setFillColor(248, 250, 252);
        doc.rect(20, pageHeight - 25, 170, 15, 'F');
        
        // Ligne de séparation du pied de page
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(20, pageHeight - 25, 190, pageHeight - 25);
        
        // Informations du pied de page
        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);
        doc.text(`Page ${i} sur ${pageCount}`, 105, pageHeight - 16, { align: 'center' });
        doc.text(`Généré le ${exportDate}`, 22, pageHeight - 16);
        doc.text('Système de Gestion Paroissiale', 188, pageHeight - 16, { align: 'right' });
        
        // Logo ou symbole (vous pouvez ajouter une image ici)
        doc.setTextColor(...primaryColor);
        doc.setFontSize(10);
        doc.text('⛪', 22, pageHeight - 7);
      }
      
      // Sauvegarder le fichier
      const fileName = `${options.filename}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('Exportation PDF réussie', {
        description: `Le fichier ${fileName} a été téléchargé.`
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'exportation PDF:', error);
      toast.error('Erreur lors de l\'exportation PDF');
    } finally {
      setExporting(false);
    }
  };

  return {
    exportToExcel,
    exportToPDF,
    exporting,
  };
};