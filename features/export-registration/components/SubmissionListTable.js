import {
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import { PAGE_SIZE_OPTIONS } from "../constants";
import {
  formatSubmissionDate,
  getSubmissionReference,
  resolveOptionValue,
  safeText,
} from "../utils";

const SubmissionListTable = ({
  submissions,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onPrint,
  onDownloadPdf,
}) => {
  const columns = [
    {
      title: "Reference",
      key: "reference",
      render: (_, record) => (
        <div>
          <p className="font-semibold text-[#3D1C34]">
            {getSubmissionReference(record)}
          </p>
          <p className="text-xs text-[#7A746F]">
            {formatSubmissionDate(record.createdAt || record.submittedAt)}
          </p>
        </div>
      ),
    },
    {
      title: "Shipper",
      key: "shipper",
      render: (_, record) => (
        <div>
          <p className="font-medium">{safeText(record.shipperName)}</p>
          <p className="text-xs text-[#7A746F]">{safeText(record.shipperEmail)}</p>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "shipperPhone",
      key: "shipperPhone",
      render: (value) => safeText(value),
    },
    {
      title: "Consignee",
      key: "consignee",
      render: (_, record) => (
        <div>
          <p className="font-medium">{safeText(record.consigneeName)}</p>
          <p className="text-xs text-[#7A746F]">{safeText(record.consigneePhone)}</p>
        </div>
      ),
    },
    {
      title: "Routing",
      key: "routing",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag color="gold">
            {resolveOptionValue(record.originCountry, record.originCountryOther)}
          </Tag>
          <Tag color="purple">
            {resolveOptionValue(
              record.modeOfTransport,
              record.modeOfTransportOther
            )}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space wrap>
          <Button icon={<EyeOutlined />} onClick={() => onView(record)}>
            View
          </Button>
          <Button icon={<PrinterOutlined />} onClick={() => onPrint(record)}>
            Print
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            className="bg-[#7A3868] border-[#7A3868]"
            onClick={() => onDownloadPdf(record)}
          >
            PDF
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={submissions}
      columns={columns}
      loading={loading}
      size="middle"
      scroll={{ x: 1100 }}
      pagination={{
        current: currentPage,
        pageSize,
        total: submissions.length,
        showSizeChanger: true,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} submissions`,
        onChange: onPageChange,
      }}
    />
  );
};

export default SubmissionListTable;
