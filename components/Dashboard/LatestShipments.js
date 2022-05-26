import React from 'react';
import { Table, Space, Button, Modal } from 'antd';

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

const paymentStatusColor = (status) => {
  if(status === "paid") {
    return "#8eb150";
  } else {
    return "#FF0000";
  }
};

const LatestShipments = ({shipments}) => {
  const pendingShipments = shipments.filter(shipment => shipment.status !== 'Delivered');
  console.log(pendingShipments);

  return (
    <div className="my-6">
      <h3 className="font-bold text-xl mt-2 mb-4 text-purple-600">
        Pending Shipments
      </h3>
      <div className='w-full overflow-x-auto'>
        <Table dataSource={pendingShipments} size="small" pagination={false}>
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
                  className="rounded-full text-white py-[1px] px-[8px] active:outline-none outline-none"
                >
                  {record.status}
                </p>
              </Space>
            )}
          />
          <Column
            title="Expected Delivery Date"
            dataIndex="expectedDeliveryDate"
            key="date"
          />
          <Column title="Receiver" dataIndex="consignee" key="consignee" />
          <Column
            title="Destination"
            dataIndex="consigneeAddress"
            key="consigneeAddress"
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
        </Table>
      </div>
    </div>
  );
}

export default LatestShipments;
