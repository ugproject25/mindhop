import jsPDF from "jspdf";

export function generateSummaryPDF(summaryText) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("mindhop — Notes Summary", 14, 20);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  const lines = doc.splitTextToSize(summaryText, 180);
  doc.text(lines, 14, 40);

  doc.save("mindhop-summary.pdf");
}
