import React, { useState, useRef } from "react";
import {
  Table,
  Space,
  Dropdown,
  Menu,
  Drawer,
  message,
  Button,
  Modal,
} from "antd";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import {
  MoreOutlined,
  EditFilled,
  DeleteFilled,
  EyeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import ShipmentDetails from "./ShipmentDetails";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Receipt from "./Receipt";

const { Column } = Table;

const statusColor = (status) => {
  switch (status) {
    case "Shipment Received":
      return "#9C793F";
      break;
    case "Enroute":
      return "#40A9FF";
      break;
    case "Awaiting Custom Clearance":
      return "#8C8C8C";
      break;
    case "Ready for Pickup/Delivery":
      return "#3D1C34";
      break;
    default:
      return "#4E3D20";
      break;
  }
};

const ListShipments = ({ shipments }) => {
  const [shipment, setShipment] = useState(null);
  const [view, setView] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);

  const componentReceipt = useRef();

  const printReceipt = useReactToPrint({
    content: () => componentReceipt.current,
  });

  return (
    <div className="mt-4 w-full overflow-x-auto">
      <Table dataSource={shipments} size="small" style={{ width: "100%" }}>
        <Column
          title="Shipping ID"
          dataIndex="trackingNumber"
          key="trackNumber"
        />
        <Column
          title="Status"
          key="status"
          render={(record) => (
            <Space>
              <p
                style={{ backgroundColor: statusColor(record.status) }}
                className="rounded text-white py-[1px] px-[3px] text-center"
              >
                {record.status}
              </p>
            </Space>
          )}
        />
        <Column
          title="Origin"
          key="warehouse"
          render={(record) => (
            <Space size="small">
              <p className="capitalize">{record.warehouse.country}</p>
            </Space>
          )}
        />
        <Column title="Receiver" dataIndex="consignee" key="consignee" />
        <Column
          title="Destination"
          dataIndex="consigneeAddress"
          key="consigneeAddress"
        />
        <Column
          title="Expected Delivery Date"
          dataIndex="expectedDeliveryDate"
          key="date"
        />
        <Column
          title="Amount Paid"
          key="charge"
          render={(record) => (
            <Space size="small">
              <p className="capitalize">
                <span className="font-semibold text-[10px]">
                  {record.currency}
                </span>{" "}
                {record.charge}
              </p>
            </Space>
          )}
        />
        <Column
          title="Invoice"
          key="paymentStatus"
          render={(record) => (
            <Space size="small">
              {record.paymentStatus === "paid" ? (
                <p className="bg-[#8eb150] capitalize rounded-full text-white py-2 px-5 active:outline-none outline-none">
                  Paid
                </p>
              ) : (
                <Button type="primary" danger className="rounded-full">
                  Pay Now
                </Button>
              )}
            </Space>
          )}
        />
        <Column
          title="Actions"
          key="action"
          className="text-center"
          render={(text, record) => (
            <Space size="small">
              <EyeOutlined
                style={{ color: "lightskyblue" }}
                className="text-lg cursor-pointer"
                onClick={() => {
                  setView(true);
                  setShipment(record);
                }}
              />
            </Space>
          )}
        />
      </Table>
      <Drawer
        title="Shipment Details"
        width={"50%"}
        onClose={() => {
          setShipment(null);
          setView(false);
        }}
        visible={view}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            {shipment && shipment.paymentStatus === "paid" ? (
              <Button
                className="bg-white text-purple-600 border-purple-600"
                onClick={() => setOpenReceipt(true)}
              >
                Print Reciept
              </Button>
            ) : null}
          </Space>
        }
      >
        {shipment && <ShipmentDetails shipment={shipment} />}
      </Drawer>

      <Modal
        title={
          <div className="flex items-center space-x-2">
            <Button
              className="bg-white text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white hover:border-none"
              onClick={printReceipt}
            >
              Print
            </Button>
          </div>
        }
        centered
        visible={openReceipt}
        onCancel={() => setOpenReceipt(false)}
        width={"60%"}
        footer={null}
        style={{ zIndex: "9999" }}
      >
        {shipment && (
          <Receipt shipment={shipment} componentReceipt={componentReceipt} />
        )}
      </Modal>
    </div>
  );
};

export default ListShipments;
