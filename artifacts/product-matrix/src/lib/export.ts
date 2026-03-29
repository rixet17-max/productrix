import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";

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

// ─── Colours matching the app ────────────────────────────────────────────────
const BLUE = "FF2563EB";   // primary blue
const NAVY = "FF1E293B";   // dark foreground
const LIGHT = "FFF1F5F9";  // alternating row bg
const WHITE = "FFFFFFFF";
const MUTED = "FF64748B";  // muted text

// ─── Helper: styled header row ───────────────────────────────────────────────
function addSectionHeader(ws: ExcelJS.Worksheet, row: number, label: string, cols: number) {
  const r = ws.getRow(row);
  r.getCell(1).value = label;
  r.getCell(1).font = { bold: true, size: 12, color: { argb: NAVY } };
  r.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
  for (let c = 1; c <= cols; c++) {
    const cell = r.getCell(c);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
    };
  }
  r.height = 22;
  ws.mergeCells(row, 1, row, cols);
}

function addTableHeader(ws: ExcelJS.Worksheet, row: number, headers: string[]) {
  const r = ws.getRow(row);
  headers.forEach((h, i) => {
    const cell = r.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: WHITE }, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BLUE } };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: false };
    cell.border = {
      top: { style: "thin", color: { argb: "FF1D4ED8" } },
      bottom: { style: "thin", color: { argb: "FF1D4ED8" } },
      right: { style: "thin", color: { argb: "FF1D4ED8" } },
    };
  });
  r.height = 20;
}

