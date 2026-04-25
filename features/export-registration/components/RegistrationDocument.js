import React, { forwardRef } from "react";
import { COMPANY_LETTERHEAD } from "../constants";
import {
  formatSubmissionDate,
  getSubmissionReference,
  resolveOptionValue,
  safeText,
} from "../utils";

const sectionTitleStyle = {
  backgroundColor: "#7A3868",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  padding: "8px 12px",
};

const infoLabelStyle = {
  color: "#7A746F",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const infoValueStyle = {
  color: "#221F1F",
  fontSize: "13px",
  lineHeight: 1.45,
  marginTop: "4px",
  wordBreak: "break-word",
};

const InfoItem = ({ label, value }) => (
  <div>
    <div style={infoLabelStyle}>{label}</div>
    <div style={infoValueStyle}>{safeText(value)}</div>
  </div>
);

const SectionCard = ({ title, children, className = "", style = {} }) => (
  <div
    className={`overflow-hidden rounded-[18px] border border-[#DED6D1] bg-white ${className}`}
    style={style}
  >
    <div style={sectionTitleStyle}>{title}</div>
    <div className="p-4">{children}</div>
  </div>
);

const RegistrationDocument = forwardRef(({ submission }, ref) => {
  const submittedAt = formatSubmissionDate(
    submission?.createdAt || submission?.submittedAt
  );

  return (
    <div
      ref={ref}
      className="bg-white text-[#231F20]"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "28px",
      }}
    >
      <div className="rounded-[22px] border border-[#DED6D1] bg-white p-5">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4" style={{ maxWidth: "520px" }}>
            <img
              src={COMPANY_LETTERHEAD.logoPath}
              alt="Splendid Packaging logo"
              style={{
                width: "108px",
                height: "52px",
                objectFit: "contain",
                objectPosition: "center",
                flexShrink: 0,
              }}
            />
            <div>
              <h1 className="text-[24px] font-semibold text-[#7A3868]">
                {COMPANY_LETTERHEAD.name}
              </h1>
              <div className="space-y-1 text-[12px] text-[#514B47]">
                <p>{COMPANY_LETTERHEAD.officeAddress}</p>
                <p>{COMPANY_LETTERHEAD.phones.join(" | ")}</p>
                <p>
                  {COMPANY_LETTERHEAD.email} | {COMPANY_LETTERHEAD.website}
                </p>
                <p>{COMPANY_LETTERHEAD.workingHours}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F6F4F0] px-4 py-3 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A746F]">
              Reference
            </p>
            <p className="text-[15px] font-semibold text-[#231F20]">
              {getSubmissionReference(submission)}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A746F]">
              Submitted
            </p>
            <p className="text-[13px] text-[#231F20]">{submittedAt}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[18px] bg-[#9C793F] px-4 py-3 text-center text-[18px] font-semibold text-white">
        Export Shipping Registration
      </div>

      <div
        className="mt-5 grid gap-5"
        style={{ gridTemplateColumns: "1.35fr 0.75fr" }}
      >
        <SectionCard title="Shipper Details">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <InfoItem label="Full Name" value={submission?.shipperName} />
            <InfoItem label="Email" value={submission?.shipperEmail} />
            <InfoItem label="Phone" value={submission?.shipperPhone} />
            <InfoItem
              label="Origin Country"
              value={resolveOptionValue(
                submission?.originCountry,
                submission?.originCountryOther
              )}
            />
            <InfoItem
              label="Mode of Transport"
              value={resolveOptionValue(
                submission?.modeOfTransport,
                submission?.modeOfTransportOther
              )}
            />
            <InfoItem
              label="Type of Shipment"
              value={resolveOptionValue(
                submission?.shipmentType,
                submission?.shipmentTypeOther
              )}
            />
            <div className="col-span-2">
              <InfoItem label="Address" value={submission?.shipperAddress} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Uploaded ID">
          <div className="flex h-full flex-col justify-center gap-4">
            <div className="flex justify-center rounded-2xl bg-[#F6F4F0] p-3">
              {submission?.idImagePreview || submission?.idImageUrl ? (
                <img
                  src={submission.idImagePreview || submission.idImageUrl}
                  alt="Uploaded ID"
                  className="h-[160px] w-full rounded-xl object-contain"
                />
              ) : (
                <div className="flex h-[160px] w-full items-center justify-center rounded-xl border border-dashed border-[#D3C9C3] text-sm text-[#7A746F]">
                  No image preview
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard title="Consignee Details">
          <div className="grid grid-cols-3 gap-x-6 gap-y-5">
            <InfoItem label="Full Name" value={submission?.consigneeName} />
            <InfoItem label="Phone" value={submission?.consigneePhone} />
            <InfoItem
              label="Country"
              value={resolveOptionValue(
                submission?.consigneeCountry,
                submission?.consigneeCountryOther
              )}
            />
            <div className="col-span-3">
              <InfoItem label="Address" value={submission?.consigneeAddress} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
});

RegistrationDocument.displayName = "RegistrationDocument";

export default RegistrationDocument;
