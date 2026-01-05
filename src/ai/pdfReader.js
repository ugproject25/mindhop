import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.js?url";

/**
 * pdfjs-dist v3 + Vite REQUIREMENT:
 * workerSrc MUST be a valid string URL
 */
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}
