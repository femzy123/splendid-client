const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

export const safeText = (value, fallback = "-") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue === "" ? fallback : trimmedValue;
  }

  return value;
};

export const resolveOptionValue = (value, otherValue) => {
  if (value === "Other") {
    return safeText(otherValue, "Other");
  }

  return safeText(value);
};

export const formatSubmissionDate = (value) => {
  if (!value) {
    return "-";
  }

  if (typeof value === "object" && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toLocaleString(
      "en-NG",
      DATE_FORMAT_OPTIONS
    );
  }

  return new Date(value).toLocaleString("en-NG", DATE_FORMAT_OPTIONS);
};

export const getSubmissionReference = (submission) =>
  submission?.id ? `EXR-${submission.id.slice(0, 8).toUpperCase()}` : "EXR";

export const sanitizeFileName = (value) =>
  String(value || "file")
    .trim()
    .replace(/[^a-z0-9.-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export const getSubmissionFileName = (submission) =>
  `export-registration-${sanitizeFileName(getSubmissionReference(submission))}.pdf`;

export const getSearchableSubmissionText = (submission) =>
  [
    submission?.id,
    getSubmissionReference(submission),
    submission?.shipperName,
    submission?.shipperEmail,
    submission?.shipperPhone,
    submission?.consigneeName,
    submission?.consigneePhone,
    resolveOptionValue(submission?.originCountry, submission?.originCountryOther),
    resolveOptionValue(
      submission?.consigneeCountry,
      submission?.consigneeCountryOther
    ),
    resolveOptionValue(
      submission?.modeOfTransport,
      submission?.modeOfTransportOther
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const sortSubmissionsByNewest = (submissions) =>
  [...submissions].sort((left, right) => {
    const leftSubmittedAt = Date.parse(left?.submittedAt || "");
    const rightSubmittedAt = Date.parse(right?.submittedAt || "");
    const leftValue =
      left?.createdAt?.seconds ||
      (Number.isNaN(leftSubmittedAt) ? 0 : leftSubmittedAt) ||
      left?.createdAtMs ||
      0;
    const rightValue =
      right?.createdAt?.seconds ||
      (Number.isNaN(rightSubmittedAt) ? 0 : rightSubmittedAt) ||
      right?.createdAtMs ||
      0;

    return rightValue - leftValue;
  });

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the uploaded image"));
    reader.readAsDataURL(file);
  });

export const createImagePreviewDataUrl = async (
  file,
  maxWidth = 360,
  maxHeight = 260
) => {
  const dataUrl = await fileToDataUrl(file);

  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = image;
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio, 1);

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };

    image.onerror = () =>
      reject(new Error("Unable to process the uploaded image"));
    image.src = dataUrl;
  });
};
