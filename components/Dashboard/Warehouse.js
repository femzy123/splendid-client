/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { Divider, Select, Alert } from 'antd';

const {Option} = Select

const Warehouse = ({warehouses}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);
  const [warehouse, setVWarehouse] = useState(warehouses[0].id);

  const handleChange = (value) => {
    console.log(value)
    setVWarehouse(value)
    setSelectedWarehouse(
      warehouses.filter((warehouse) => warehouse.id === value)[0]
    );
  }
  
  return (
    <div className="mt-4 rounded-[20px] bg-white p-4">
      <h4 className="text-sm font-semibold">Your Shipping Address</h4>
      <hr className="my-2" />
      <Select
        className="w-full"
        value={warehouse}
        onChange={(value) => handleChange(value)}
      >
        {warehouses.map((warehouse) => (
          <Option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </Option>
        ))}
      </Select>
      <Alert
        className="my-2 text-xs"
        message="Please use the exact address below for shopping, so we can easily identify your package. It will be deliverd to our warehouse in Lagos, Nigeria"
        type="info"
      />
      {selectedWarehouse && (
        <div className="bg-purple-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-full">
              <p className="w-max font-semibold rounded bg-purple-600 text-white px-2 py-[2px]">
                Name
              </p>
            </div>
            <div className="w-full">{selectedWarehouse.name}</div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="w-full">
              <p className="w-max font-semibold rounded bg-purple-600 text-white px-2 py-[2px]">
                Address
              </p>
            </div>
            <div className="w-full">{selectedWarehouse.location}</div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="w-full">
              <p className="w-max font-semibold rounded bg-purple-600 text-white px-2 py-[2px]">
                Country
              </p>
            </div>
            <div className="w-full">{selectedWarehouse.country}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warehouse;
