import React from "react";
import { Divider, Image, Table } from "antd";
import Barcode from "../../utils/react-barcode";

const { Column } = Table;
const safeText = (value, fallback = "-") => value || fallback;

const Receipt = ({ shipment, componentReceipt }) => {
  const commodities = shipment.commodities || [];

  return (
    <div className="mb-10 p-10" ref={componentReceipt}>
      <div className="flex items-center justify-between">
        <div>
          <Image
            src="https://res.cloudinary.com/femzy123/image/upload/v1645026327/splendid/logo.png"
            width={80}
            height={78}
            preview={false}
            alt="logo"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Splendid Packaging</h3>
          <p className="text-sm">{safeText(shipment.warehouse?.location)}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold uppercase">Warehouse receipt</h3>
          <Barcode
            value={safeText(shipment.trackingNumber, "N/A")}
            width={1.5}
            height={50}
            fontSize={14}
          />
        </div>
      </div>
      <Divider className="bg-black border border-black" />
      <div className="mb-12 space-y-[30px]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold">Shipping ID</h4>
            <p className="text-lg">{safeText(shipment.id)}</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Shipper</h4>
            <p className="text-lg">{safeText(shipment.shipper)}</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Received By</h4>
            <p className="text-lg">{safeText(shipment.createdBy?.fullName)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold">Warehouse</h4>
            <p className="text-lg">{safeText(shipment.warehouse?.country)}</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Carrier</h4>
            <p className="text-lg">{safeText(shipment.carrier)}</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Consignee</h4>
            <p className="text-lg">{safeText(shipment.consignee)}</p>
          </div>
        </div>
      </div>

      <Table
        style={{ width: "100%" }}
        dataSource={commodities}
        size="small"
        pagination={false}
        summary={() => {
          return (
            <>
              <Table.Summary.Row style={{ fontSize: "18px" }}>
                <Table.Summary.Cell
                  className="font-semibold text-right"
                  colSpan={6}
                >
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <p className="font-semibold">
                    {safeText(shipment.currency, "")} {safeText(shipment.totalCharge)}
                  </p>
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row style={{ fontSize: "18px" }}>
                <Table.Summary.Cell
                  className="font-semibold text-right"
                  colSpan={6}
                >
                  Amount Due
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <p className="font-semibold">
                    {safeText(shipment.currency, "")}{" "}
                    {shipment.paymentStatus === "paid"
                      ? "0.00"
                      : safeText(shipment.totalCharge)}
                  </p>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        bordered
      >
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Length" dataIndex="length" key="length" />
        <Column title="Width" dataIndex="width" key="width" />
        <Column title="Height" dataIndex="height" key="height" />
        <Column title="Volume" dataIndex="volume" key="volume" />
        <Column title="Weight" dataIndex="weight" key="weight" />
        <Column title="Quantity" dataIndex="quantity" key="quantity" />
        <Column title="Price" dataIndex="charge" key="charge" />
      </Table>
    </div>
  );
};

export default Receipt;
