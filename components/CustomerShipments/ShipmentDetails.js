import { Divider, Image, Table } from "antd";
import React from "react";
// import Barcode from "react-barcode";

const { Column } = Table;

const ShipmentDetails = ({ shipment }) => {
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-semibold">Customer</h5>
            <p className="text-lg">{shipment.customer.name}</p>
          </div>
          <div>
            <h5 className="text-xl font-semibold">Status</h5>
            <p className="text-lg">{shipment.status}</p>
          </div>
          <div>
            {/* <Barcode
              value={shipment.trackingNumber}
              width={1}
              height={50}
              fontSize={14}
            /> */}
          </div>
        </div>
        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-semibold">Date Received</h5>
            <p className="text-lg">{shipment.date}</p>
          </div>
          <div>
            <Image
              src="https://res.cloudinary.com/femzy123/image/upload/v1649634318/splendid/Line_18.png"
              alt="line"
              preview={false}
            />
          </div>
          <div className="text-right">
            <h5 className="text-xl font-semibold">Expected Delivery Date</h5>
            <p className="text-lg">{shipment.expectedDeliveryDate}</p>
          </div>
        </div>
        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-semibold">Warehouse</h5>
            <p className="text-lg">{shipment.warehouse.name}</p>
          </div>
          <div>
            <h5 className="text-xl font-semibold">Received By</h5>
            <p className="text-lg capitalize">{shipment.createdBy.fullName}</p>
          </div>
          <div>
            <h5 className="text-xl font-semibold">Carrier</h5>
            <p className="text-lg capitalize">{shipment.carrier}</p>
          </div>
        </div>
        <Divider />

        <div className="flex items-center justify-between space-x-10">
          <div className="w-[40%]">
            <h5 className="text-xl font-semibold">Shipper</h5>
            <p className="text-[16px]">{shipment.shipper}</p>
            <p className=" text-sm text-gray-400">
              <span className="font-semibold text-black">Address: </span>
              {shipment.shipperAddress}
            </p>
          </div>
          <div className="w-[40%] text-right">
            <h5 className="text-xl font-semibold">Consignee</h5>
            <p className="text-[16px]">{shipment.consignee}</p>
            <p className=" text-sm text-gray-400">
              <span className="font-semibold text-black">Address: </span>
              {shipment.consigneeAddress}
            </p>
          </div>
        </div>
        <Divider />

        <div className="">
          <h5 className="text-xl font-semibold mb-4">Commodities</h5>
          <Table
            style={{ width: "100%" }}
            dataSource={shipment.commodities}
            size="small"
            pagination={false}
          >
            <Column
              title="Description"
              dataIndex="description"
              key="description"
            />
            <Column title="Length" dataIndex="length" key="length" />
            <Column title="Width" dataIndex="width" key="width" />
            <Column title="Height" dataIndex="height" key="height" />
            <Column title="Volume" dataIndex="volume" key="volume" />
            <Column title="Weight" dataIndex="weight" key="weight" />
            <Column title="Quantity" dataIndex="quantity" key="quantity" />
            <Column title="Price" dataIndex="charge" key="charge" />
          </Table>
        </div>
        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-semibold">Charges</h5>
            <p className="text-sm">
              {shipment.currency}{" "}
              <span
                className={`${
                  shipment.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                } text-lg font-bold`}
              >
                {shipment.totalCharge}
              </span>
            </p>
          </div>
          <div>
            <h5 className="text-xl font-semibold">Payment Status</h5>
            <p
              className={`${
                shipment.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-red-600"
              } text-lg font-semibold capitalize`}
            >
              {shipment.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShipmentDetails;