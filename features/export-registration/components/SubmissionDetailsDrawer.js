import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Descriptions, Drawer, Image, Space, Tag } from "antd";
import {
  formatSubmissionDate,
  getSubmissionReference,
  resolveOptionValue,
  safeText,
} from "../utils";

const SubmissionDetailsDrawer = ({
  open,
  submission,
  onClose,
  onPrint,
  onDownloadPdf,
}) => {
  return (
    <Drawer
      title={submission ? getSubmissionReference(submission) : "Submission"}
      width={640}
      onClose={onClose}
      visible={open}
      extra={
        submission ? (
          <Space>
            <Button icon={<PrinterOutlined />} onClick={() => onPrint(submission)}>
              Print
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              className="bg-[#7A3868] border-[#7A3868]"
              onClick={() => onDownloadPdf(submission)}
            >
              Download PDF
            </Button>
          </Space>
        ) : null
      }
    >
      {submission ? (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#F6F4F0] p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7A746F]">
                  Submitted
                </p>
                <p className="text-base font-medium text-[#221F1F]">
                  {formatSubmissionDate(
                    submission.createdAt || submission.submittedAt
                  )}
                </p>
              </div>
              <Tag color="#7A3868" className="rounded-full px-3 py-1">
                Ready for print/PDF
              </Tag>
            </div>
          </div>

          <Descriptions
            title="Shipper Details"
            bordered
            size="small"
            column={1}
          >
            <Descriptions.Item label="Full Name">
              {safeText(submission.shipperName)}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {safeText(submission.shipperEmail)}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {safeText(submission.shipperPhone)}
            </Descriptions.Item>
            <Descriptions.Item label="Origin Country">
              {resolveOptionValue(
                submission.originCountry,
                submission.originCountryOther
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {safeText(submission.shipperAddress)}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Shipment Details"
            bordered
            size="small"
            column={1}
          >
            <Descriptions.Item label="Mode of Transport">
              {resolveOptionValue(
                submission.modeOfTransport,
                submission.modeOfTransportOther
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Type of Shipment">
              {resolveOptionValue(
                submission.shipmentType,
                submission.shipmentTypeOther
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Agreement">
              {submission.agreedToTerms ? "Yes" : "No"}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Consignee Details"
            bordered
            size="small"
            column={1}
          >
            <Descriptions.Item label="Full Name">
              {safeText(submission.consigneeName)}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {safeText(submission.consigneePhone)}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {resolveOptionValue(
                submission.consigneeCountry,
                submission.consigneeCountryOther
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {safeText(submission.consigneeAddress)}
            </Descriptions.Item>
          </Descriptions>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#3D1C34]">
              Uploaded ID
            </h3>
            {submission.idImagePreview || submission.idImageUrl ? (
              <Image
                src={submission.idImagePreview || submission.idImageUrl}
                alt="Uploaded ID"
                className="rounded-2xl object-contain"
                preview
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D3C9C3] p-6 text-center text-sm text-[#7A746F]">
                No image preview available.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Drawer>
  );
};

export default SubmissionDetailsDrawer;
