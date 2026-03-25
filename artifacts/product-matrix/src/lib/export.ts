import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ExportData {
  productName: string;
  dataYear: string;
  globalStats: {
    globalProduction: string;
    grossExportation: string;
    grossImportation: string;
    averagePrice: string;
  };
  producers: { name: string; country: string; description: string }[];
  distributors: { name: string; country: string; description: string }[];
  exportingCountries: { name: string; value: string; percentage: string }[];
  importingCountries: { name: string; value: string; percentage: string }[];
  headlines: { title: string; summary: string; source: string; date: string }[];
}

export function exportToPDF(data: ExportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ProductMatrix — Market Intelligence Report", 14, 12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.productName}  |  Data Year: ${data.dataYear}`, 14, 22);

  let y = 36;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Global Market Statistics", 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Global Production", data.globalStats.globalProduction],
      ["Gross Exportation", data.globalStats.grossExportation],
      ["Gross Importation", data.globalStats.grossImportation],
      ["Average Price", data.globalStats.averagePrice],
    ],
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
    tableWidth: "auto",
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Top Producers", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Company", "Country", "Description"]],
    body: data.producers.map(p => [p.name, p.country, p.description]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: { 2: { cellWidth: 80 } },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Key Distributors", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Company", "Country", "Description"]],
    body: data.distributors.map(d => [d.name, d.country, d.description]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: { 2: { cellWidth: 80 } },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Exporting Countries", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Country", "Export Value", "Global Share"]],
    body: data.exportingCountries.map(c => [c.name, c.value, c.percentage]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Importing Countries", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Country", "Import Value", "Global Share"]],
    body: data.importingCountries.map(c => [c.name, c.value, c.percentage]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  if (data.headlines?.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Latest Market Headlines", 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Headline", "Source", "Date"]],
      body: data.headlines.map(h => [h.title, h.source, h.date]),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: { 0: { cellWidth: 110 } },
      margin: { left: 14, right: 14 },
    });
  }

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `ProductMatrix.replit.app  |  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: "center" }
    );
  }

  const filename = `ProductMatrix_${data.productName.replace(/\s+/g, "_")}_${data.dataYear}.pdf`;
  doc.save(filename);
}

export function exportToExcel(data: ExportData) {
  const wb = XLSX.utils.book_new();

  const statsSheet = XLSX.utils.aoa_to_sheet([
    ["ProductMatrix — Market Intelligence Report"],
    ["Product", data.productName],
    ["Data Year", data.dataYear],
    [],
    ["Global Market Statistics"],
    ["Metric", "Value"],
    ["Global Production", data.globalStats.globalProduction],
    ["Gross Exportation", data.globalStats.grossExportation],
    ["Gross Importation", data.globalStats.grossImportation],
    ["Average Price", data.globalStats.averagePrice],
  ]);
  XLSX.utils.book_append_sheet(wb, statsSheet, "Overview");

  const producersSheet = XLSX.utils.json_to_sheet(
    data.producers.map(p => ({ Company: p.name, Country: p.country, Description: p.description }))
  );
  XLSX.utils.book_append_sheet(wb, producersSheet, "Producers");

  const distributorsSheet = XLSX.utils.json_to_sheet(
    data.distributors.map(d => ({ Company: d.name, Country: d.country, Description: d.description }))
  );
  XLSX.utils.book_append_sheet(wb, distributorsSheet, "Distributors");

  const exportsSheet = XLSX.utils.json_to_sheet(
    data.exportingCountries.map(c => ({ Country: c.name, "Export Value": c.value, "Global Share": c.percentage }))
  );
  XLSX.utils.book_append_sheet(wb, exportsSheet, "Exporting Countries");

  const importsSheet = XLSX.utils.json_to_sheet(
    data.importingCountries.map(c => ({ Country: c.name, "Import Value": c.value, "Global Share": c.percentage }))
  );
  XLSX.utils.book_append_sheet(wb, importsSheet, "Importing Countries");

  if (data.headlines?.length > 0) {
    const headlinesSheet = XLSX.utils.json_to_sheet(
      data.headlines.map(h => ({ Headline: h.title, Summary: h.summary, Source: h.source, Date: h.date }))
    );
    XLSX.utils.book_append_sheet(wb, headlinesSheet, "Headlines");
  }

  const filename = `ProductMatrix_${data.productName.replace(/\s+/g, "_")}_${data.dataYear}.xlsx`;
  XLSX.writeFile(wb, filename);
}
