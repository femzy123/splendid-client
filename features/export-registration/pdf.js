import { jsPDF } from "jspdf";
import { COMPANY_LETTERHEAD } from "./constants";
import {
  formatSubmissionDate,
  getSubmissionFileName,
  getSubmissionReference,
  resolveOptionValue,
  safeText,
} from "./utils";

const BRAND = {
  plum: [122, 56, 104],
  gold: [156, 121, 63],
  ink: [46, 46, 46],
  slate: [104, 104, 104],
  line: [219, 211, 205],
  cream: [246, 244, 240],
};

let logoDataUrlPromise = null;

const loadLogoDataUrl = async () => {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(COMPANY_LETTERHEAD.logoPath)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Unable to load logo"));
            reader.readAsDataURL(blob);
          })
      )
      .catch(() => null);
  }

  return logoDataUrlPromise;
};

const drawSection = (doc, title, x, y, width, height) => {
  doc.setFillColor(...BRAND.plum);
  doc.roundedRect(x, y, width, height, 3, 3, "S");
  doc.rect(x, y, width, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(title, x + 4, y + 5.5);
  doc.setTextColor(...BRAND.ink);
};

const drawField = (doc, label, value, x, y, width, maxLines = 2) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.slate);
  doc.text(String(label || "").toUpperCase(), x, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND.ink);

  const lines = doc.splitTextToSize(safeText(value), width).slice(0, maxLines);
  doc.text(lines, x, y + 5);
};

const drawDocumentMeta = (doc, submission) => {
  doc.setFillColor(...BRAND.gold);
  doc.roundedRect(12, 45, 186, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Export Shipping Registration", 16, 51.5);

  doc.setTextColor(...BRAND.ink);
  doc.setFillColor(...BRAND.cream);
  doc.roundedRect(12, 58, 186, 14, 3, 3, "FD");
  doc.setDrawColor(...BRAND.line);
  doc.line(74, 58, 74, 72);
  doc.line(138, 58, 138, 72);

  drawField(doc, "Reference", getSubmissionReference(submission), 16, 64, 48, 1);
  drawField(
    doc,
    "Submitted",
    formatSubmissionDate(submission?.createdAt || submission?.submittedAt),
    80,
    64,
    48,
    2
  );
  drawField(doc, "Website", COMPANY_LETTERHEAD.website, 144, 64, 48, 1);
};

const drawLetterhead = async (doc) => {
  const logoDataUrl = await loadLogoDataUrl();

  doc.setDrawColor(...BRAND.line);
  doc.roundedRect(12, 12, 186, 28, 3, 3, "S");

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 16, 14.5, 24, 20);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...BRAND.plum);
  doc.text(COMPANY_LETTERHEAD.name, 54, 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...BRAND.ink);
  doc.text(COMPANY_LETTERHEAD.officeAddress, 54, 24.5);
  doc.text(
    COMPANY_LETTERHEAD.phones.join("  |  "),
    54,
    29.5,
    { maxWidth: 132 }
  );
  doc.text(
    `${COMPANY_LETTERHEAD.email}  |  ${COMPANY_LETTERHEAD.website}`,
    54,
    34.5,
    { maxWidth: 132 }
  );
  doc.text(COMPANY_LETTERHEAD.workingHours, 54, 39);
};

const drawImagePanel = (doc, submission) => {
  drawSection(doc, "Uploaded ID", 138, 76, 60, 66);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(144, 88, 48, 46, 2, 2, "FD");

  if (submission?.idImagePreview) {
    doc.addImage(submission.idImagePreview, "JPEG", 145.5, 90, 45, 42);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.slate);
    doc.text("No preview available", 168, 111, { align: "center" });
  }
};

const drawShipperSection = (doc, submission) => {
  drawSection(doc, "Shipper Details", 12, 76, 120, 66);

  drawField(doc, "Full Name", submission?.shipperName, 18, 89, 49, 2);
  drawField(doc, "Email", submission?.shipperEmail, 76, 89, 48, 2);

  drawField(doc, "Phone", submission?.shipperPhone, 18, 104, 49, 2);
  drawField(
    doc,
    "Origin Country",
    resolveOptionValue(submission?.originCountry, submission?.originCountryOther),
    76,
    104,
    48,
    2
  );

  drawField(
    doc,
    "Mode of Transport",
    resolveOptionValue(
      submission?.modeOfTransport,
      submission?.modeOfTransportOther
    ),
    18,
    119,
    49,
    2
  );
  drawField(
    doc,
    "Type of Shipment",
    resolveOptionValue(submission?.shipmentType, submission?.shipmentTypeOther),
    76,
    119,
    48,
    2
  );

  drawField(doc, "Address", submission?.shipperAddress, 18, 131, 106, 5);
};

const drawConsigneeSection = (doc, submission) => {
  drawSection(doc, "Consignee Details", 12, 146, 186, 44);

  drawField(doc, "Full Name", submission?.consigneeName, 18, 159, 55, 2);
  drawField(doc, "Phone", submission?.consigneePhone, 86, 159, 45, 2);
  drawField(
    doc,
    "Country",
    resolveOptionValue(
      submission?.consigneeCountry,
      submission?.consigneeCountryOther
    ),
    144,
    159,
    46,
    2
  );

  drawField(doc, "Address", submission?.consigneeAddress, 18, 174, 172, 3);
};

export const downloadSubmissionPdf = async (submission) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await drawLetterhead(doc);
  drawDocumentMeta(doc, submission);
  drawShipperSection(doc, submission);
  drawImagePanel(doc, submission);
  drawConsigneeSection(doc, submission);

  doc.save(getSubmissionFileName(submission));
};