function addDataRow(
  ws: ExcelJS.Worksheet,
  row: number,
  values: string[],
  isAlt: boolean,
  boldFirst = false
) {
  const r = ws.getRow(row);
  const bg = isAlt ? LIGHT : WHITE;
  values.forEach((v, i) => {
    const cell = r.getCell(i + 1);
    cell.value = v;
    cell.font = { size: 10, bold: boldFirst && i === 0, color: { argb: NAVY } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = {
      bottom: { style: "hair", color: { argb: "FFCBD5E1" } },
      right: { style: "hair", color: { argb: "FFCBD5E1" } },
    };
  });
  r.height = 18;
}

export async function exportToExcel(data: ExportData) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProductMatrix";
  wb.created = new Date();

  // ─── Sheet 1: Full Report ──────────────────────────────────────────────────
  const ws = wb.addWorksheet("Market Report", {
    pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  });

  ws.columns = [
    { width: 32 }, // A
    { width: 18 }, // B
    { width: 18 }, // C
    { width: 55 }, // D (description / summary)
  ];

  let r = 1;

  // ── Title block
  const titleRow = ws.getRow(r);
  titleRow.getCell(1).value = "ProductMatrix — Market Intelligence Report";
  titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: WHITE } };
  titleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: BLUE } };
  titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
  ws.mergeCells(r, 1, r, 4);
  titleRow.height = 32;
  r++;

  const subRow = ws.getRow(r);
  subRow.getCell(1).value = `Product: ${data.productName}`;
  subRow.getCell(1).font = { bold: true, size: 11, color: { argb: WHITE } };
  subRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
  subRow.getCell(2).value = `Data Year: ${data.dataYear}`;
  subRow.getCell(2).font = { size: 10, color: { argb: WHITE } };
  subRow.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
  subRow.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
  subRow.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
  subRow.height = 22;
  r++;

  // ── Global Stats
  r++;
  addSectionHeader(ws, r, "📊  Global Market Statistics", 4);
  r++;
  addTableHeader(ws, r, ["Metric", "Value", "", ""]);
  r++;
  const stats = [
    ["Global Production", data.globalStats.globalProduction],
    ["Gross Exportation", data.globalStats.grossExportation],
    ["Gross Importation", data.globalStats.grossImportation],
    ["Average Market Price", data.globalStats.averagePrice],
  ];
  stats.forEach(([label, value], i) => {
    const row = ws.getRow(r);
    row.getCell(1).value = label;
    row.getCell(1).font = { bold: true, size: 10, color: { argb: MUTED } };
    row.getCell(2).value = value;
    row.getCell(2).font = { bold: true, size: 11, color: { argb: NAVY } };
    const bg = i % 2 === 1 ? LIGHT : WHITE;
    [1, 2, 3, 4].forEach(c => {
      const cell = row.getCell(c);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      cell.border = { bottom: { style: "hair", color: { argb: "FFCBD5E1" } } };
    });
    row.height = 20;
    r++;
  });

  // ── Producers
  r++;
  addSectionHeader(ws, r, "🏭  Top Global Producers", 4);
  r++;
  addTableHeader(ws, r, ["Company", "Country", "", "Description"]);
  r++;
  data.producers.forEach((p, i) => {
    addDataRow(ws, r, [p.name, p.country, "", p.description], i % 2 === 1, true);
    r++;
  });

  // ── Distributors
  r++;
  addSectionHeader(ws, r, "🚚  Key Distributors & Traders", 4);
  r++;
  addTableHeader(ws, r, ["Company", "Country", "", "Description"]);
  r++;
  data.distributors.forEach((d, i) => {
    addDataRow(ws, r, [d.name, d.country, "", d.description], i % 2 === 1, true);
    r++;
  });

  // ── Exporting Countries
  r++;
  addSectionHeader(ws, r, "🚢  Top Exporting Countries", 4);
  r++;
  addTableHeader(ws, r, ["Country", "Export Value", "Global Share", ""]);
  r++;
  data.exportingCountries.forEach((c, i) => {
    addDataRow(ws, r, [c.name, c.value, c.percentage, ""], i % 2 === 1, true);
    r++;
  });

  // ── Importing Countries
  r++;
  addSectionHeader(ws, r, "📦  Top Importing Countries", 4);
  r++;
  addTableHeader(ws, r, ["Country", "Import Value", "Global Share", ""]);
  r++;
  data.importingCountries.forEach((c, i) => {
    addDataRow(ws, r, [c.name, c.value, c.percentage, ""], i % 2 === 1, true);
    r++;
  });

  // ── Headlines
  if (data.headlines?.length > 0) {
    r++;
    addSectionHeader(ws, r, "📰  Latest Market Headlines", 4);
    r++;
    addTableHeader(ws, r, ["Headline", "Source", "Date", "Summary"]);
    r++;
    data.headlines.forEach((h, i) => {
      addDataRow(ws, r, [h.title, h.source, h.date, h.summary], i % 2 === 1, true);
      r++;
    });
  }

  // ── Footer
  r++;
  const footerRow = ws.getRow(r);
  footerRow.getCell(1).value = "Generated by ProductMatrix — www.productrix.com";
  footerRow.getCell(1).font = { italic: true, size: 9, color: { argb: MUTED } };
  ws.mergeCells(r, 1, r, 4);

  // ─── Download ──────────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ProductMatrix_${data.productName.replace(/\s+/g, "_")}_${data.dataYear}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── PDF export (unchanged) ───────────────────────────────────────────────────
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

  const section = (label: string) => {
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y);
    y += 4;
  };

  section("Global Market Statistics");
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
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  section("Top Producers");
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
  section("Key Distributors");
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
  section("Exporting Countries");
  autoTable(doc, {
    startY: y,
    head: [["Country", "Export Value", "Global Share"]],
    body: data.exportingCountries.map(c => [c.name, c.value, c.percentage]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  section("Importing Countries");
  autoTable(doc, {
    startY: y,
    head: [["Country", "Import Value", "Global Share"]],
    body: data.importingCountries.map(c => [c.name, c.value, c.percentage]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });

  if (data.headlines?.length > 0) {
    y = (doc as any).lastAutoTable.finalY + 10;
    section("Latest Market Headlines");
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
      `www.productrix.com  |  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: "center" }
    );
  }

  doc.save(`ProductMatrix_${data.productName.replace(/\s+/g, "_")}_${data.dataYear}.pdf`);
}
